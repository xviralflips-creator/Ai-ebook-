import React, { useEffect, useState } from 'react';
import { Story, StoryPage } from '../types';
import { Button } from '../components/Button';
import { Save, RefreshCw, Eye, Download, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { generateIllustration } from '../services/geminiService';

interface StoryEditorProps {
  story: Story;
  onSave: (story: Story) => void;
  onClose: () => void;
  onRead: () => void;
}

export const StoryEditor: React.FC<StoryEditorProps> = ({ story, onSave, onClose, onRead }) => {
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [localStory, setLocalStory] = useState<Story>(story);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);

  // Sync props to local state if parent updates
  useEffect(() => {
    setLocalStory(story);
  }, [story]);

  const activePage = localStory.pages[activePageIdx];

  const handleRegenerateImage = async () => {
    setIsRegeneratingImage(true);
    try {
      const newImageUrl = await generateIllustration(activePage.imagePrompt, localStory.artStyle);
      
      const updatedPages = [...localStory.pages];
      updatedPages[activePageIdx] = {
        ...activePage,
        imageUrl: newImageUrl
      };
      
      const updatedStory = { ...localStory, pages: updatedPages };
      setLocalStory(updatedStory);
      onSave(updatedStory); // Auto save
    } catch (error) {
      console.error("Failed to regenerate", error);
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  const handleExportPDF = () => {
    // Mock PDF export for frontend demo
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-slate-100">
      {/* Editor Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900">{localStory.title}</h2>
            <p className="text-xs text-slate-500">Editor Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button variant="primary" size="sm" onClick={onRead}>
            <Eye className="w-4 h-4 mr-2" /> Read Mode
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar: Page Thumbnails */}
        <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto hidden md:block">
          <div className="p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Pages</h3>
            {localStory.pages.map((page, idx) => (
              <div 
                key={idx}
                onClick={() => setActivePageIdx(idx)}
                className={`cursor-pointer rounded-lg p-2 border transition-all ${
                  idx === activePageIdx 
                    ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="aspect-[4/3] bg-slate-200 rounded mb-2 overflow-hidden">
                  {page.imageUrl ? (
                    <img src={page.imageUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Page {idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col min-h-[600px]">
            
            {/* Image Section */}
            <div className="relative aspect-video bg-slate-100 group">
              {activePage.imageUrl ? (
                <img src={activePage.imageUrl} alt="Story visual" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col gap-2">
                   {isRegeneratingImage ? (
                     <div className="animate-pulse flex flex-col items-center">
                       <div className="h-8 w-8 bg-brand-200 rounded-full mb-2"></div>
                       <span className="text-slate-400 text-sm">Painting...</span>
                     </div>
                   ) : (
                     <Button variant="outline" onClick={handleRegenerateImage}>Generate Image</Button>
                   )}
                </div>
              )}
              
              {/* Image Controls Overlay */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="shadow-lg backdrop-blur-md bg-white/90"
                  onClick={handleRegenerateImage}
                  isLoading={isRegeneratingImage}
                >
                  <RefreshCw className="w-3 h-3 mr-2" /> Regenerate Art
                </Button>
              </div>
            </div>

            {/* Text Section */}
            <div className="p-8 md:p-12 flex-1 flex flex-col">
              <div className="prose prose-lg max-w-none mb-6 font-serif">
                <p>{activePage.text}</p>
              </div>
              
              <div className="mt-auto pt-6 border-t border-slate-100">
                <p className="text-xs font-mono text-slate-400 mb-2">Image Prompt:</p>
                <div className="bg-slate-50 p-3 rounded text-xs text-slate-600 font-mono break-words">
                  {activePage.imagePrompt}
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
              <Button 
                variant="ghost" 
                disabled={activePageIdx === 0}
                onClick={() => setActivePageIdx(prev => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-slate-600">
                Page {activePageIdx + 1} of {localStory.pages.length}
              </span>
              <Button 
                variant="ghost" 
                disabled={activePageIdx === localStory.pages.length - 1}
                onClick={() => setActivePageIdx(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};