import React, { useState, useEffect, useRef } from 'react';
import { Story } from '../types';
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2, Volume2, VolumeX, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryReaderProps {
  story: Story;
  onClose: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({ story, onClose }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Stop speaking when unmounting
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    // Reset speech when page changes
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [pageIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageIndex]);

  const nextPage = () => {
    if (pageIndex < story.pages.length - 1) setPageIndex(prev => prev + 1);
  };

  const prevPage = () => {
    if (pageIndex > 0) setPageIndex(prev => prev - 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const text = story.pages[pageIndex]?.text;
      if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        // Try to find a good voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        
        utterance.onend = () => setIsPlaying(false);
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center overflow-hidden font-serif selection:bg-brand-500/30">
      
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
          {story.pages[pageIndex]?.imageUrl && (
              <img src={story.pages[pageIndex].imageUrl} className="w-full h-full object-cover blur-3xl scale-125 transition-all duration-1000" />
          )}
          <div className="absolute inset-0 bg-slate-900/60"></div>
      </div>

      {/* Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
            <button 
                onClick={onClose}
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md border border-white/10 group"
            >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>
            <h1 className="text-white/90 font-bold text-lg hidden md:block tracking-wide">{story.title}</h1>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={toggleSpeech}
                className={`p-3 rounded-full transition-all backdrop-blur-md border border-white/10 flex items-center gap-2 ${isPlaying ? 'bg-brand-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                title="Read Aloud"
            >
                {isPlaying ? <Volume2 className="w-5 h-5 animate-pulse" /> : <PlayCircle className="w-5 h-5" />}
                {isPlaying && <span className="text-xs font-bold pr-1">Playing</span>}
            </button>
            <button 
                onClick={toggleFullscreen}
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md border border-white/10"
                title="Toggle Fullscreen"
            >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
        </div>
      </div>

      {/* Main Book View */}
      <div className="w-full max-w-[1400px] h-full flex items-center justify-center p-4 md:p-8 relative z-10">
        
        {/* Nav Left */}
        <button 
          onClick={prevPage}
          disabled={pageIndex === 0}
          className="absolute left-4 md:left-10 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-0 disabled:pointer-events-none transition-all z-20 backdrop-blur-sm group"
        >
          <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Book Spreads */}
        <div className="w-full h-full max-h-[80vh] aspect-[16/9] perspective-2000 relative">
          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={pageIndex}
              initial={{ opacity: 0, rotateY: 90, scale: 0.9 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.9 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="absolute inset-0 flex flex-col md:flex-row bg-[#FDFBF7] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            >
              
              {/* Image Page (Left on Desktop) */}
              <div className="h-1/2 md:h-full md:w-1/2 relative bg-slate-100 overflow-hidden">
                 {story.pages[pageIndex]?.imageUrl ? (
                   <motion.img 
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear" }}
                    src={story.pages[pageIndex].imageUrl} 
                    alt="Scene" 
                    className="w-full h-full object-cover"
                   />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                        Image Loading...
                    </div>
                 )}
                 {/* Shadow/Fold Gradient */}
                 <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/20 to-transparent pointer-events-none hidden md:block"></div>
                 <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none md:hidden"></div>
              </div>

              {/* Text Page (Right on Desktop) */}
              <div className="h-1/2 md:h-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative bg-[#FDFBF7] paper-texture">
                {/* Fold Shadow Left */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/10 to-transparent pointer-events-none hidden md:block"></div>
                
                <div className="prose prose-lg md:prose-2xl font-serif text-slate-800 leading-relaxed max-w-none">
                  <motion.p
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.3 }}
                  >
                    <span className="text-5xl float-left font-black mr-2 text-brand-600 leading-[0.8]">
                        {story.pages[pageIndex]?.text.charAt(0)}
                    </span>
                    {story.pages[pageIndex]?.text.slice(1)}
                  </motion.p>
                </div>

                <div className="mt-auto pt-8 flex justify-between items-end text-slate-400 font-sans text-xs tracking-widest uppercase border-t border-slate-100/50">
                   <span>StoryForge AI</span>
                   <span>Page {pageIndex + 1} of {story.pages.length}</span>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav Right */}
        <button 
          onClick={nextPage}
          disabled={pageIndex === story.pages.length - 1}
          className="absolute right-4 md:right-10 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white disabled:opacity-0 disabled:pointer-events-none transition-all z-20 backdrop-blur-sm group"
        >
          <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Progress Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div 
            className="h-full bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${((pageIndex + 1) / story.pages.length) * 100}%` }}
        />
      </div>
    </div>
  );
};