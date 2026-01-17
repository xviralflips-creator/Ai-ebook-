import React, { useState } from 'react';
import { StorySettings } from '../types';
import { GENRES, AGE_GROUPS, ART_STYLES } from '../constants';
import { Button } from '../components/Button';
import { Wand2, ChevronRight, ChevronLeft, Sparkles, Palette, User, BookType, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryWizardProps {
  onGenerate: (settings: StorySettings) => void;
  isGenerating: boolean;
}

export const StoryWizard: React.FC<StoryWizardProps> = ({ onGenerate, isGenerating }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
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

  const nextStep = () => {
    setDirection(1);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  const handleMagicFill = () => {
    const randomTopics = [
      "A hamster who builds a spaceship out of cardboard",
      "The moon that forgot how to glow",
      "A gentle dragon who bakes cookies for the village",
      "A time-traveling pair of sneakers",
      "A robot painting the sunrise"
    ];
    
    setSettings({
      topic: randomTopics[Math.floor(Math.random() * randomTopics.length)],
      genre: GENRES[Math.floor(Math.random() * GENRES.length)],
      ageGroup: AGE_GROUPS[Math.floor(Math.random() * AGE_GROUPS.length)],
      artStyle: ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)],
      pageCount: 5
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 min-h-[85vh] flex flex-col justify-center overflow-hidden">
      
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-400 to-purple-500 text-white mb-6 shadow-xl shadow-brand-500/30"
        >
          <Wand2 className="w-8 h-8" />
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-3">Craft Your Story</h2>
        <p className="text-slate-500 text-lg">Step {step} of 3</p>
      </div>

      <div className="relative min-h-[500px] perspective-1000">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          
          {/* Step 1: Topic */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 flex flex-col"
            >
               <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><BookType className="w-6 h-6"/></div>
                    <h3 className="text-2xl font-bold text-slate-800">The Core Idea</h3>
                </div>
                <button 
                  onClick={handleMagicFill}
                  className="group flex items-center gap-2 text-sm font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-full hover:bg-purple-100 transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Auto-Magic
                </button>
              </div>

              <textarea 
                className="w-full flex-1 p-6 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none resize-none text-2xl font-medium text-slate-700 placeholder:text-slate-300 transition-all"
                placeholder="Once upon a time..."
                value={settings.topic}
                onChange={(e) => updateSetting('topic', e.target.value)}
              />
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 overflow-y-auto"
            >
               <div className="flex items-center gap-3 mb-8">
                   <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><User className="w-6 h-6"/></div>
                   <h3 className="text-2xl font-bold text-slate-800">Target Audience & Genre</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Genre</label>
                    <div className="grid grid-cols-2 gap-3">
                        {GENRES.map(g => (
                            <button
                                key={g}
                                onClick={() => updateSetting('genre', g)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${settings.genre === g ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 scale-105' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Age Group</label>
                        <select 
                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white font-medium text-slate-700 outline-none focus:border-brand-500"
                            value={settings.ageGroup}
                            onChange={(e) => updateSetting('ageGroup', e.target.value)}
                        >
                            {AGE_GROUPS.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Length</label>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                            <Hash className="w-5 h-5 text-slate-400" />
                            <input 
                                type="range" min="3" max="10" 
                                value={settings.pageCount}
                                onChange={(e) => updateSetting('pageCount', parseInt(e.target.value))}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                            />
                            <span className="font-bold text-brand-600 w-8">{settings.pageCount}</span>
                        </div>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* Step 3: Art Style */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 flex flex-col"
            >
               <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><Palette className="w-6 h-6"/></div>
                   <h3 className="text-2xl font-bold text-slate-800">Visual Style</h3>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pb-4 custom-scrollbar">
                  {ART_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => updateSetting('artStyle', style)}
                      className={`group relative p-4 h-32 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl flex flex-col justify-end items-start ${
                        settings.artStyle === style
                          ? 'border-brand-500 bg-brand-50 text-brand-700 ring-4 ring-brand-500/10'
                          : 'border-slate-100 bg-white hover:border-brand-300'
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-2xl opacity-10 bg-gradient-to-br from-slate-200 to-slate-400 group-hover:opacity-20 transition-opacity`}></div>
                      <span className="relative z-10 font-bold text-lg">{style}</span>
                    </button>
                  ))}
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex justify-between mt-8 max-w-5xl mx-auto w-full">
         <Button variant="ghost" onClick={prevStep} disabled={step === 1 || isGenerating} className="text-slate-500 hover:text-slate-800">
             <ChevronLeft className="w-5 h-5 mr-2" /> Back
         </Button>

         {step < 3 ? (
             <Button onClick={nextStep} disabled={!settings.topic} className="px-8 py-6 text-lg rounded-2xl shadow-xl shadow-brand-500/20">
                 Next Step <ChevronRight className="w-5 h-5 ml-2" />
             </Button>
         ) : (
             <Button 
                onClick={() => onGenerate(settings)} 
                isLoading={isGenerating} 
                className="px-10 py-6 text-lg rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-xl shadow-purple-500/30"
             >
                 <Wand2 className="w-5 h-5 mr-2" /> Generate Masterpiece
             </Button>
         )}
      </div>

    </div>
  );
};