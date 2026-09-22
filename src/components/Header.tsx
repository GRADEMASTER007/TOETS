import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  PlusCircle, 
  LayoutDashboard, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  FileCode, 
  Menu, 
  X, 
  ChevronDown, 
  Building2, 
  ShoppingBag, 
  Wrench, 
  Home,
  Layers,
  Bell,
  Moon,
  Sun,
  Languages,
  Check,
  Bot,
  Flame,
  LogIn,
  LogOut,
  UserCheck,
  Gift,
  Car,
  Briefcase,
  Zap,
  MapPin,
  Megaphone,
  Mic
} from 'lucide-react';
import { Country, PillarType } from '../types';

interface HeaderProps {
  currentCountry: Country;
  onOpenCountryModal: () => void;
  activePillar: PillarType | 'all';
  onSelectPillar: (pillar: PillarType | 'all') => void;
  onOpenAISearch: () => void;
  onOpenChatbot?: () => void;
  onOpenLiveVoice?: () => void;
  currentUser?: any;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onOpenPostListing: () => void;
  onOpenDeliverables: () => void;
  onOpenUserSettings?: () => void;
  onOpenReferralProgram?: () => void;
  currentView: 'portal' | 'vendor' | 'admin' | 'favorites';
  onChangeView: (view: 'portal' | 'vendor' | 'admin' | 'favorites') => void;
  savedCount: number;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  language?: string;
  onChangeLanguage?: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCountry,
  onOpenCountryModal,
  activePillar,
  onSelectPillar,
  onOpenAISearch,
  onOpenChatbot,
  onOpenLiveVoice,
  currentUser,
  onSignIn,
  onSignOut,
  onOpenPostListing,
  onOpenDeliverables,
  onOpenUserSettings,
  onOpenReferralProgram,
  currentView,
  onChangeView,
  savedCount,
  isDarkMode = false,
  onToggleDarkMode,
  language = 'en',
  onChangeLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'New WhatsApp Inquiry',
      desc: 'Buyer interested in 4 Bedroom Modern Home in Sandton',
      time: '12m ago',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Boost Tier Active',
      desc: 'Your Featured 1-Month placement is active (19 days remaining)',
      time: '2h ago',
      unread: false,
    },
    {
      id: 'n3',
      title: 'KYC Tier-1 Approved',
      desc: 'Your business profile is now verified with the blue trust shield',
      time: '1d ago',
      unread: false,
    },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'ar', name: 'العربية (Arabic)', flag: '🇦🇪', dir: 'rtl' },
    { code: 'fr', name: 'Français (French)', flag: '🇫🇷', dir: 'ltr' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', dir: 'ltr' },
    { code: 'pt', name: 'Português', flag: '🇲🇿', dir: 'ltr' },
  ];

  const pillars = [
    { id: 'all', label: 'All', icon: Layers },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'business', label: 'Business Directory', icon: Building2 },
    { id: 'service', label: 'Services & Trades', icon: Wrench },
    { id: 'property', label: 'Property Portal', icon: Home },
    { id: 'motors', label: 'Motors', icon: Car },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'business_services', label: 'Business Services', icon: ShieldCheck },
    { id: 'advertising', label: 'Promote', icon: Megaphone },
    { id: 'directory', label: 'Locations', icon: MapPin },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner / Subdomain & Multi-country Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Regional Subdomain:</span>
            <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {currentCountry.subdomain}.marketplacehub.company
            </span>
          </div>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Active: <strong className="text-white">{currentCountry.name}</strong> ({currentCountry.region})
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onOpenDeliverables}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-semibold"
            title="View Full Architecture, DB Schemas & Code Deliverables"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Tech Stack & Master Deliverables</span>
          </button>

          <div className="flex items-center gap-1 border-l border-slate-700 pl-3">
            <button
              onClick={() => onChangeView('portal')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                currentView === 'portal'
                  ? 'bg-amber-500 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Public Portal
            </button>
            <button
              onClick={() => onChangeView('favorites')}
              className={`px-2 py-0.5 rounded text-xs transition-colors flex items-center gap-1 ${
                currentView === 'favorites'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-300 hover:text-rose-300'
              }`}
            >
              <Heart className={`w-3 h-3 ${savedCount > 0 ? 'fill-rose-400 text-rose-400' : ''}`} />
              <span>My Favorites ({savedCount})</span>
            </button>
            <button
              onClick={() => onChangeView('vendor')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                currentView === 'vendor'
                  ? 'bg-amber-500 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Vendor Dashboard
            </button>
            <button
              onClick={() => onChangeView('admin')}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                currentView === 'admin'
                  ? 'bg-amber-500 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Admin CMS
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row: Zone Contract Implementation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onChangeView('portal');
              onSelectPillar('all');
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-950/20 group-hover:bg-amber-600 transition-all">
              <span className="font-extrabold text-lg tracking-tight font-display">M</span>
            </div>
            <span className="font-bold text-2xl tracking-tighter text-slate-900 group-hover:text-amber-600 transition-colors font-display">
              Marketplace Hub
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (4-6 clean text labels) */}
        <nav className="hidden lg:flex items-center gap-8">
          <button onClick={() => { onChangeView('portal'); onSelectPillar('all'); }} className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 decoration-amber-500 transition-all">Overview</button>
          <button onClick={() => { onChangeView('portal'); onSelectPillar('property'); }} className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 decoration-amber-500 transition-all">Property</button>
          <button onClick={() => { onChangeView('portal'); onSelectPillar('service'); }} className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 decoration-amber-500 transition-all">Services</button>
          <button onClick={() => { onChangeView('portal'); onSelectPillar('marketplace'); }} className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 decoration-amber-500 transition-all">Marketplace</button>
          <button onClick={() => { onChangeView('portal'); onSelectPillar('business'); }} className="text-sm font-semibold text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 decoration-amber-500 transition-all">Directory</button>
        </nav>

        {/* Zone 3: Primary Actions (1-2 high-intent buttons) */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 border-r border-slate-200 pr-3 mr-1">
            <button
              onClick={onOpenAISearch}
              className="p-2 text-slate-500 hover:text-amber-600 transition-colors"
              title="AI Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onOpenLiveVoice}
              className="p-2 text-slate-500 hover:text-rose-600 transition-colors"
              title="Live Voice"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onOpenPostListing}
            className="px-5 py-2.5 bg-slate-900 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            Post Listing
          </button>

          {/* Secondary Actions in a clean dropdown or icon set */}
          <div className="flex items-center gap-1.5">
            {currentUser ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 hover:border-amber-400 transition-all"
              >
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <UserCheck className="w-5 h-5 text-slate-600" />
                )}
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-all"
                title="Sign In"
              >
                <LogIn className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars Navigation Tabs */}
      {currentView === 'portal' && (
        <div className="border-t border-slate-100 bg-slate-50/80 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto py-1.5 scrollbar-none">
            {pillars.map((p) => {
              const Icon = p.icon;
              const isActive = activePillar === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPillar(p.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentCountry.flag}</span>
              <div>
                <div className="font-bold text-slate-900 text-sm">{currentCountry.name}</div>
                <div className="text-xs text-slate-500 font-mono">
                  {currentCountry.subdomain}.marketplacehub.company • {currentCountry.currencyCode}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onOpenCountryModal();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onChangeView('portal');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-center text-xs font-semibold rounded-lg bg-slate-100 text-slate-800"
            >
              Public Portal
            </button>
            <button
              onClick={() => {
                onChangeView('favorites');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-center text-xs font-semibold rounded-lg bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Favorites ({savedCount})</span>
            </button>
            <button
              onClick={() => {
                onChangeView('vendor');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-center text-xs font-semibold rounded-lg bg-slate-100 text-slate-800"
            >
              Vendor Dashboard
            </button>
            <button
              onClick={() => {
                onChangeView('admin');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-center text-xs font-semibold rounded-lg bg-slate-100 text-slate-800"
            >
              Admin CMS
            </button>
          </div>
          <button
            onClick={() => {
              onOpenDeliverables();
              setMobileMenuOpen(false);
            }}
            className="w-full px-3 py-2 text-center text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-200"
          >
            Tech Architecture & Master Deliverables
          </button>
        </div>
      )}
    </header>
  );
};
