import React from 'react';
import { Story, ViewState } from '../types';
import { Button } from '../components/Button';
import { Plus, BookOpen, Clock, MoreVertical, Trash2, Share2 } from 'lucide-react';

interface DashboardProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
  onChangeView: (view: ViewState) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stories, onSelectStory, onDeleteStory, onChangeView }) => {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Library</h1>
          <p className="text-slate-500 mt-1">Manage and read your AI-generated stories.</p>
        </div>
        <Button onClick={() => onChangeView(ViewState.WIZARD)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Story
        </Button>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No stories yet</h3>
          <p className="text-slate-500 mb-6">Start your imagination engine and create your first book!</p>
          <Button variant="outline" onClick={() => onChangeView(ViewState.WIZARD)}>
            Create Story
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <div key={story.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div 
                className="h-48 bg-slate-100 relative cursor-pointer"
                onClick={() => onSelectStory(story)}
              >
                {story.coverImage ? (
                  <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <BookOpen className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white rounded-full p-1 shadow-sm">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteStory(story.id); }}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-brand-50 text-brand-700">
                    {story.genre}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(story.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 
                  className="font-serif font-bold text-lg text-slate-900 mb-2 line-clamp-1 cursor-pointer hover:text-brand-600"
                  onClick={() => onSelectStory(story)}
                >
                  {story.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                  {story.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">{story.pages.length} Pages</span>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-brand-600 rounded-full hover:bg-slate-50" title="Share">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <Button size="sm" variant="secondary" onClick={() => onSelectStory(story)}>
                      Read
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};