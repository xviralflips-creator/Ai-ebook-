import React, { useState } from 'react';
import { StorySettings } from '../types';
import { GENRES, AGE_GROUPS, ART_STYLES } from '../constants';
import { Button } from '../components/Button';
import { Wand2, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

interface StoryWizardProps {
  onGenerate: (settings: StorySettings) => void;
  isGenerating: boolean;
}

export const StoryWizard: React.FC<StoryWizardProps> = ({ onGenerate, isGenerating }) => {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<StorySettings>({
    topic: '',
    genre: GENRES[0],
    ageGroup: AGE_GROUPS[1],
    artStyle: ART_STYLES[0],
    pageCount: 5
  });

  const updateSetting = (key: keyof StorySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 text-brand-600 mb-4">
          <Wand2 className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Create a New Story</h2>
        <p className="text-slate-500 mt-2">Let AI weave a magical tale for you in seconds.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-10">
        {[1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
              step >= i ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {i}
            </div>
            {i < 3 && (
              <div className={`w-16 h-1 transition-colors ${step > i ? 'bg-brand-600' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">What is your story about?</label>
              <textarea 
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none h-32"
                placeholder="e.g. A brave little toaster who travels to Mars to find the perfect bread..."
                value={settings.topic}
                onChange={(e) => updateSetting('topic', e.target.value)}
              />
               <div className="mt-2 flex gap-2">
                 <button 
                  onClick={() => updateSetting('topic', 'A lonely cloud looking for a friend')}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-md transition-colors flex items-center"
                 >
                   <Lightbulb className="w-3 h-3 mr-1"/> Try: A lonely cloud
                 </button>
                 <button 
                  onClick={() => updateSetting('topic', 'A detective cat solving the mystery of the missing tuna')}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-md transition-colors flex items-center"
                 >
                   <Lightbulb className="w-3 h-3 mr-1"/> Try: Detective Cat
                 </button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Genre</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={settings.genre}
                  onChange={(e) => updateSetting('genre', e.target.value)}
                >
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Age</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  value={settings.ageGroup}
                  onChange={(e) => updateSetting('ageGroup', e.target.value)}
                >
                  {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">Choose an Art Style</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ART_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => updateSetting('artStyle', style)}
                    className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                      settings.artStyle === style
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Story Length (Pages)</label>
              <div className="flex items-center gap-4">
                 <input 
                  type="range" 
                  min="3" 
                  max="10" 
                  value={settings.pageCount}
                  onChange={(e) => updateSetting('pageCount', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
                <span className="font-bold text-slate-900 w-8">{settings.pageCount}</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-4">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Ready to forge your story?</h3>
            <div className="bg-slate-50 p-6 rounded-lg max-w-sm mx-auto text-left space-y-3 mb-6">
              <p><span className="font-semibold text-slate-700">Topic:</span> {settings.topic || 'Untitled'}</p>
              <p><span className="font-semibold text-slate-700">Genre:</span> {settings.genre}</p>
              <p><span className="font-semibold text-slate-700">Audience:</span> {settings.ageGroup}</p>
              <p><span className="font-semibold text-slate-700">Style:</span> {settings.artStyle}</p>
              <p><span className="font-semibold text-slate-700">Length:</span> {settings.pageCount} pages</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack} disabled={isGenerating}>
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          ) : (
            <div /> 
          )}

          {step < 3 ? (
            <Button onClick={handleNext} disabled={!settings.topic}>
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => onGenerate(settings)} isLoading={isGenerating} size="lg">
              <Wand2 className="w-4 h-4 mr-2" /> Generate Story
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};