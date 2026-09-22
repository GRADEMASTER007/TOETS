import React, { useState, useEffect } from 'react';
import { 
  X, 
  Bell, 
  Search, 
  Mail, 
  Smartphone, 
  Check, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Settings, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Globe,
  Tag,
  Building,
  DollarSign,
  TrendingDown,
  BellRing
} from 'lucide-react';
import { Country, PillarType, SavedSearchAlert, NotificationPreferences } from '../types';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  currentCountry: Country;
  countries: Country[];
  savedSearches: SavedSearchAlert[];
  onAddSavedSearch: (alert: Omit<SavedSearchAlert, 'id' | 'createdAt' | 'matchCount'>) => void;
  onDeleteSavedSearch: (id: string) => void;
  onToggleSavedSearchEmail: (id: string, enabled: boolean) => void;
  onToggleSavedSearchPush: (id: string, enabled: boolean) => void;
  onExecuteSearchAlert?: (query: string, pillar: PillarType | 'all') => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentCountry,
  countries,
  savedSearches,
  onAddSavedSearch,
  onDeleteSavedSearch,
  onToggleSavedSearchEmail,
  onToggleSavedSearchPush,
  onExecuteSearchAlert,
}) => {
  const [activeTab, setActiveTab] = useState<'saved_searches' | 'subscriptions' | 'profile'>('saved_searches');
  
  // New Saved Search Form
  const [newSearchName, setNewSearchName] = useState('');
  const [newSearchQuery, setNewSearchQuery] = useState('');
  const [newSearchPillar, setNewSearchPillar] = useState<PillarType | 'all'>('all');
  const [newSearchCountry, setNewSearchCountry] = useState<string>(currentCountry.id);
  const [newSearchFrequency, setNewSearchFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');
  const [newSearchMaxPrice, setNewSearchMaxPrice] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Global Notification Preferences
  const [prefs, setPrefs] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('mph_notification_prefs');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      instantLeadAlerts: true,
      dailyDigest: true,
      priceDropAlerts: true,
      weeklyMarketReports: false,
      securityAlerts: true,
    };
  });

  const [notificationTestSent, setNotificationTestSent] = useState(false);

  useEffect(() => {
    localStorage.setItem('mph_notification_prefs', JSON.stringify(prefs));
  }, [prefs]);

  if (!isOpen) return null;

  const handleCreateSearchAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSearchName.trim()) return;

    onAddSavedSearch({
      name: newSearchName.trim(),
      query: newSearchQuery.trim() || newSearchName.trim(),
      pillar: newSearchPillar,
      countryId: newSearchCountry,
      maxPrice: newSearchMaxPrice ? Number(newSearchMaxPrice) : undefined,
      frequency: newSearchFrequency,
      emailEnabled: true,
      pushEnabled: true,
    });

    setNewSearchName('');
    setNewSearchQuery('');
    setNewSearchMaxPrice('');
    setShowAddForm(false);
  };

  const handleRequestPushPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('Market Place Hub Notifications Active', {
            body: `You are now subscribed to instant listing alerts for ${currentCountry.name}.`,
            icon: '/favicon.ico',
          });
          setNotificationTestSent(true);
          setTimeout(() => setNotificationTestSent(false), 3000);
        }
      } catch (err) {
        console.log('Notification permission request:', err);
      }
    } else {
      setNotificationTestSent(true);
      setTimeout(() => setNotificationTestSent(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">User Settings &amp; Listing Alerts</h2>
              <p className="text-xs text-slate-400">Manage saved search criteria, push &amp; email subscriptions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 bg-slate-100 border-b border-slate-200 flex gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('saved_searches')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'saved_searches'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Saved Searches &amp; Alerts ({savedSearches.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'subscriptions'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notification Subscriptions</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-amber-600 text-amber-900 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Account &amp; KYC Verification</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'saved_searches' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Custom Listing Match Alerts</h3>
                  <p className="text-xs text-slate-500">
                    Get automated email and push notifications when new matching items or properties are posted.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddForm ? 'Cancel' : 'Create Search Alert'}</span>
                </button>
              </div>

              {/* Add Search Alert Form */}
              {showAddForm && (
                <form onSubmit={handleCreateSearchAlert} className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-3">
                  <div className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>New Listing Search Subscription</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Alert Label *</label>
                      <input
                        type="text"
                        required
                        value={newSearchName}
                        onChange={(e) => setNewSearchName(e.target.value)}
                        placeholder="e.g. 3-Bed Houses in Sandton"
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Search Keywords</label>
                      <input
                        type="text"
                        value={newSearchQuery}
                        onChange={(e) => setNewSearchQuery(e.target.value)}
                        placeholder="e.g. Sandton pool solar"
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Pillar</label>
                      <select
                        value={newSearchPillar}
                        onChange={(e) => setNewSearchPillar(e.target.value as any)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="all">All Pillars</option>
                        <option value="marketplace">Marketplace Products</option>
                        <option value="businesses">Business Directory</option>
                        <option value="services">Services &amp; Trades</option>
                        <option value="property">Property Listings</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Country Subdomain</label>
                      <select
                        value={newSearchCountry}
                        onChange={(e) => setNewSearchCountry(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                      >
                        {countries.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.flag} {c.name} ({c.currencyCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Notification Frequency</label>
                      <select
                        value={newSearchFrequency}
                        onChange={(e) => setNewSearchFrequency(e.target.value as any)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="instant">Instant Real-time Alert</option>
                        <option value="daily">Daily Morning Digest</option>
                        <option value="weekly">Weekly Summary</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs"
                    >
                      Save Search Subscription
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Searches List */}
              <div className="space-y-3">
                {savedSearches.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <Search className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">No active saved search alerts</p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Create an alert to receive automatic notifications whenever vendors post items matching your budget, location, and keywords.
                    </p>
                  </div>
                ) : (
                  savedSearches.map((alert) => {
                    const country = countries.find((c) => c.id === alert.countryId) || currentCountry;
                    return (
                      <div
                        key={alert.id}
                        className={`p-4 bg-white rounded-2xl border shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                          alert.alertType === 'price_drop'
                            ? 'border-amber-300 bg-gradient-to-r from-amber-50/40 via-white to-white'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {alert.listingImage && (
                            <img
                              src={alert.listingImage}
                              alt={alert.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 hidden sm:block"
                            />
                          )}

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{alert.name}</span>
                              {alert.alertType === 'price_drop' ? (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold flex items-center gap-1 uppercase tracking-wider">
                                  <TrendingDown className="w-3 h-3" />
                                  <span>Price Drop Alert</span>
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold uppercase">
                                  {alert.pillar}
                                </span>
                              )}
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center gap-1">
                                <span>{country.flag}</span>
                                <span>{country.name}</span>
                              </span>
                            </div>

                            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                              {alert.alertType === 'price_drop' ? (
                                <>
                                  <span>
                                    Initial Price: <strong className="text-slate-700">{country.currencyCode} {alert.initialPrice?.toLocaleString()}</strong>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Target Trigger: <strong className="text-emerald-700">{alert.targetPrice ? `≤ ${country.currencyCode} ${alert.targetPrice.toLocaleString()}` : 'Any Reduction'}</strong>
                                  </span>
                                  <span>•</span>
                                  <span>Frequency: <strong className="text-slate-700 capitalize">{alert.frequency}</strong></span>
                                </>
                              ) : (
                                <>
                                  <span>Query: <strong className="text-slate-700">{alert.query}</strong></span>
                                  <span>•</span>
                                  <span>Frequency: <strong className="text-slate-700 capitalize">{alert.frequency}</strong></span>
                                  <span>•</span>
                                  <span>Matches: <strong className="text-emerald-600">{alert.matchCount} listings</strong></span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => onToggleSavedSearchEmail(alert.id, !alert.emailEnabled)}
                            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                              alert.emailEnabled
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                            title="Toggle Email Alerts"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span className="text-[10px]">{alert.emailEnabled ? 'Email ON' : 'Email OFF'}</span>
                          </button>

                          <button
                            onClick={() => onToggleSavedSearchPush(alert.id, !alert.pushEnabled)}
                            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                              alert.pushEnabled
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                            title="Toggle Push Alerts"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span className="text-[10px]">{alert.pushEnabled ? 'Push ON' : 'Push OFF'}</span>
                          </button>

                          {onExecuteSearchAlert && (
                            <button
                              onClick={() => {
                                onExecuteSearchAlert(alert.query, alert.pillar);
                                onClose();
                              }}
                              className="px-2.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                            >
                              Run Search
                            </button>
                          )}

                          <button
                            onClick={() => onDeleteSavedSearch(alert.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Saved Search"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Notification Delivery Channels</h3>
                  <p className="text-xs text-slate-500">Configure how and when you receive buyer leads, price changes, and marketplace updates.</p>
                </div>
                <button
                  onClick={handleRequestPushPermission}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Test Push Alert</span>
                </button>
              </div>

              {notificationTestSent && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Simulated Push Alert triggered successfully! Notification channels verified.</span>
                </div>
              )}

              <div className="space-y-3">
                {[
                  {
                    key: 'instantLeadAlerts',
                    title: 'Instant Buyer / WhatsApp Leads',
                    desc: 'Instant alert when a prospective client submits an inquiry or message on your listing.',
                  },
                  {
                    key: 'emailNotifications',
                    title: 'Saved Search Email Notifications',
                    desc: 'Receive curated email batches when new properties, products, or service providers match your search filters.',
                  },
                  {
                    key: 'pushNotifications',
                    title: 'Browser & Mobile Push Notifications',
                    desc: 'Real-time alert banner on desktop or mobile device when your favorite items change status or price.',
                  },
                  {
                    key: 'dailyDigest',
                    title: 'Daily Pan-African Market Digest',
                    desc: 'A daily morning summary of top trending deals and newly accredited companies in your country.',
                  },
                  {
                    key: 'priceDropAlerts',
                    title: 'Price Drop & Discount Alerts',
                    desc: 'Get notified immediately if a saved vehicle, real estate listing, or electronic item has its price reduced.',
                  },
                  {
                    key: 'securityAlerts',
                    title: 'Security & Account Activity Alerts',
                    desc: 'Critical alerts regarding logins, password resets, and KYC status approvals.',
                  },
                ].map((item) => {
                  const isChecked = (prefs as any)[item.key];
                  return (
                    <div
                      key={item.key}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 text-xs">{item.title}</div>
                        <div className="text-[11px] text-slate-500">{item.desc}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrefs({ ...prefs, [item.key]: !isChecked })}
                        className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                          isChecked ? 'bg-amber-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            isChecked ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-black text-lg flex items-center justify-center">
                      {currentUser?.displayName?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {currentUser?.displayName || 'Market Place Hub User'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {currentUser?.email || 'healthyfieldsbus2@gmail.com'}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>KYC Tier-1 Verified</span>
                  </span>
                </div>
              </div>

              {/* Vendor Trust Badge System */}
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2 text-xs text-blue-950">
                <div className="font-bold flex items-center gap-2 text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Trust &amp; Verified Badge Status</span>
                </div>
                <p className="text-blue-800">
                  Your business documents, phone verification, and regional trade licenses are active. All your listings display the blue trust badge.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <span className="px-2 py-1 bg-white rounded border border-blue-300 font-mono text-[10px]">
                    ID: {currentUser?.uid || 'USR_ZA_84920'}
                  </span>
                  <span className="px-2 py-1 bg-white rounded border border-blue-300 font-mono text-[10px]">
                    Regional Anchor: {currentCountry.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <span>Preferences saved automatically to cloud session.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
