import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  RefreshCw,
  Search,
  CheckCircle2,
  Calendar,
  MapPin,
  X,
  ExternalLink,
} from 'lucide-react';
import { CampusItem, MatchResult } from '../types';
import { findAllCampusMatches } from '../utils/aiMatcher';
import { CATEGORY_LABELS } from '../data/sampleItems';
import { CategoryIcon, getCategoryStyling } from './CategoryIcon';

interface AiMatchViewProps {
  items: CampusItem[];
  onSelectItem: (item: CampusItem) => void;
  onOpenContact: (item: CampusItem) => void;
  onOpenReport: (defaultType?: 'lost' | 'found') => void;
}

export const AiMatchView: React.FC<AiMatchViewProps> = ({
  items,
  onSelectItem,
  onOpenContact,
  onOpenReport,
}) => {
  const [minConfidence, setMinConfidence] = useState<number>(50);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPair, setSelectedPair] = useState<MatchResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Compute all matches across active items
  const allMatches = useMemo(() => {
    return findAllCampusMatches(items);
  }, [items]);

  // Filtered by score & search
  const filteredMatches = useMemo(() => {
    return allMatches.filter((m) => {
      if (m.score < minConfidence) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.sourceItem.title.toLowerCase().includes(q) ||
        m.matchedItem.title.toLowerCase().includes(q) ||
        m.sourceItem.description.toLowerCase().includes(q) ||
        m.matchedItem.description.toLowerCase().includes(q) ||
        m.sourceItem.location.toLowerCase().includes(q) ||
        m.matchedItem.location.toLowerCase().includes(q)
      );
    });
  }, [allMatches, minConfidence, searchQuery]);

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-lg px-3 py-1 text-xs font-semibold tracking-wide text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Campus AI Cross-Matching Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Automated Belonging Matching
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-2xl">
            Our multi-attribute similarity model evaluates item titles, descriptive keywords, campus locations, and timelines to surface high-probability pairs for student verification.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-blue-200 font-mono tabular-nums">
            <div className="bg-white/10 rounded-lg px-3 py-1.5 border border-white/10">
              <span className="text-white font-bold text-sm mr-1.5">{allMatches.length}</span>
              <span>Potential Pairs Identified</span>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-1.5 border border-white/10">
              <span className="text-white font-bold text-sm mr-1.5">
                {allMatches.filter((m) => m.confidence === 'High').length}
              </span>
              <span>High Confidence Matches</span>
            </div>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 -bottom-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Prominent Safety & Accuracy Disclaimer (Requirement 4) */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">
            Important Notice: Matches are algorithmic suggestions, not guaranteed ownership
          </p>
          <p className="text-amber-800 leading-relaxed">
            AI match percentages reflect textual and spatial similarity between student reports. Always request distinctive proof of ownership (lock screen codes, specific scratches, unique identifiers, serial numbers) before returning any item.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search matching pairs (e.g. AirPods, Hydro Flask, Keys)..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Min Score:</span>
            <select
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono tabular-nums"
            >
              <option value={40}>40% (All suggested)</option>
              <option value={60}>60% (Moderate+)</option>
              <option value={75}>75% (High Confidence)</option>
              <option value={85}>85% (Very High)</option>
            </select>
          </div>

          <button
            onClick={handleRescan}
            disabled={isScanning}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>Re-scan</span>
          </button>
        </div>
      </div>

      {/* Match Cards List */}
      {filteredMatches.length > 0 ? (
        <div className="space-y-4">
          {filteredMatches.map((match) => {
            const lostItem = match.sourceItem.type === 'lost' ? match.sourceItem : match.matchedItem;
            const foundItem = match.sourceItem.type === 'found' ? match.sourceItem : match.matchedItem;
            const lostCategoryStyle = getCategoryStyling(lostItem.category);
            const foundCategoryStyle = getCategoryStyling(foundItem.category);

            return (
              <div
                key={`${lostItem.id}-${foundItem.id}`}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all duration-200"
              >
                {/* Score & Confidence Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 tabular-nums">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>{match.score}% Match</span>
                    </div>

                    <span className="text-xs font-medium text-slate-500">
                      Confidence Level:{' '}
                      <strong className={`font-semibold ${
                        match.confidence === 'High' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {match.confidence}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPair(match)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Compare Side-by-Side</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onOpenContact(foundItem)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                    >
                      Safe Contact
                    </button>
                  </div>
                </div>

                {/* Side-by-side card preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  {/* Lost Item Preview */}
                  <div
                    onClick={() => onSelectItem(lostItem)}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all cursor-pointer flex gap-3"
                  >
                    <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      {lostItem.imageUrl ? (
                        <img
                          src={lostItem.imageUrl}
                          alt={lostItem.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${lostCategoryStyle.gradient} flex items-center justify-center`}>
                          <CategoryIcon category={lostItem.category} className="w-6 h-6 text-slate-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-semibold uppercase">
                        <span>Lost Report</span>
                        <span>·</span>
                        <span className="text-slate-500 font-normal">{lostItem.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                        {lostItem.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                        {lostItem.description}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{lostItem.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Found Item Preview */}
                  <div
                    onClick={() => onSelectItem(foundItem)}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all cursor-pointer flex gap-3"
                  >
                    <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      {foundItem.imageUrl ? (
                        <img
                          src={foundItem.imageUrl}
                          alt={foundItem.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${foundCategoryStyle.gradient} flex items-center justify-center`}>
                          <CategoryIcon category={foundItem.category} className="w-6 h-6 text-slate-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold uppercase">
                        <span>Found Report</span>
                        <span>·</span>
                        <span className="text-slate-500 font-normal">{foundItem.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                        {foundItem.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                        {foundItem.description}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{foundItem.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Explanation & Attribute Tags */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900">Why they match: </span>
                    <span>{match.explanation}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {match.matchingAttributes.map((attr, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              No matching pairs found with current filters
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Try lowering the minimum match score slider or clearing your search term to see more candidate pairs.
            </p>
          </div>
          <button
            onClick={() => {
              setMinConfidence(40);
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Side-by-side comparison modal */}
      {selectedPair && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md tabular-nums">
                  {selectedPair.score}% Match
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Side-by-Side Comparison
                </h3>
              </div>
              <button
                onClick={() => setSelectedPair(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 flex-1 space-y-6">
              {/* Comparison columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Lost Item */}
                <div className="space-y-4 border border-rose-100 rounded-xl p-4 bg-rose-50/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      Lost Item Report
                    </span>
                    <span className="text-xs text-slate-500">{selectedPair.sourceItem.date}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {selectedPair.sourceItem.title}
                  </h4>

                  <div className="space-y-2 text-xs text-slate-600">
                    <p>
                      <strong>Category:</strong> {CATEGORY_LABELS[selectedPair.sourceItem.category]}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedPair.sourceItem.location}
                    </p>
                    <p>
                      <strong>Reported by:</strong> {selectedPair.sourceItem.contactName}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-xs text-slate-700">
                    <p className="font-semibold text-slate-900 mb-1">Description:</p>
                    <p>{selectedPair.sourceItem.description}</p>
                  </div>

                  {selectedPair.sourceItem.distinctiveFeatures && (
                    <div className="bg-white rounded-lg p-3 border border-slate-200 text-xs text-slate-700">
                      <p className="font-semibold text-slate-900 mb-1">Distinctive Proof Points:</p>
                      <p>{selectedPair.sourceItem.distinctiveFeatures}</p>
                    </div>
                  )}
                </div>

                {/* Column 2: Found Item */}
                <div className="space-y-4 border border-emerald-100 rounded-xl p-4 bg-emerald-50/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Found Item Report
                    </span>
                    <span className="text-xs text-slate-500">{selectedPair.matchedItem.date}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {selectedPair.matchedItem.title}
                  </h4>

                  <div className="space-y-2 text-xs text-slate-600">
                    <p>
                      <strong>Category:</strong> {CATEGORY_LABELS[selectedPair.matchedItem.category]}
                    </p>
                    <p>
                      <strong>Location:</strong> {selectedPair.matchedItem.location}
                    </p>
                    <p>
                      <strong>Turned in by:</strong> {selectedPair.matchedItem.contactName}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-slate-200 text-xs text-slate-700">
                    <p className="font-semibold text-slate-900 mb-1">Description:</p>
                    <p>{selectedPair.matchedItem.description}</p>
                  </div>

                  {selectedPair.matchedItem.distinctiveFeatures && (
                    <div className="bg-white rounded-lg p-3 border border-slate-200 text-xs text-slate-700">
                      <p className="font-semibold text-slate-900 mb-1">Distinctive Identifiers:</p>
                      <p>{selectedPair.matchedItem.distinctiveFeatures}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Rationale explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Similarity Breakdown</span>
                </h5>
                <p className="text-xs text-blue-800 leading-relaxed">
                  {selectedPair.explanation}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setSelectedPair(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const targetToContact = selectedPair.sourceItem.type === 'found' ? selectedPair.sourceItem : selectedPair.matchedItem;
                  setSelectedPair(null);
                  onOpenContact(targetToContact);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Initiate Safe Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
