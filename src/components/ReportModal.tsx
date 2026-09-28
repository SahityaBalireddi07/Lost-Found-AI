import React, { useState } from 'react';
import {
  X,
  Upload,
  AlertCircle,
  Sparkles,
  Camera,
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  User,
  Mail,
  Phone,
} from 'lucide-react';
import { CampusItem, ItemCategory, ItemType } from '../types';
import { CATEGORY_LABELS, CAMPUS_LOCATIONS } from '../data/sampleItems';

interface ReportModalProps {
  isOpen: boolean;
  defaultType?: ItemType;
  onClose: () => void;
  onSubmit: (item: CampusItem) => void;
  onMatchFound?: (item: CampusItem) => void;
}

// Preset photo options to make reporting and testing super fast
const PRESET_PHOTOS: { label: string; url: string }[] = [
  {
    label: 'AirPods / Earbuds',
    url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Water Bottle',
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Backpack',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Keys',
    url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
  },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  defaultType = 'lost',
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<ItemType>(defaultType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [distinctiveFeatures, setDistinctiveFeatures] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [previewError, setPreviewError] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedItem, setSubmittedItem] = useState<CampusItem | null>(null);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Item name is required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Item name must be at least 3 characters.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide a clear description.';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters to help AI matching.';
    }

    if (location === 'Custom Location' && !customLocation.trim()) {
      newErrors.location = 'Please specify the exact campus location.';
    }

    if (!date) {
      newErrors.date = 'Date is required.';
    }

    if (!contactName.trim()) {
      newErrors.contactName = 'Your name or campus nickname is required.';
    }

    if (!contactEmail.trim()) {
      newErrors.contactEmail = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      newErrors.contactEmail = 'Please provide a valid email (e.g. name@university.edu).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: 'File size must be under 5MB.' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setPreviewError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const resolvedLocation = location === 'Custom Location' ? customLocation.trim() : location;

    const newItem: CampusItem = {
      id: `item-${Date.now()}`,
      type,
      title: title.trim(),
      category,
      location: resolvedLocation,
      date,
      description: description.trim(),
      distinctiveFeatures: distinctiveFeatures.trim() || undefined,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      status: 'active',
      createdAt: Date.now(),
    };

    onSubmit(newItem);
    setSubmittedItem(newItem);
  };

  const handleResetAndClose = () => {
    setTitle('');
    setDescription('');
    setDistinctiveFeatures('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setImageUrl('');
    setSubmittedItem(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {submittedItem ? 'Report Submitted' : `Report ${type === 'lost' ? 'Lost' : 'Found'} Item`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {submittedItem
                ? 'Your report is now live in the campus database.'
                : 'Fill out the details below. Our AI scans for potential matches in real-time.'}
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {submittedItem ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Item Successfully Logged</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
                  "{submittedItem.title}" has been registered. Other students can view and contact you via safe campus relay.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left max-w-md mx-auto">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Matching Active</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Our system continuously cross-references your report with counterpart reports. You can browse suggested matches right now.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  View in Campus Directory
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type Switcher: Lost vs Found (Functional Segmented Control) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Report Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setType('lost')}
                    className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                      type === 'lost'
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    I Lost an Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('found')}
                    className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                      type === 'found'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    I Found an Item
                  </button>
                </div>
              </div>

              {/* Title / Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AirPods Pro in Navy Case, Silver Keys, Hydro Flask"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.title
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Category <span className="text-rose-500">*</span></span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Date {type === 'lost' ? 'Lost' : 'Found'} <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                  {errors.date && (
                    <p className="text-xs text-rose-600 mt-1">{errors.date}</p>
                  )}
                </div>
              </div>

              {/* Campus Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Campus Location <span className="text-rose-500">*</span></span>
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                  <option value="Custom Location">+ Other Campus Spot...</option>
                </select>

                {location === 'Custom Location' && (
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter specific campus building, floor, or room..."
                    className="mt-2 w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                )}
                {errors.location && (
                  <p className="text-xs text-rose-600 mt-1">{errors.location}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe color, brand, condition, where it was left or seen, size..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.description
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
                  }`}
                />
                <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                  <span>Helpful details: brand, case color, model</span>
                  <span>{description.length} chars</span>
                </div>
                {errors.description && (
                  <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>

              {/* Distinctive Features / Ownership Proof Hint */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Distinctive Identifiers (For Verification)
                </label>
                <input
                  type="text"
                  value={distinctiveFeatures}
                  onChange={(e) => setDistinctiveFeatures(e.target.value)}
                  placeholder="e.g. Yosemite sticker, initials on keychain, scratch on left corner"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  This helps the AI verify ownership and prevents fraudulent claims.
                </p>
              </div>

              {/* Photo Upload & Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-slate-400" />
                  <span>Item Photo (Optional)</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  {/* File input */}
                  <label className="flex-1 w-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/50 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-medium text-slate-700">Upload a photo</span>
                    <span className="text-[11px] text-slate-400">PNG, JPG up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Preview container */}
                  {imageUrl && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        onError={() => setPreviewError(true)}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 hover:bg-black"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Instant preset picker for demo testing */}
                <div className="mt-2">
                  <span className="text-[11px] text-slate-500 mr-2">Or select a demo photo:</span>
                  <div className="inline-flex flex-wrap gap-1 mt-1">
                    {PRESET_PHOTOS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setImageUrl(p.url);
                          setPreviewError(false);
                        }}
                        className="text-[11px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Your Campus Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Name <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    />
                    {errors.contactName && (
                      <p className="text-xs text-rose-600 mt-1">{errors.contactName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>University Email <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="student@university.edu"
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                    />
                    {errors.contactEmail && (
                      <p className="text-xs text-rose-600 mt-1">{errors.contactEmail}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>Optional Phone / Messaging Handle</span>
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. (555) 000-0000 or @discord_handle"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Submit & Scan AI Matches</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
