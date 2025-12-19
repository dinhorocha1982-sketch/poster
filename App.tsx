
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Upload, 
  X, 
  ChevronLeft, 
  Wand2, 
  ImageIcon, 
  ArrowRight,
  Plus,
  RefreshCcw,
  Layout,
  MousePointer2,
  Type as TypeIcon,
  Video,
  Key
} from 'lucide-react';
import { PosterData, PosterStyle } from './types';
import { refineContent, generateAIImage } from './geminiService';
import PosterCard from './components/PosterCard';
import ExportButton from './components/ExportButton';
import VideoExportButton from './components/VideoExportButton';

const INITIAL_FORM_DATA: PosterData = {
  title: '',
  subtitle: '',
  description: '',
  callToAction: '',
  contact: '',
  link: '',
  image: null,
  accentColor: '#6366f1'
};

const AI_STATUS_MESSAGES = [
  "Lendo seu texto...",
  "Extraindo informações...",
  "Criando ganchos de atenção...",
  "Otimizando layout...",
  "Sincronizando tipografia...",
  "Quase pronto!"
];

const App: React.FC = () => {
  const [rawInput, setRawInput] = useState("");
  const [formData, setFormData] = useState<PosterData>(INITIAL_FORM_DATA);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [view, setView] = useState<'editor' | 'preview'>('editor');

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      setStatusMessage(AI_STATUS_MESSAGES[0]);
      let i = 1;
      interval = setInterval(() => {
        setStatusMessage(AI_STATUS_MESSAGES[i % AI_STATUS_MESSAGES.length]);
        i++;
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleOpenKey = async () => {
    // @ts-ignore
    await window.aistudio.openSelectKey();
  };

  const handleProcessEverything = async () => {
    if (!rawInput.trim()) {
      alert("Por favor, cole as informações do seu evento ou produto!");
      return;
    }
    
    setIsProcessing(true);
    try {
      const refined = await refineContent(rawInput);
      
      let imageUrl = formData.image;
      if (!imageUrl) {
        try {
          imageUrl = await generateAIImage(refined.title || rawInput.substring(0, 50));
        } catch (imgError: any) {
          console.warn("Imagem ignorada por cota ou erro.", imgError);
        }
      }

      setFormData(prev => ({ ...prev, ...refined, image: imageUrl }));
      setView('preview');
    } catch (error: any) {
      console.error(error);
      const msg = error.message || "";
      if (msg.includes("429") || msg.includes("LIMITE DE COTA") || msg.includes("RESOURCE_EXHAUSTED")) {
        alert("Limite de uso atingido. Clique no ícone de chave (topo direito) para usar sua própria chave de API paga e remover os limites.");
      } else {
        alert(msg || "Erro ao processar com IA.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const allStyles = Object.values(PosterStyle);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600 rounded-full blur-[140px] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setView('editor')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-black text-2xl tracking-tighter text-white">
              POSTER<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">ELITE</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleOpenKey}
               className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 transition-all shadow-lg active:scale-95"
               title="Trocar Chave de API para evitar limites de cota"
             >
               <Key className="w-3 h-3" />
               Chave API
             </button>
             <div className="hidden md:block bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
               Versão 2.1 • IA Ativa
             </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        {isProcessing && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md">
            <div className="relative w-32 h-32 mb-10">
              <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-12 h-12 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-3xl font-display font-black tracking-[0.3em] text-white animate-pulse uppercase text-center px-4">
              {statusMessage}
            </p>
            <p className="mt-8 text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Aguarde, a IA está processando sua arte...</p>
          </div>
        )}

        {view === 'editor' ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
              <h1 className="text-6xl font-display font-black tracking-tighter text-white leading-none">
                Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 italic">Profissional</span> com IA
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                Cole sua ideia e deixe a inteligência artificial criar cartazes e vídeos comerciais de elite.
              </p>
            </div>

            <div className="bg-slate-900/40 p-2 rounded-[2.5rem] border border-slate-800 shadow-2xl backdrop-blur-md">
              <div className="p-8 space-y-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-3xl blur opacity-25 group-focus-within:opacity-50 transition duration-500"></div>
                  <textarea 
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                    placeholder="Cole aqui o texto do seu evento, promoção ou produto. A IA fará o resto!"
                    className="relative w-full h-64 bg-slate-950 border border-slate-800 rounded-2xl px-8 py-8 text-xl text-white placeholder:text-slate-700 focus:outline-none transition-all resize-none font-medium leading-relaxed"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <label className="flex items-center gap-4 w-full h-20 border-2 border-dashed border-slate-800 rounded-2xl cursor-pointer bg-slate-950/40 hover:bg-slate-900 hover:border-indigo-500/50 transition-all group px-6">
                      <div className="p-3 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-widest text-white">Sua Foto</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Opcional</span>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      {formData.image && <div className="ml-auto flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest animate-pulse"><Sparkles className="w-3 h-3"/> Ok!</div>}
                    </label>
                  </div>

                  <button 
                    onClick={handleProcessEverything}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-black py-6 rounded-2xl text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 group active:scale-95"
                  >
                    CRIAR ARTE AGORA
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-900 pb-12">
              <div className="text-center md:text-left">
                <h1 className="text-5xl font-display font-black text-white mb-3 tracking-tighter">RESULTADO <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400 italic">ELITE</span></h1>
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs opacity-70">Modelos Estáticos ou Vídeos MP4 para Redes Sociais.</p>
              </div>
              <button 
                onClick={() => setView('editor')}
                className="group flex items-center gap-3 bg-slate-800 hover:bg-slate-700 text-white px-10 py-4 rounded-3xl font-black transition-all border border-slate-700 shadow-xl active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                VOLTAR / NOVO
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {allStyles.map((style, index) => (
                <div key={style} className="space-y-6" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex flex-wrap items-center justify-between px-2 gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Estilo: {style}</span>
                    <div className="flex items-center gap-2">
                      <ExportButton elementId={`poster-render-${style}`} filename={`cartaz-${style}`} />
                      <VideoExportButton posterData={formData} />
                    </div>
                  </div>
                  <PosterCard data={formData} style={style} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-slate-900 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.5em] text-center leading-loose">
            Design de Alta Performance • Google Veo & Gemini 3 • 2025
          </p>
          <p className="text-slate-800 text-[9px] font-medium text-center max-w-lg">
            Se encontrar erros de cota (429), utilize sua própria Chave de API através do botão no topo da página. O uso gratuito do Google possui limites rígidos de requisições por minuto.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
