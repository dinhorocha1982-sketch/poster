
import React from 'react';
import { PosterData, PosterStyle } from '../types';
import { Sparkles, ExternalLink } from 'lucide-react';

interface PosterCardProps {
  data: PosterData;
  style: PosterStyle;
}

const PosterCard: React.FC<PosterCardProps> = ({ data, style }) => {
  const containerId = `poster-render-${style}`;

  const getStyleConfigs = () => {
    switch (style) {
      case PosterStyle.CYBER:
        return {
          overlay: 'bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-pink-900/80 backdrop-blur-[1px]',
          titleClass: 'text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] uppercase tracking-tighter italic animate-[pulse_1.5s_ease-in-out_infinite] leading-[0.9]',
          subtitleClass: 'text-xl font-black text-white tracking-[0.3em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)] opacity-90 animate-[bounce_4s_infinite]',
          contentLayout: 'items-start text-left pt-16 px-12',
          btnClass: 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.8)] hover:scale-110 animate-pulse',
          decor: (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)]"></div>
              <div className="absolute bottom-0 right-0 w-1 h-full bg-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,1)]"></div>
              <div className="absolute top-20 right-10 w-32 h-32 border border-cyan-400/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/20 blur-[100px]"></div>
            </div>
          )
        };
      case PosterStyle.ELEGANT:
        return {
          overlay: 'bg-slate-950/60 backdrop-blur-[4px]',
          titleClass: 'text-5xl font-serif text-white tracking-[0.2em] leading-tight border-y border-white/20 py-8 inline-block mb-4 animate-[fadeIn_2s_ease-out] font-light',
          subtitleClass: 'text-xl font-medium text-white tracking-[0.3em] uppercase opacity-80 animate-[pulse_5s_infinite]',
          contentLayout: 'items-center text-center justify-center px-16',
          btnClass: 'bg-white text-slate-900 shadow-2xl hover:tracking-widest transition-all duration-700 hover:bg-indigo-50 font-black',
          decor: (
            <div className="absolute inset-10 border border-white/10 pointer-events-none">
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-white"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white"></div>
            </div>
          )
        };
      case PosterStyle.VIBRANT:
        return {
          overlay: 'bg-gradient-to-tr from-yellow-500/50 via-transparent to-rose-500/50',
          titleClass: 'text-7xl font-black text-white drop-shadow-[0_12px_12px_rgba(0,0,0,0.6)] -rotate-3 scale-110 mb-8 animate-[wiggle_0.8s_ease-in-out_infinite]',
          subtitleClass: 'text-2xl font-black text-yellow-300 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] italic tracking-tight',
          contentLayout: 'items-center text-center justify-center px-10',
          btnClass: 'bg-yellow-400 text-black font-black scale-125 hover:scale-110 shadow-2xl animate-[bounce_2s_infinite]',
          decor: (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-rose-500/30 rounded-full blur-[80px]"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-yellow-400/30 rounded-full blur-[80px]"></div>
              <div className="absolute top-1/4 left-10 w-6 h-6 bg-white rotate-45 animate-ping"></div>
            </div>
          )
        };
      case PosterStyle.RETRO:
        return {
          overlay: 'bg-amber-100/15 mix-blend-overlay border-[20px] border-amber-900/10',
          titleClass: 'text-6xl font-black text-amber-900 [text-shadow:4px_4px_0px_#fff,8px_8px_0px_#78350f] mb-6 animate-[pulse_3s_infinite]',
          subtitleClass: 'text-xl font-bold text-amber-950 uppercase tracking-widest bg-white/40 px-6 py-2 inline-block border-2 border-amber-950/20',
          contentLayout: 'items-center text-center pt-24 px-10',
          btnClass: 'bg-amber-800 text-amber-50 rounded-none border-b-8 border-amber-950 hover:translate-y-2 hover:border-b-0 shadow-2xl font-black',
          decor: (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-30"></div>
              <div className="absolute top-10 right-10 w-16 h-16 border-4 border-amber-900/20 rounded-full"></div>
            </div>
          )
        };
      default:
        return {
          overlay: 'bg-slate-900/70',
          titleClass: 'text-5xl font-bold text-white',
          subtitleClass: 'text-xl text-white/80',
          contentLayout: 'items-center text-center justify-center px-12',
          btnClass: 'bg-indigo-600',
          decor: null
        };
    }
  };

  const styleConfig = getStyleConfigs();

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.link) {
      const url = data.link.startsWith('http') ? data.link : `https://${data.link}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div id={containerId} className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] bg-slate-800 group transition-all duration-700 hover:shadow-indigo-500/30">
      {/* Background */}
      {data.image ? (
        <img src={data.image} alt="Poster" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-125" />
      ) : (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
           <Sparkles className="w-16 h-16 text-indigo-500/10 animate-pulse" />
        </div>
      )}

      {/* Style Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${styleConfig.overlay}`}></div>
      
      {/* Decorative Elements */}
      {styleConfig.decor}

      {/* Content Layer */}
      <div className={`relative z-10 h-full w-full flex flex-col ${styleConfig.contentLayout} gap-8`}>
        <div className="w-full space-y-2">
          <h1 className={`${styleConfig.titleClass} transition-all duration-500`}>
            {data.title || "Título Incrível"}
          </h1>
          
          {data.subtitle && (
            <p className={styleConfig.subtitleClass}>
              {data.subtitle}
            </p>
          )}
        </div>

        {data.description && (
          <div className="bg-black/70 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 max-w-[85%] transform transition-all group-hover:bg-black/80 animate-[fadeIn_1.5s_ease-in] shadow-2xl">
            <p className="text-white/95 leading-relaxed text-sm font-medium italic">
              {data.description}
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-6 mt-4 w-full">
          {(data.callToAction || data.link) && (
            <button 
              onClick={handleLinkClick}
              className={`group/btn flex items-center gap-4 px-12 py-5 rounded-full font-black text-2xl transition-all duration-300 active:scale-90 shadow-2xl ${styleConfig.btnClass}`}
            >
              {data.callToAction || 'SAIBA MAIS'}
              {data.link && <ExternalLink className="w-6 h-6 group-hover/btn:rotate-12 transition-transform" />}
            </button>
          )}
          
          {data.contact && (
            <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl text-white font-black text-xs tracking-[0.4em] uppercase border border-white/10 shadow-lg animate-pulse">
              {data.contact}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg) scale(1.1); }
          50% { transform: rotate(3deg) scale(1.1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Gloss Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
    </div>
  );
};

export default PosterCard;
