import React, { useState } from 'react';
import { Story } from '../types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryReaderProps {
  story: Story;
  onClose: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({ story, onClose }) => {
  const [pageIndex, setPageIndex] = useState(0);

  // Combine cover page as page 0 (virtually) if needed, 
  // but for simplicity we iterate through the actual pages array.
  
  const nextPage = () => {
    if (pageIndex < story.pages.length - 1) setPageIndex(prev => prev + 1);
  };

  const prevPage = () => {
    if (pageIndex > 0) setPageIndex(prev => prev - 1);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center overflow-hidden">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="w-full max-w-6xl px-4 md:px-12 flex items-center justify-between gap-4 h-full py-8">
        
        {/* Navigation Left */}
        <button 
          onClick={prevPage}
          disabled={pageIndex === 0}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-0 transition-all"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Book Container */}
        <div className="flex-1 h-full max-h-[800px] aspect-[16/9] relative perspective-1000">
          <AnimatePresence mode='wait'>
            <motion.div
              key={pageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex bg-white rounded-lg overflow-hidden shadow-2xl"
            >
              {/* Image Side (Left on Desktop) */}
              <div className="w-1/2 h-full bg-slate-100 relative hidden md:block">
                 {story.pages[pageIndex]?.imageUrl && (
                   <img 
                    src={story.pages[pageIndex].imageUrl} 
                    alt="Scene" 
                    className="w-full h-full object-cover"
                   />
                 )}
              </div>

              {/* Text Side (Right on Desktop, Full on Mobile) */}
              <div className="w-full md:w-1/2 h-full p-8 md:p-16 flex flex-col justify-center bg-[#fffbf7]">
                <div className="md:hidden h-64 w-full mb-6 rounded-lg overflow-hidden shrink-0">
                  {story.pages[pageIndex]?.imageUrl && (
                   <img 
                    src={story.pages[pageIndex].imageUrl} 
                    alt="Scene" 
                    className="w-full h-full object-cover"
                   />
                 )}
                </div>
                
                <div className="prose prose-xl font-serif text-slate-800 leading-relaxed">
                  <p>{story.pages[pageIndex]?.text}</p>
                </div>

                <div className="mt-auto pt-8 flex justify-center text-slate-400 font-sans text-sm">
                  {pageIndex + 1}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Right */}
        <button 
          onClick={nextPage}
          disabled={pageIndex === story.pages.length - 1}
          className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-0 transition-all"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};