import React, { useEffect, useState } from 'react';
import { Story, StoryPage } from '../types';
import { Button } from '../components/Button';
import { Save, RefreshCw, Eye, Download, ArrowLeft, Image as ImageIcon, FileText } from 'lucide-react';
import { generateIllustration } from '../services/geminiService';
import jsPDF from 'jspdf';

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
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // Title Page
      doc.setFillColor(240, 249, 255); // brand-50
      doc.rect(0, 0, width, height, 'F');
      
      doc.setFont("times", "bold");
      doc.setFontSize(32);
      doc.setTextColor(14, 165, 233); // brand-500
      
      // Split title if too long
      const titleLines = doc.splitTextToSize(localStory.title, width - 40);
      doc.text(titleLines, width / 2, height / 2 - 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(80, 80, 80);
      doc.text(`A StoryForge AI Original`, width / 2, height / 2 + 10, { align: 'center' });
      
      // Cover Image if exists
      if (localStory.coverImage) {
        try {
           // We need to fetch the image to get base64/blob if it's a URL to avoid CORS in some instances, 
           // but jsPDF handles some URLs. Best to try-catch.
           // For simplicity in this demo, we assume the URL is accessible.
           // Note: Pollinations images are CORS friendly.
           doc.addImage(localStory.coverImage, 'JPEG', width/2 - 40, height/2 + 20, 80, 80);
        } catch (e) { console.warn("Could not add cover", e); }
      }

      // Story Pages
      for (const page of localStory.pages) {
        doc.addPage();
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, width, height, 'F');

        // Image on Left (approx 45% width)
        if (page.imageUrl) {
          try {
             doc.addImage(page.imageUrl, 'JPEG', 10, 20, (width / 2) - 20, height - 40);
          } catch(e) { console.warn("Could not add image", e)}
        }

        // Text on Right
        doc.setFont("times", "normal");
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        
        const textLines = doc.splitTextToSize(page.text, (width / 2) - 20);
        doc.text(textLines, (width / 2) + 10, height / 2, { align: 'left', maxWidth: (width / 2) - 20 });
        
        // Page Number
        doc.setFontSize(10);
        doc.text(`Page ${page.pageNumber}`, width - 10, height - 10, { align: 'right' });
      }

      doc.save(`${localStory.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
    } catch (error) {
      console.error("Export failed", error);
      alert("Failed to create PDF. Please ensure all images are loaded.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-100">
      {/* Editor Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">{localStory.title}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">{localStory.genre}</span>
                <span>•</span>
                <span>{localStory.pages.length} Pages</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF} isLoading={isExporting}>
            <Download className="w-4 h-4 mr-2" /> PDF / eBook
          </Button>
          <Button variant="primary" size="sm" onClick={onRead}>
            <Eye className="w-4 h-4 mr-2" /> Read Mode
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar: Page Thumbnails */}
        <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto hidden lg:block custom-scrollbar">
          <div className="p-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Story Board</h3>
            {localStory.pages.map((page, idx) => (
              <div 
                key={idx}
                onClick={() => setActivePageIdx(idx)}
                className={`group cursor-pointer rounded-xl p-3 border-2 transition-all duration-200 ${
                  idx === activePageIdx 
                    ? 'border-brand-500 bg-brand-50/50 shadow-sm' 
                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex gap-3">
                    <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                    {page.imageUrl ? (
                        <img src={page.imageUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-6 h-6" />
                        </div>
                    )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <span className="text-xs font-bold text-slate-700 mb-1">Page {idx + 1}</span>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{page.text}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-100">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col min-h-[600px] animate-in fade-in duration-300">
            
            <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="w-full md:w-1/2 bg-slate-50 relative group border-b md:border-b-0 md:border-r border-slate-100">
                {activePage.imageUrl ? (
                    <img src={activePage.imageUrl} alt="Story visual" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center flex-col gap-3 p-8 text-center">
                        <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-500 mb-2">
                             <ImageIcon className="w-8 h-8" />
                        </div>
                        {isRegeneratingImage ? (
                            <div className="flex flex-col items-center">
                                <span className="loading-spinner mb-2"></span>
                                <span className="text-brand-600 font-medium">Creating visual magic...</span>
                            </div>
                        ) : (
                            <>
                                <p className="text-slate-500">No illustration yet.</p>
                                <Button variant="outline" onClick={handleRegenerateImage}>Generate Image</Button>
                            </>
                        )}
                    </div>
                )}
                
                {/* Image Controls Overlay */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                    size="sm" 
                    variant="secondary" 
                    className="shadow-lg backdrop-blur-md bg-white/90 hover:bg-white text-slate-700"
                    onClick={handleRegenerateImage}
                    isLoading={isRegeneratingImage}
                    >
                    <RefreshCw className="w-3 h-3 mr-2" /> Re-Draw
                    </Button>
                </div>
                </div>

                {/* Text Section */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-white">
                <div className="flex-1 flex flex-col justify-center">
                    <span className="text-brand-600 font-bold text-sm tracking-wide uppercase mb-6">Page {activePage.pageNumber}</span>
                    <div className="prose prose-lg max-w-none font-serif text-slate-800 leading-loose">
                        <p>{activePage.text}</p>
                    </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Art Prompt</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg text-xs text-slate-600 font-mono break-words border border-slate-100">
                    {activePage.imagePrompt}
                    </div>
                </div>
                </div>
            </div>

            {/* Pagination Bar */}
            <div className="bg-white p-4 border-t border-slate-200 flex justify-between items-center px-8">
              <Button 
                variant="ghost" 
                disabled={activePageIdx === 0}
                onClick={() => setActivePageIdx(prev => prev - 1)}
              >
                Previous Page
              </Button>
              <div className="flex gap-1">
                  {localStory.pages.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${i === activePageIdx ? 'w-8 bg-brand-500' : 'w-2 bg-slate-200'}`} />
                  ))}
              </div>
              <Button 
                variant="ghost" 
                disabled={activePageIdx === localStory.pages.length - 1}
                onClick={() => setActivePageIdx(prev => prev + 1)}
              >
                Next Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};