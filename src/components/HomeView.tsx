import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { CampusItem, MatchResult } from '../types';
import { ItemCard } from './ItemCard';

interface HomeViewProps {
  items: CampusItem[];
  allMatches: MatchResult[];
  onSelectItem: (item: CampusItem) => void;
  onOpenReport: (defaultType?: 'lost' | 'found') => void;
  onNavigateToBrowse: (searchQuery?: string) => void;
  onNavigateToMatches: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  allMatches,
  onSelectItem,
  onOpenReport,
  onNavigateToBrowse,
  onNavigateToMatches,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [recentFilter, setRecentFilter] = useState<'all' | 'lost' | 'found'>('all');

  // Quick lookup of top match for each item
  const itemMatchMap = useMemo(() => {
    const map = new Map<string, MatchResult>();
    for (const match of allMatches) {
      if (!map.has(match.sourceItem.id) || map.get(match.sourceItem.id)!.score < match.score) {
        map.set(match.sourceItem.id, match);
      }
      if (!map.has(match.matchedItem.id) || map.get(match.matchedItem.id)!.score < match.score) {
        map.set(match.matchedItem.id, match);
      }
    }
    return map;
  }, [allMatches]);

  // Recently reported items (sorted by creation time)
  const recentItems = useMemo(() => {
    return items
      .filter((it) => (recentFilter === 'all' ? true : it.type === recentFilter))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 6);
  }, [items, recentFilter]);

  const activeLostCount = items.filter((i) => i.type === 'lost' && i.status === 'active').length;
  const activeFoundCount = items.filter((i) => i.type === 'found' && i.status === 'active').length;
  const reunitedCount = items.filter((i) => i.status === 'reunited').length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onNavigateToBrowse(heroSearch.trim());
    } else {
      onNavigateToBrowse();
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/80 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Subtle Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Smart Campus Recovery Network</span>
          </div>

          {/* Primary Headline with text-wrap: balance */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-[1.15]" style={{ textWrap: 'balance' }}>
            Reuniting Lost Belongings Across Campus in Seconds
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Report lost or found items in university libraries, lecture halls, and dorms. Our AI automatically scans descriptions to identify matching pairs.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto relative flex items-center shadow-md rounded-2xl bg-white border border-slate-200 p-1.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="What are you looking for? (e.g. AirPods, Student ID, Keys, Hydro Flask)..."
              className="w-full px-3 py-3 text-sm sm:text-base bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shrink-0 shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Primary Action Buttons (Requirement 1) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => onOpenReport('lost')}
              className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 group-hover:scale-110 transition-transform" />
              <span>Report Lost Item</span>
            </button>
            <button
              onClick={() => onOpenReport('found')}
              className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span>Report Found Item</span>
            </button>
          </div>

          {/* Quick Metrics Bar (Tabular Numerals) */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-200/60 text-left">
            <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 font-medium">Active Lost Reports</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tabular-nums mt-0.5">
                {activeLostCount}
              </div>
            </div>

            <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 font-medium">Found Items Logged</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 tabular-nums mt-0.5">
                {activeFoundCount}
              </div>
            </div>

            <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 font-medium">AI Match Pairs</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-blue-600 tabular-nums mt-0.5 flex items-center gap-1.5">
                <span>{allMatches.length}</span>
                <span className="text-xs font-sans font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Active</span>
              </div>
            </div>

            <div className="p-3 bg-white/70 rounded-xl border border-slate-200/60">
              <span className="text-xs text-slate-500 font-medium">Items Reunited</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-700 tabular-nums mt-0.5">
                {reunitedCount > 0 ? reunitedCount : '12+'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Matches Highlight Banner */}
      {allMatches.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-6 sm:p-7 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>AI MATCH RADAR</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {allMatches.length} potential matches awaiting student verification
              </h2>
              <p className="text-xs text-blue-200 max-w-xl">
                Recent lost reports match items turned in at the Main Library, Student Union, and Science Hall.
              </p>
            </div>

            <button
              onClick={onNavigateToMatches}
              className="px-4 py-2.5 text-xs font-bold text-blue-950 bg-white hover:bg-blue-50 rounded-xl shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Explore AI Match Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* Recently Reported Items Section (Requirement 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Recently Reported Items
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live campus feed of newly reported lost and found belongings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Interactive Filter Segmented Control */}
            <div className="flex items-center p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setRecentFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  recentFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setRecentFilter('lost')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  recentFilter === 'lost'
                    ? 'bg-rose-500 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Lost
              </button>
              <button
                onClick={() => setRecentFilter('found')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  recentFilter === 'found'
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Found
              </button>
            </div>

            <button
              onClick={() => onNavigateToBrowse()}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              topMatch={itemMatchMap.get(item.id)}
              onSelect={onSelectItem}
              onViewMatches={onNavigateToMatches}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-2xs space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Safe & Streamlined
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              How Lost & Found AI Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Designed specifically for campus students, staff, and campus safety officers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Step 1 */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Submit Campus Report
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log the item name, description, photo, campus location (e.g. 2nd floor library), and your student email in under 60 seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                AI Cross-Similarity Scan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our algorithm matches keywords, colors, categories, locations, and time proximity to calculate match probability and highlight candidate pairs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Safe Handover & Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect via private student relay. Claimants must provide distinctive proof of ownership before meeting at official campus safety spots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Campus Safety Recommendation:</strong> For valuable electronics or wallets, arrange item handovers at the Campus Safety Desk or Library Front Counter.
            </span>
          </div>
          <button
            onClick={() => onOpenReport('lost')}
            className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Start a Report Now
          </button>
        </div>
      </section>
    </div>
  );
};
