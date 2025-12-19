
import React, { useState } from 'react';
import { Video, Loader2, Sparkles, X, Download, Play, Eye } from 'lucide-react';
import { generateVideoAd } from '../geminiService';

interface VideoExportButtonProps {
  posterData: any;
}

const VideoExportButton: React.FC<VideoExportButtonProps> = ({ posterData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleVideoGeneration = async () => {
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
    }

    setIsGenerating(true);
    setStatus("Analisando roteiro...");
    
    try {
      const messages = [
        "Iniciando renderização de IA...",
        "Simulando câmeras cinematográficas...",
        "Animando elementos visuais...",
        "Finalizando comercial Elite..."
      ];
      
      let msgIndex = 0;
      const interval = setInterval(() => {
        setStatus(messages[msgIndex % messages.length]);
        msgIndex++;
      }, 4000);

      const url = await generateVideoAd(posterData);
      clearInterval(interval);
      setVideoUrl(url);
      setShowPreview(true);
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.message || "Erro inesperado ao gerar vídeo.";
      
      if (errorMsg.includes("Requested entity was not found")) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        alert("Por favor, selecione uma chave de API válida de um projeto com faturamento ativo.");
      } else {
        alert(errorMsg);
      }
    } finally {
      setIsGenerating(false);
      setStatus("");
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `comercial-elite-${Date.now()}.mp4`;
      link.click();
    }
  };

  return (
    <>
      <button
        onClick={handleVideoGeneration}
        disabled={isGenerating}
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 disabled:from-slate-800 disabled:to-slate-900 text-white px-6 py-2.5 rounded-full transition-all shadow-[0_10px_20px_rgba(99,102,241,0.3)] font-black text-xs uppercase tracking-widest relative overflow-hidden group"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="animate-pulse">{status || "Gerando Vídeo..."}</span>
          </>
        ) : (
          <>
            <Video className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            {videoUrl ? "Ver Vídeo Gerado" : "Gerar Vídeo (IA)"}
            <Sparkles className="w-3 h-3 absolute top-1 right-2 text-yellow-300 animate-pulse" />
          </>
        )}
      </button>

      {/* Modal de Preview */}
      {showPreview && videoUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl max-w-sm w-full overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest text-white">Preview do Comercial</span>
              </div>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="relative aspect-[9/16] bg-black">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900/80 flex flex-col gap-3">
              <button 
                onClick={handleDownload}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
              >
                <Download className="w-5 h-5" />
                BAIXAR VÍDEO MP4
              </button>
              <button 
                onClick={() => setShowPreview(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-4 rounded-2xl transition-all"
              >
                FECHAR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoExportButton;
