import React, { useState, useEffect, useMemo } from 'react';
import {
  CampusItem,
  ItemType,
  MatchResult,
} from './types';
import {
  getStoredItems,
  addStoredItem,
  updateStoredItemStatus,
  resetToSampleItems,
} from './utils/storage';
import { findAllCampusMatches } from './utils/aiMatcher';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { BrowseView } from './components/BrowseView';
import { AiMatchView } from './components/AiMatchView';
import { ReportModal } from './components/ReportModal';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { SafeContactModal } from './components/SafeContactModal';
import {
  Sparkles,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  MapPin,
  Building,
} from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<CampusItem[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'matches' | 'how-it-works'>('home');
  const [selectedItem, setSelectedItem] = useState<CampusItem | null>(null);
  const [contactItem, setContactItem] = useState<CampusItem | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportDefaultType, setReportDefaultType] = useState<ItemType>('lost');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load items from local storage on mount
  useEffect(() => {
    const loaded = getStoredItems();
    setItems(loaded);
  }, []);

  // Compute campus AI matches whenever items update
  const allMatches = useMemo(() => {
    return findAllCampusMatches(items);
  }, [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenReport = (defaultType: ItemType = 'lost') => {
    setReportDefaultType(defaultType);
    setIsReportOpen(true);
  };

  const handleItemSubmit = (newItem: CampusItem) => {
    const updated = addStoredItem(newItem);
    setItems(updated);
    showToast(`"${newItem.title}" was successfully reported!`);
  };

  const handleUpdateStatus = (itemId: string, status: CampusItem['status']) => {
    const updated = updateStoredItemStatus(itemId, status);
    setItems(updated);
    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem({ ...selectedItem, status });
    }
    showToast(status === 'reunited' ? 'Item marked as Reunited!' : 'Item status updated.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all campus items back to default sample items?')) {
      const reset = resetToSampleItems();
      setItems(reset);
      setSelectedItem(null);
      setContactItem(null);
      showToast('Reset to original sample data with AI match pairs.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenReport={handleOpenReport}
        matchedPairsCount={allMatches.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            items={items}
            allMatches={allMatches}
            onSelectItem={(it) => setSelectedItem(it)}
            onOpenReport={handleOpenReport}
            onNavigateToBrowse={(q) => {
              setActiveTab('browse');
            }}
            onNavigateToMatches={() => {
              setActiveTab('matches');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'browse' && (
          <BrowseView
            items={items}
            allMatches={allMatches}
            onSelectItem={(it) => setSelectedItem(it)}
            onOpenReport={handleOpenReport}
          />
        )}

        {activeTab === 'matches' && (
          <AiMatchView
            items={items}
            onSelectItem={(it) => setSelectedItem(it)}
            onOpenContact={(it) => setContactItem(it)}
            onOpenReport={handleOpenReport}
          />
        )}

        {activeTab === 'how-it-works' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
            <div className="space-y-3 text-center">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Student Guide
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900">
                How Lost & Found AI Operates
              </h1>
              <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
                A modern campus initiative to eliminate traditional physical bulletin boards and automate item reuniting with AI text similarity.
              </p>
            </div>

            {/* Step details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900">Accurate Reporting</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Log your item immediately. Provide brand, model, color, and location where you last saw it (e.g. Main Library 2nd Floor).
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900">AI Similarity Scoring</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our system computes term frequencies, category overlaps, and spatial proximity to match Lost items with Found items.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900">Protected Handover</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Use our Safe Contact feature. You will never meet alone in non-public spots; official campus desks are suggested.
                </p>
              </div>
            </div>

            {/* Official Campus Lost & Found Stations */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Physical Campus Holding Stations</span>
              </h2>
              <p className="text-xs text-slate-600">
                If you find high-value items (wallets, driver licenses, passports, laptops), please hand them over to one of these official desks:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="block text-slate-900 font-semibold">Campus Police Substation</strong>
                  <span className="text-slate-500">Security Annex Room 102 · Open 24/7</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="block text-slate-900 font-semibold">Main Library Front Desk</strong>
                  <span className="text-slate-500">1st Floor Entrance · 8:00 AM – 11:00 PM</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="block text-slate-900 font-semibold">Student Union Information Desk</strong>
                  <span className="text-slate-500">Ground Level Atrium · 9:00 AM – 8:00 PM</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <strong className="block text-slate-900 font-semibold">Athletic Complex Check-in</strong>
                  <span className="text-slate-500">Locker Room Gate · 6:00 AM – 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">Frequently Asked Questions</h2>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <h4 className="font-semibold text-slate-900">How does the AI match items?</h4>
                  <p className="leading-relaxed">
                    The algorithm tokenizes titles and descriptions, computes weighted keyword intersections (prioritizing brands, colors, and unique features), and correlates campus zones and dates.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <h4 className="font-semibold text-slate-900">Is my student contact information public?</h4>
                  <p className="leading-relaxed">
                    No. The safe contact relay requires claimants to answer a proof-of-ownership question first before mutual details are exchanged.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                  <h4 className="font-semibold text-slate-900">What if someone submits a false claim?</h4>
                  <p className="leading-relaxed">
                    Always ask the person claiming an item to unlock the device, describe specific stickers or internal scratches, or show matching student photo ID before handing it over.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Lost & Found AI</span>
            <span aria-hidden="true">·</span>
            <span>University Student Belonging Network</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setActiveTab('browse');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Browse All
            </button>
            <button
              onClick={() => {
                setActiveTab('matches');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              AI Match Center
            </button>
            <button
              onClick={() => {
                setActiveTab('how-it-works');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              Safety Guidelines
            </button>
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
              title="Reset items to default state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportModal
        isOpen={isReportOpen}
        defaultType={reportDefaultType}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleItemSubmit}
      />

      <ItemDetailsModal
        item={selectedItem}
        allItems={items}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onOpenContact={(it) => {
          setSelectedItem(null);
          setContactItem(it);
        }}
        onSelectMatchedItem={(it) => setSelectedItem(it)}
        onUpdateStatus={handleUpdateStatus}
      />

      <SafeContactModal
        item={contactItem}
        isOpen={!!contactItem}
        onClose={() => setContactItem(null)}
        onClaimSuccess={() => {
          showToast('Safe contact request successfully sent!');
        }}
      />
    </div>
  );
}
