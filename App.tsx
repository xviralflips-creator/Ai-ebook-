import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { StoryWizard } from './views/StoryWizard';
import { StoryEditor } from './views/StoryEditor';
import { StoryReader } from './views/StoryReader';
import { Story, StorySettings, ViewState } from './types';
import { MOCK_STORIES } from './constants';
import { generateStoryStructure, generateIllustration } from './services/geminiService';
import { BookOpen } from 'lucide-react';

function App() {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [stories, setStories] = useState<Story[]>(MOCK_STORIES);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle switching views and ensuring state consistency
  const handleChangeView = (newView: ViewState) => {
    setView(newView);
    if (newView === ViewState.DASHBOARD || newView === ViewState.WIZARD) {
      setActiveStory(null);
    }
  };

  const handleDeleteStory = (id: string) => {
    setStories(prev => prev.filter(s => s.id !== id));
  };

  const handleCreateStory = async (settings: StorySettings) => {
    setIsGenerating(true);
    try {
      // 1. Generate Structure (Text)
      const structure = await generateStoryStructure(settings);
      
      const newStory: Story = {
        id: Date.now().toString(),
        title: structure.title,
        description: structure.description,
        genre: settings.genre,
        targetAge: settings.ageGroup,
        artStyle: settings.artStyle,
        createdAt: new Date(),
        isPublic: false,
        pages: structure.pages.map(p => ({ ...p, isLoadingImage: true }))
      };

      // Add to list immediately so user sees it
      setStories(prev => [newStory, ...prev]);
      setActiveStory(newStory);
      setView(ViewState.EDITOR);
      setIsGenerating(false);

      // 2. Background Generation of Images (One by one to avoid rate limits and provide progress)
      // Note: In a real app, this would be a server-side job.
      generateStoryImages(newStory.id, newStory.pages, settings.artStyle);

    } catch (error) {
      console.error("Story generation failed", error);
      alert("Failed to generate story. Please check your API key and try again.");
      setIsGenerating(false);
    }
  };

  // Helper to generate images sequentially
  const generateStoryImages = async (storyId: string, pages: any[], artStyle: string) => {
    const updatedPages = [...pages];
    
    // Generate Cover (using first page prompt for now)
    try {
      const coverUrl = await generateIllustration(`Cover art for a story about: ${pages[0].imagePrompt}`, artStyle);
       setStories(currentStories => 
        currentStories.map(s => s.id === storyId ? { ...s, coverImage: coverUrl } : s)
      );
    } catch(e) { console.error("Cover gen failed", e)}

    // Generate Pages
    for (let i = 0; i < pages.length; i++) {
      try {
        const imageUrl = await generateIllustration(pages[i].imagePrompt, artStyle);
        updatedPages[i] = { ...updatedPages[i], imageUrl, isLoadingImage: false };
        
        // Update state progressively
        setStories(currentStories => 
          currentStories.map(s => s.id === storyId ? { ...s, pages: updatedPages } : s)
        );
        
        // Also update active story if it's currently open
        setActiveStory(prev => prev?.id === storyId ? { ...prev, pages: updatedPages } : prev);
        
      } catch (error) {
        console.error(`Image generation failed for page ${i + 1}`, error);
      }
    }
  };

  const handleUpdateStory = (updatedStory: Story) => {
    setStories(prev => prev.map(s => s.id === updatedStory.id ? updatedStory : s));
    setActiveStory(updatedStory);
  };

  // Render logic based on view state
  if (view === ViewState.READER && activeStory) {
    return <StoryReader story={activeStory} onClose={() => setView(ViewState.EDITOR)} />;
  }

  return (
    <Layout currentView={view} onChangeView={handleChangeView}>
      {view === ViewState.DASHBOARD && (
        <Dashboard 
          stories={stories} 
          onSelectStory={(story) => {
            setActiveStory(story);
            setView(ViewState.EDITOR);
          }}
          onDeleteStory={handleDeleteStory}
          onChangeView={handleChangeView}
        />
      )}

      {view === ViewState.WIZARD && (
        <StoryWizard 
          onGenerate={handleCreateStory}
          isGenerating={isGenerating}
        />
      )}

      {view === ViewState.EDITOR && activeStory && (
        <StoryEditor 
          story={activeStory}
          onSave={handleUpdateStory}
          onClose={() => handleChangeView(ViewState.DASHBOARD)}
          onRead={() => setView(ViewState.READER)}
        />
      )}

      {/* Empty State / Loading Fallback if view state mismatches */}
      {view === ViewState.EDITOR && !activeStory && (
        <div className="flex items-center justify-center h-full text-slate-400">
           <div className="text-center">
             <BookOpen className="w-12 h-12 mx-auto mb-2 animate-bounce"/>
             <p>Loading Story...</p>
           </div>
        </div>
      )}
    </Layout>
  );
}

export default App;