import React from 'react';
import { BookOpen, Library, PlusCircle, Settings, LogOut, Menu } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => {
        onChangeView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
        currentView === view 
          ? 'bg-brand-50 text-brand-600' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl text-brand-600">
          <BookOpen className="w-6 h-6" />
          <span>StoryForge AI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl text-brand-600">
            <BookOpen className="w-6 h-6" />
            <span>StoryForge AI</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem view={ViewState.DASHBOARD} icon={Library} label="Library" />
          <NavItem view={ViewState.WIZARD} icon={PlusCircle} label="Create Story" />
        </nav>

        <div className="p-4 border-t border-slate-200 mt-auto">
          <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer">
            <Settings className="w-5 h-5" />
            Settings
          </div>
           <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
            <LogOut className="w-5 h-5" />
            Sign Out
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-65px)] md:h-screen">
        {children}
      </main>
    </div>
  );
};