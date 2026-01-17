import React from 'react';
import { BookOpen, Library, PlusCircle, Settings, LogOut, Menu, Sparkles, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { ViewState } from '../types';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // If we are on the login screen, we render just the children without the dashboard layout
  if (currentView === ViewState.LOGIN) {
    return <>{children}</>;
  }

  const NavItem = ({ view, icon: Icon, label, activeIcon }: { view: ViewState; icon: any; label: string; activeIcon?: boolean }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => {
          onChangeView(view);
          setIsMobileMenuOpen(false);
        }}
        className={`relative w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group overflow-hidden ${
          isActive 
            ? 'text-white shadow-lg shadow-brand-500/30' 
            : 'text-slate-600 hover:bg-white/50 hover:text-brand-600'
        }`}
      >
        {isActive && (
          <motion.div 
            layoutId="activeNav"
            className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-400 z-0"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <div className="relative z-10 flex items-center gap-3">
          <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand-600'}`} />
          <span>{label}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col md:flex-row font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden glass-panel border-b border-slate-200 p-4 flex items-center justify-between z-50 sticky top-0">
        <div className="flex items-center gap-2 font-bold text-xl text-brand-600">
          <Sparkles className="w-6 h-6 text-brand-500" />
          <span>StoryForge</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 glass-panel border-r border-slate-200 transform transition-transform duration-300 ease-spring md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tight text-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <span>StoryForge</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium ml-1">Powered by Google Gemini</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          <NavItem view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={ViewState.WIZARD} icon={PlusCircle} label="Create New Story" />
          <NavItem view={ViewState.ADMIN} icon={ShieldCheck} label="Admin Console" />
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-gradient-to-br from-brand-500/10 to-purple-500/10 rounded-2xl p-4 border border-brand-100">
             <h4 className="font-bold text-slate-800 text-sm">Pro Plan</h4>
             <p className="text-xs text-slate-500 mt-1 mb-3">Unlock unlimited stories and 4K images.</p>
             <button className="w-full py-2 text-xs font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">Upgrade Now</button>
          </div>
          
          <div className="mt-6 space-y-1">
             <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </button>
             <button 
                onClick={() => onChangeView(ViewState.LOGIN)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-600 transition-colors"
             >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-65px)] md:h-screen relative z-10 scroll-smooth">
        {children}
      </main>
    </div>
  );
};