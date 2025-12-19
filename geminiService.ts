
import { GoogleGenAI, Type } from "@google/genai";
import { AIContentResponse } from "./types";

/**
 * Cria uma nova instância do cliente GenAI.
 * Recria a cada chamada para garantir o uso da chave de API mais recente do ambiente.
 */
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Helper para executar chamadas de API com retry em caso de limite de cota (429)
 * ou erros temporários de servidor (500, 503).
 */
async function executeWithRetry<T>(fn: () => Promise<T>, maxRetries = 4): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMsg = error.message || "";
      const isRateLimit = errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("quota");
      const isTransient = errorMsg.includes("500") || errorMsg.includes("503") || errorMsg.includes("deadline");

      if (isRateLimit || isTransient) {
        // Aumenta o tempo de espera: 3s, 7s, 15s, 31s...
        const waitTime = (Math.pow(2, i + 2) - 1) * 1000;
        console.warn(`[IA] Tentativa ${i + 1}/${maxRetries} falhou (${isRateLimit ? 'Cota' : 'Servidor'}). Aguardando ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error; 
    }
  }
  
  if (lastError?.message?.includes("429") || lastError?.message?.includes("RESOURCE_EXHAUSTED") || lastError?.message?.includes("quota")) {
    throw new Error("LIMITE DE COTA: O Google atingiu o limite de requisições. Para resolver isso permanentemente, clique no ícone de chave no topo e selecione sua própria Chave de API de um projeto pago (GCP) no Google AI Studio.");
  }
  throw lastError;
}

export const refineContent = async (rawText: string): Promise<AIContentResponse> => {
  return executeWithRetry(async () => {
    const ai = getAIClient();
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model,
      contents: `Transforme o seguinte texto em uma estrutura publicitária de alto impacto para um cartaz em Português do Brasil.
      Extraia:
      1. Um TÍTULO PRINCIPAL impactante (máx 4 palavras).
      2. Um SUBTÍTULO convincente (máx 8 palavras).
      3. Uma DESCRIÇÃO breve e persuasiva (1-2 frases curtas).
      4. Uma CHAMADA PARA AÇÃO forte (ex: "Compre Agora", "Participe").
      
      Conteúdo Original: "${rawText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            description: { type: Type.STRING },
            callToAction: { type: Type.STRING },
          },
          required: ["title", "subtitle", "description", "callToAction"]
        }
      }
    });

    try {
      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (e) {
      throw new Error("Erro ao processar resposta da IA. Tente reformular seu texto.");
    }
  });
};

export const generateAIImage = async (prompt: string): Promise<string> => {
  return executeWithRetry(async () => {
    const ai = getAIClient();
    const model = 'gemini-2.5-flash-image';
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: `Uma imagem de fundo profissional e cinematográfica em ultra-alta definição para um cartaz comercial. Assunto: ${prompt}. Estilo minimalista, abstrato ou atmosférico. Composição limpa com espaço para texto. Não inclua texto.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("A IA não gerou a imagem de fundo desta vez.");
  });
};

export const generateVideoAd = async (posterData: any): Promise<string> => {
  return executeWithRetry(async () => {
    const ai = getAIClient();
    const prompt = `Um vídeo publicitário vertical profissional para ${posterData.title}. ${posterData.description}. Alta energia, estética moderna, estilo motion graphics. 9:16.`;
    
    const config = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '9:16'
    } as const;

    let videoParams: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: config
    };

    if (posterData.image && typeof posterData.image === 'string' && posterData.image.includes('base64,')) {
      try {
        const parts = posterData.image.split('base64,');
        const mimeType = parts[0].split(':')[1].split(';')[0];
        const base64Data = parts[1];
        videoParams.image = { imageBytes: base64Data, mimeType: mimeType || 'image/png' };
      } catch (e) {}
    }

    let operation = await ai.models.generateVideos(videoParams);

    let attempts = 0;
    while (!operation.done && attempts < 80) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
      } catch (pollError: any) {
        if (pollError.message?.includes("429") || pollError.message?.includes("quota")) {
          await new Promise(resolve => setTimeout(resolve, 15000));
          continue;
        }
        throw pollError;
      }
      
      if (operation.error) {
        throw new Error(`Geração falhou: ${operation.error.message}`);
      }
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("A IA não retornou o vídeo. Tente novamente.");

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (response.status === 429) {
      throw new Error("Erro de cota ao baixar o vídeo. Selecione uma chave própria no ícone de chave acima.");
    }
    if (!response.ok) throw new Error("Erro ao baixar arquivo de vídeo.");
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  });
};
