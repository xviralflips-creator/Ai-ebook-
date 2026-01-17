import React from 'react';
import { Story, ViewState } from '../types';
import { Button } from '../components/Button';
import { Plus, BookOpen, Clock, Trash2, ArrowRight, TrendingUp, Layers, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
  onChangeView: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stories, onSelectStory, onDeleteStory, onChangeView }) => {
  const latestStory = stories[0];
  const stats = [
    { label: 'Total Stories', value: stories.length, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Pages Created', value: stories.reduce((acc, s) => acc + s.pages.length, 0), icon: Layers, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Words Written', value: stories.reduce((acc, s) => acc + s.pages.reduce((pAcc, p) => pAcc + p.text.split(' ').length, 0), 0), icon: PenTool, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10">
      
      {/* Header & Stats */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-slate-500 font-medium">Welcome back, Storyteller.</p>
            </div>
            <Button onClick={() => onChangeView(ViewState.WIZARD)} className="shadow-lg shadow-brand-500/20">
              <Plus className="w-4 h-4 mr-2" />
              New Story
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.label} 
              className="glass-panel p-5 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hero Section (Last created story) */}
      {latestStory && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer h-[300px] md:h-[400px]"
            onClick={() => onSelectStory(latestStory)}
        >
            <div className="absolute inset-0">
              <img src={latestStory.coverImage || latestStory.pages[0]?.imageUrl} alt="Hero" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 p-8 md:p-10 max-w-2xl text-white">
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium mb-3 border border-white/30">
                  Latest Creation
                </span>
                <h2 className="text-3xl md:text-5xl font-black mb-3 leading-tight font-serif">{latestStory.title}</h2>
                <p className="text-white/80 line-clamp-2 mb-6 font-light text-lg">{latestStory.description}</p>
                <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-brand-50 transition-colors">
                   Continue Writing <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
      )}

      {/* Grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-400" />
            All Stories
        </h3>
        
        {stories.length === 0 ? (
           <div className="text-center py-20 glass-panel rounded-3xl border-dashed">
             <div className="bg-brand-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <BookOpen className="w-10 h-10 text-brand-400" />
             </div>
             <h3 className="text-xl font-bold text-slate-900">Your library is empty</h3>
             <p className="text-slate-500 mb-6 mt-2">Create your first magical world today.</p>
             <Button onClick={() => onChangeView(ViewState.WIZARD)}>Start Creating</Button>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stories.map((story, idx) => (
              <motion.div 
                key={story.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div 
                  className="aspect-[4/3] bg-slate-100 relative cursor-pointer overflow-hidden"
                  onClick={() => onSelectStory(story)}
                >
                  {story.coverImage || story.pages[0]?.imageUrl ? (
                    <img src={story.coverImage || story.pages[0]?.imageUrl} alt={story.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                      <BookOpen className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                     <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onSelectStory(story); }}>
                        Edit
                     </Button>
                     <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteStory(story.id); }}
                        className="p-2 bg-white/20 text-white rounded-lg hover:bg-red-500 hover:text-white transition-colors backdrop-blur-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700">
                      {story.genre}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(story.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                    </span>
                  </div>
                  
                  <h3 
                    className="font-serif font-bold text-lg text-slate-900 mb-2 line-clamp-1 cursor-pointer group-hover:text-brand-600 transition-colors"
                    onClick={() => onSelectStory(story)}
                  >
                    {story.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
                    {story.description}
                  </p>
                  
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-medium text-slate-400">
                     <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {story.pages.length} Pages</span>
                     <span className="flex items-center gap-1">{story.targetAge}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};