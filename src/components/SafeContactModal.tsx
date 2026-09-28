import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Send,
  CheckCircle2,
  Lock,
  Building,
  User,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import { CampusItem, ClaimSubmission } from '../types';
import { saveClaim } from '../utils/storage';

interface SafeContactModalProps {
  item: CampusItem | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess?: () => void;
}

const SAFE_MEETUP_SPOTS = [
  'Campus Police & Safety Substation (Recommended)',
  'Main Library 1st Floor Security Desk',
  'Student Union Information & Lost Desk',
  'Science Building 1st Floor Lobby',
];

export const SafeContactModal: React.FC<SafeContactModalProps> = ({
  item,
  isOpen,
  onClose,
  onClaimSuccess,
}) => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [proofDetails, setProofDetails] = useState('');
  const [pickupPreference, setPickupPreference] = useState(SAFE_MEETUP_SPOTS[0]);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !senderEmail.trim() || !proofDetails.trim()) {
      setError('Please fill in your name, university email, and verification proof.');
      return;
    }

    const claim: ClaimSubmission = {
      id: `claim-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim(),
      senderPhone: senderPhone.trim() || undefined,
      proofDetails: proofDetails.trim(),
      pickupPreference,
      message: message.trim(),
      submittedAt: Date.now(),
    };

    saveClaim(claim);
    setIsSubmitted(true);
    setError('');
    if (onClaimSuccess) onClaimSuccess();
  };

  const handleResetAndClose = () => {
    setSenderName('');
    setSenderEmail('');
    setSenderPhone('');
    setProofDetails('');
    setMessage('');
    setIsSubmitted(false);
    setError('');
    onClose();
  };

  const isFinder = item.type === 'found';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Safe Campus Connection
              </h2>
              <p className="text-xs text-slate-500">
                Contacting reporter of: <span className="font-semibold text-slate-700">{item.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verification Request Sent!</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your request has been routed to <strong>{item.contactName}</strong> via the secure campus relay. A confirmation with your rendezvous meetup preference was recorded.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left text-xs space-y-1.5 max-w-md mx-auto text-slate-600">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Campus Safety Protocol:</span>
                </div>
                <p>• Recommended meetup location: <span className="text-slate-900 font-medium">{pickupPreference}</span></p>
                <p>• Bring your official Student ID card for mutual verification.</p>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Close & Return
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Privacy protection notice */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <p className="font-semibold">Privacy-Protected Campus Relay</p>
                  <p className="text-blue-700 mt-0.5">
                    To prevent campus theft and harassment, personal numbers are masked until mutual proof of ownership is accepted.
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Your details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Your Full Name <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>Your Student Email <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="jmiller@university.edu"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Proof of ownership prompt */}
              <div>
                <label className="block text-xs font-medium text-slate-800 mb-1">
                  Proof of Ownership / Verification Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={proofDetails}
                  onChange={(e) => setProofDetails(e.target.value)}
                  placeholder={
                    isFinder
                      ? 'Describe private item details (e.g. serial digits, lockscreen photo, contents inside, unique scratch)...'
                      : 'Provide proof you found this exact item (e.g. exact study desk number, what pouch it was in)...'
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Helps verify rightful owner and avoids unauthorized handoffs.
                </p>
              </div>

              {/* Safe meetup location */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preferred Safe Campus Handover Spot</span>
                </label>
                <select
                  value={pickupPreference}
                  onChange={(e) => setPickupPreference(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                >
                  {SAFE_MEETUP_SPOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Additional Note / Available Time
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. I am in the Science Building until 4 PM today..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Secure Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
