import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { CampusItem, ItemCategory, ItemType, MatchResult } from '../types';
import { CATEGORY_LABELS, CAMPUS_LOCATIONS } from '../data/sampleItems';
import { ItemCard } from './ItemCard';

interface BrowseViewProps {
  items: CampusItem[];
  allMatches: MatchResult[];
  onSelectItem: (item: CampusItem) => void;
  onOpenReport: (defaultType?: ItemType) => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  items,
  allMatches,
  onSelectItem,
  onOpenReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ItemCategory>('all');
  const [locationFilter, setLocationFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'reunited'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

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

  // Filter items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Type filter
        if (typeFilter !== 'all' && item.type !== typeFilter) return false;

        // Category filter
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

        // Location filter
        if (locationFilter !== 'all' && item.location !== locationFilter) return false;

        // Status filter
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchLoc = item.location.toLowerCase().includes(q);
          const matchCat = (CATEGORY_LABELS[item.category] || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt;
        } else {
          return new Date(a.date).getTime() - new Date(b.date).getTime() || a.createdAt - b.createdAt;
        }
      });
  }, [items, typeFilter, categoryFilter, locationFilter, statusFilter, searchQuery, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    typeFilter !== 'all' ||
    categoryFilter !== 'all' ||
    locationFilter !== 'all' ||
    statusFilter !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setLocationFilter('all');
    setStatusFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Campus Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse all active and recovered lost & found reports across the university.
          </p>
        </div>

        {/* Quick Report CTAs */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenReport('lost')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
          >
            + Report Lost
          </button>
          <button
            onClick={() => onOpenReport('found')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Report Found</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, model, brand, or location (e.g. Hydro Flask, AirPods, Library)..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Interactive Filter Segmented Control: All / Lost / Found */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('lost')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                typeFilter === 'lost'
                  ? 'bg-rose-500 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost Only
            </button>
            <button
              onClick={() => setTypeFilter('found')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                typeFilter === 'found'
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found Only
            </button>
          </div>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-slate-100 text-xs">
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Campus Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="reunited">Reunited / Recovered</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="newest">Newest Date First</option>
              <option value="oldest">Oldest Date First</option>
            </select>
          </div>
        </div>

        {/* Active Filters Pill Bar & Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="text-slate-500">
            Showing <strong className="font-semibold text-slate-800 tabular-nums">{filteredItems.length}</strong> of{' '}
            <span className="tabular-nums">{items.length}</span> reports
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              topMatch={itemMatchMap.get(item.id)}
              onSelect={onSelectItem}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              No belongings match your current criteria
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your search terms or resetting the location and category filters to discover more items.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Reset All Filters
            </button>
            <button
              onClick={() => onOpenReport('lost')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Report New Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
