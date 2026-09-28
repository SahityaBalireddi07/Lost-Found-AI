import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Sparkles,
  Shield,
  CheckCircle2,
  Share2,
  ArrowRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { CampusItem, MatchResult } from '../types';
import { CATEGORY_LABELS } from '../data/sampleItems';
import { CategoryIcon, getCategoryStyling } from './CategoryIcon';
import { findMatchesForItem } from '../utils/aiMatcher';

interface ItemDetailsModalProps {
  item: CampusItem | null;
  allItems: CampusItem[];
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: (item: CampusItem) => void;
  onSelectMatchedItem: (item: CampusItem) => void;
  onUpdateStatus: (itemId: string, status: CampusItem['status']) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  allItems,
  isOpen,
  onClose,
  onOpenContact,
  onSelectMatchedItem,
  onUpdateStatus,
}) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!isOpen || !item) return null;

  const categoryStyle = getCategoryStyling(item.category);
  const isLost = item.type === 'lost';
  const isReunited = item.status === 'reunited';

  // Calculate live AI matches for this specific item
  const suggestedMatches: MatchResult[] = findMatchesForItem(item, allItems);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded ${
                isLost ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {isLost ? 'Lost Item' : 'Found Item'}
            </span>
            {isReunited && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reunited</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs flex items-center gap-1"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {/* Main Visual & Title Block */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Visual Box */}
            <div className="w-full sm:w-44 aspect-square rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
              {item.imageUrl && !imageError ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${categoryStyle.gradient} flex flex-col items-center justify-center p-4 text-center`}
                >
                  <div className={`p-3 rounded-xl bg-white/90 shadow-sm ${categoryStyle.text} mb-2`}>
                    <CategoryIcon category={item.category} className="w-8 h-8" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase text-slate-500">
                    {CATEGORY_LABELS[item.category]}
                  </span>
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  {CATEGORY_LABELS[item.category]}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-mono tabular-nums">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.date}</span>
                </span>
              </div>

              <h1 className="text-xl font-bold text-slate-900 leading-snug">
                {item.title}
              </h1>

              <div className="flex items-start gap-1.5 text-xs text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span className="font-medium">{item.location}</span>
              </div>

              <div className="text-xs text-slate-500 pt-1">
                Reported by <span className="font-medium text-slate-800">{item.contactName}</span> ({item.contactEmail})
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Description
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {item.description}
            </div>
          </div>

          {/* Distinctive Features */}
          {item.distinctiveFeatures && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                <span>Distinctive Features & Proof Points</span>
              </h3>
              <p className="text-xs text-slate-600 bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                {item.distinctiveFeatures}
              </p>
            </div>
          )}

          {/* AI Matching Section (Requirement 4) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    AI Suggested Counterparts ({suggestedMatches.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Analyzed by text similarity, category, campus location, and date
                  </p>
                </div>
              </div>
            </div>

            {suggestedMatches.length > 0 ? (
              <div className="space-y-2.5">
                {suggestedMatches.map((m) => (
                  <div
                    key={m.matchedItem.id}
                    className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 tabular-nums">
                          {m.score}% Match
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-xs font-semibold text-slate-900">
                          {m.matchedItem.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {m.explanation}
                      </p>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{m.matchedItem.location}</span>
                        <span>·</span>
                        <span>{m.matchedItem.date}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectMatchedItem(m.matchedItem)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-100 border border-blue-300 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <span>Compare</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <p className="text-[11px] text-slate-500 italic">
                  * Note: AI matches are automated suggestions. Always verify ownership proof before meeting or transferring items.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-1">
                <p className="text-xs font-medium text-slate-700">
                  No immediate high-confidence matches found yet.
                </p>
                <p className="text-[11px] text-slate-500">
                  Our system will keep this report on file. When a matching counterpart is submitted, it will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
          {/* Reunited Status Toggle */}
          <div>
            {!isReunited ? (
              <button
                onClick={() => onUpdateStatus(item.id, 'reunited')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Reunited / Recovered</span>
              </button>
            ) : (
              <button
                onClick={() => onUpdateStatus(item.id, 'active')}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Reopen as Active
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onOpenContact(item)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Safe Contact & Claim</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
