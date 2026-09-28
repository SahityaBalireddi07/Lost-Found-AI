import React, { useState } from 'react';
import { Menu, X, PlusCircle, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'browse' | 'matches' | 'how-it-works';
  onNavigate: (tab: 'home' | 'browse' | 'matches' | 'how-it-works') => void;
  onOpenReport: (defaultType?: 'lost' | 'found') => void;
  matchedPairsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenReport,
  matchedPairsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'browse' | 'matches' | 'how-it-works') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand title wordmark (clean single text element) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                LF
              </div>
              <span className="text-slate-900">Lost & Found <span className="text-blue-600">AI</span></span>
            </button>
          </div>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-blue-600 transition-colors ${
                activeTab === 'home' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('browse')}
              className={`hover:text-blue-600 transition-colors ${
                activeTab === 'browse' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Browse Items
            </button>
            <button
              onClick={() => handleNavClick('matches')}
              className={`hover:text-blue-600 transition-colors flex items-center gap-1.5 ${
                activeTab === 'matches' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>AI Match Center</span>
              {matchedPairsCount > 0 && (
                <span className="font-mono text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md tabular-nums">
                  {matchedPairsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`hover:text-blue-600 transition-colors ${
                activeTab === 'how-it-works' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              How It Works
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => onOpenReport('lost')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Report Lost
            </button>
            <button
              onClick={() => onOpenReport('found')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onOpenReport('lost')}
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md"
            >
              Report
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${
              activeTab === 'home' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('browse')}
            className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${
              activeTab === 'browse' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'
            }`}
          >
            Browse Items
          </button>
          <button
            onClick={() => handleNavClick('matches')}
            className={`flex items-center justify-between w-full text-left px-3 py-2 text-base font-medium rounded-md ${
              activeTab === 'matches' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>AI Match Center</span>
            </div>
            {matchedPairsCount > 0 && (
              <span className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md tabular-nums">
                {matchedPairsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${
              activeTab === 'how-it-works' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'
            }`}
          >
            How It Works
          </button>
          <div className="pt-3 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReport('lost');
              }}
              className="flex-1 py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-md"
            >
              Report Lost
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReport('found');
              }}
              className="flex-1 py-2 text-center text-xs font-semibold text-white bg-blue-600 rounded-md"
            >
              Report Found
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
