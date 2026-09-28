import React from 'react';
import {
  Laptop,
  CreditCard,
  Key,
  Briefcase,
  Coffee,
  Shirt,
  BookOpen,
  Watch,
  HelpCircle,
} from 'lucide-react';
import { ItemCategory } from '../types';

interface CategoryIconProps {
  category: ItemCategory;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-5 h-5' }) => {
  switch (category) {
    case 'electronics':
      return <Laptop className={className} />;
    case 'id_cards':
      return <CreditCard className={className} />;
    case 'keys':
      return <Key className={className} />;
    case 'bags':
      return <Briefcase className={className} />;
    case 'bottles':
      return <Coffee className={className} />;
    case 'clothing':
      return <Shirt className={className} />;
    case 'books':
      return <BookOpen className={className} />;
    case 'accessories':
      return <Watch className={className} />;
    case 'other':
    default:
      return <HelpCircle className={className} />;
  }
};

/**
 * Returns a subtle background gradient and accent color for item fallback cards
 */
export function getCategoryStyling(category: ItemCategory): {
  bg: string;
  text: string;
  gradient: string;
} {
  switch (category) {
    case 'electronics':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        gradient: 'from-blue-50 to-indigo-100',
      };
    case 'id_cards':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        gradient: 'from-amber-50 to-yellow-100',
      };
    case 'keys':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        gradient: 'from-emerald-50 to-teal-100',
      };
    case 'bags':
      return {
        bg: 'bg-stone-50',
        text: 'text-stone-700',
        gradient: 'from-stone-50 to-slate-200',
      };
    case 'bottles':
      return {
        bg: 'bg-cyan-50',
        text: 'text-cyan-600',
        gradient: 'from-cyan-50 to-sky-100',
      };
    case 'clothing':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        gradient: 'from-purple-50 to-violet-100',
      };
    case 'books':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        gradient: 'from-orange-50 to-amber-100',
      };
    case 'accessories':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-600',
        gradient: 'from-rose-50 to-pink-100',
      };
    case 'other':
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        gradient: 'from-slate-50 to-gray-200',
      };
  }
}
