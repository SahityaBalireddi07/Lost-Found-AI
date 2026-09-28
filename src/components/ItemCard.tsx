import React, { useState } from 'react';
import { MapPin, Calendar, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { CampusItem, MatchResult } from '../types';
import { CATEGORY_LABELS } from '../data/sampleItems';
import { CategoryIcon, getCategoryStyling } from './CategoryIcon';

interface ItemCardProps {
  item: CampusItem;
  topMatch?: MatchResult | null;
  onSelect: (item: CampusItem) => void;
  onViewMatches?: (item: CampusItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  topMatch,
  onSelect,
  onViewMatches,
}) => {
  const [imageError, setImageError] = useState(false);
  const categoryStyle = getCategoryStyling(item.category);
  const isLost = item.type === 'lost';
  const isReunited = item.status === 'reunited';

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Visual Header / Image Slot with Zero-Broken-Image Fallback */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
        {item.imageUrl && !imageError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${categoryStyle.gradient} flex flex-col items-center justify-center p-6 text-center select-none`}
          >
            <div className={`p-3 rounded-xl bg-white/80 shadow-sm ${categoryStyle.text} mb-2`}>
              <CategoryIcon category={item.category} className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-500">
              {CATEGORY_LABELS[item.category] || 'Campus Item'}
            </span>
          </div>
        )}

        {/* Clean Top Corner Type Indicator */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded shadow-sm ${
              isLost
                ? 'bg-rose-500 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
        </div>

        {/* Reunited Status Indicator */}
        {isReunited && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-blue-600 text-white shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reunited</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic separators (Zero-Pill Discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-slate-700">
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{item.date}</span>
            </span>
          </div>

          {/* Primary Item Title */}
          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>

          {/* Location Line */}
          <div className="flex items-center gap-1 text-xs text-slate-600 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Bottom Section: AI Match Hint & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {topMatch && !isReunited ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onViewMatches) onViewMatches(item);
                else onSelect(item);
              }}
              className="inline-flex items-center gap-1.5 text-blue-700 font-semibold hover:text-blue-800 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>{topMatch.score}% AI Match Found</span>
            </button>
          ) : (
            <span className="text-slate-400">
              Reported by {item.contactName.split(' ')[0]}
            </span>
          )}

          <span className="inline-flex items-center gap-0.5 font-medium text-slate-500 group-hover:text-blue-600 transition-colors ml-auto">
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
