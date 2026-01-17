import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { StoryWizard } from './views/StoryWizard';
import { StoryEditor } from './views/StoryEditor';
import { StoryReader } from './views/StoryReader';
import { AdminDashboard } from './views/AdminDashboard';
import { Login } from './views/Login';
import { Story, StorySettings, ViewState, User } from './types';
import { MOCK_STORIES } from './constants';
import { generateStoryStructure, generateIllustration } from './services/geminiService';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

function App() {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedStories = localStorage.getItem('storyforge_stories');
    if (savedStories) {
      setStories(JSON.parse(savedStories));
    } else {
      setStories(MOCK_STORIES);
    }

    const savedUser = localStorage.getItem('storyforge_user');
    if (savedUser) {
        setUser(JSON.parse(savedUser));
        setView(ViewState.DASHBOARD);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (stories.length > 0) {
        localStorage.setItem('storyforge_stories', JSON.stringify(stories));
    }
  }, [stories]);

  const handleLogin = (email: string) => {
      const newUser: User = {
          id: 'u-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          role: email.includes('admin') ? 'admin' : 'user'
      };
      setUser(newUser);
      localStorage.setItem('storyforge_user', JSON.stringify(newUser));
      setView(ViewState.DASHBOARD);
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('storyforge_user');
      setView(ViewState.LOGIN);
  };

  const handleChangeView = (newView: ViewState) => {
    if (newView === ViewState.LOGIN) {
        handleLogout();
        return;
    }
    setView(newView);
    if (newView === ViewState.DASHBOARD || newView === ViewState.WIZARD || newView === ViewState.ADMIN) {
      setActiveStory(null);
    }
  };

  const handleDeleteStory = (id: string) => {
    if(window.confirm("Are you sure you want to delete this story?")) {
      setStories(prev => prev.filter(s => s.id !== id));
      if (activeStory?.id === id) {
        setView(ViewState.DASHBOARD);
        setActiveStory(null);
      }
    }
  };

  const handleCreateStory = async (settings: StorySettings) => {
    setIsGenerating(true);
    try {
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

      setStories(prev => [newStory, ...prev]);
      setActiveStory(newStory);
      setView(ViewState.EDITOR);
      setIsGenerating(false);

      generateStoryImages(newStory.id, newStory.pages, settings.artStyle);

    } catch (error: any) {
      console.error("Story generation failed", error);
      alert(`Failed to generate story: ${error.message}`);
      setIsGenerating(false);
    }
  };

  const generateStoryImages = async (storyId: string, pages: any[], artStyle: string) => {
    const updatedPages = [...pages];
    
    // Generate cover
    try {
      const coverUrl = await generateIllustration(`Cover art for a children's book titled "${activeStory?.title || 'Story'}". Scene: ${pages[0].imagePrompt}`, artStyle);
       setStories(currentStories => 
        currentStories.map(s => s.id === storyId ? { ...s, coverImage: coverUrl } : s)
      );
    } catch(e) { console.error("Cover gen failed", e)}

    // Generate Pages
    for (let i = 0; i < pages.length; i++) {
      try {
        const imageUrl = await generateIllustration(pages[i].imagePrompt, artStyle);
        updatedPages[i] = { ...updatedPages[i], imageUrl, isLoadingImage: false };
        
        setStories(currentStories => 
          currentStories.map(s => s.id === storyId ? { ...s, pages: updatedPages } : s)
        );
        
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

  if (view === ViewState.READER && activeStory) {
    return <StoryReader story={activeStory} onClose={() => setView(ViewState.EDITOR)} />;
  }

  return (
    <Layout currentView={view} onChangeView={handleChangeView}>
      <AnimatePresence mode="wait">
        
        {view === ViewState.LOGIN && (
            <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
            >
                <Login onLogin={handleLogin} />
            </motion.div>
        )}

        {view === ViewState.DASHBOARD && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Dashboard 
              stories={stories} 
              onSelectStory={(story) => {
                setActiveStory(story);
                setView(ViewState.EDITOR);
              }}
              onDeleteStory={handleDeleteStory}
              onChangeView={handleChangeView}
            />
          </motion.div>
        )}

        {view === ViewState.ADMIN && (
          <motion.div 
            key="admin"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <AdminDashboard />
          </motion.div>
        )}

        {view === ViewState.WIZARD && (
          <motion.div 
            key="wizard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <StoryWizard 
              onGenerate={handleCreateStory}
              isGenerating={isGenerating}
            />
          </motion.div>
        )}

        {view === ViewState.EDITOR && activeStory && (
          <motion.div 
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <StoryEditor 
              story={activeStory}
              onSave={handleUpdateStory}
              onClose={() => handleChangeView(ViewState.DASHBOARD)}
              onRead={() => setView(ViewState.READER)}
            />
          </motion.div>
        )}

        {view === ViewState.EDITOR && !activeStory && (
          <motion.div className="flex items-center justify-center h-full text-slate-400">
             <div className="text-center">
               <Loader2 className="w-12 h-12 mx-auto mb-2 animate-spin text-brand-500"/>
               <p>Preparing Studio...</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;