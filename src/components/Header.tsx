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
  Megaphone
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

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onChangeView('portal');
              onSelectPillar('all');
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg tracking-tight">MPH</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                  Market Place Hub
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  Global & Pan-Africa
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">marketplacehub.company • 55 Regional Subdomains</p>
            </div>
          </button>
        </div>

        {/* Center: Country Selector Button */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={onOpenCountryModal}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 transition-all text-sm font-medium shadow-2xs hover:border-slate-300"
          >
            <span className="text-xl leading-none">{currentCountry.flag}</span>
            <span>{currentCountry.name}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold font-mono">
              {currentCountry.currencyCode} ({currentCountry.currencySymbol})
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-amber-600 hover:border-amber-300 transition-all flex items-center gap-1 text-xs font-semibold"
              title="Change Language & RTL Layout"
            >
              <Languages className="w-4 h-4 text-slate-500" />
              <span className="hidden xl:inline uppercase font-mono">{language}</span>
            </button>

            {languageMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in duration-150">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onChangeLanguage?.(l.code);
                      setLanguageMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      language === l.code ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                    </span>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-amber-600 hover:border-amber-300 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-3 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-900">Notifications</span>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                    1 New
                  </span>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl text-xs space-y-0.5 transition-colors ${
                        n.unread ? 'bg-amber-50/70 border border-amber-200' : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-amber-600 hover:border-amber-300 transition-all"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Ask AI Search Button */}
          <button
            onClick={onOpenAISearch}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-amber-50 border border-amber-200 hover:border-amber-400 text-slate-800 transition-all shadow-2xs group text-xs sm:text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
            <span className="hidden xl:inline">AI Search</span>
          </button>

          {/* Gemini Chatbot Button */}
          {onOpenChatbot && (
            <button
              onClick={onOpenChatbot}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 hover:border-amber-500 text-amber-900 transition-all shadow-2xs group text-xs sm:text-sm font-semibold"
              title="Open Multi-Turn Gemini AI Concierge"
            >
              <Bot className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Gemini AI</span>
            </button>
          )}

          {/* Live Voice API Button (gemini-3.8-live) */}
          {onOpenLiveVoice && (
            <button
              onClick={onOpenLiveVoice}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-300 hover:border-rose-500 text-rose-900 transition-all shadow-2xs group text-xs sm:text-sm font-semibold"
              title="Open Real-Time Voice Conversation (gemini-3.8-live)"
            >
              <Flame className="w-4 h-4 text-rose-600 group-hover:animate-bounce transition-transform" />
              <span className="hidden sm:inline">Live Voice</span>
            </button>
          )}

          {/* Firebase Google Auth Profile / Sign In */}
          <div className="relative">
            {currentUser ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white border border-slate-200 hover:border-amber-300 text-slate-800 transition-all shadow-2xs"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-7 h-7 rounded-lg object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold hidden md:inline truncate max-w-[100px]">
                  {currentUser.displayName?.split(' ')[0] || 'My Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 transition-all shadow-2xs text-xs sm:text-sm font-semibold"
                title="Sign in with Google (Firebase Auth)"
              >
                <LogIn className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* User Dropdown */}
            {currentUser && userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-3 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-9 h-9 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="truncate">
                    <p className="font-bold text-xs text-slate-900 truncate">
                      {currentUser.displayName || 'Market Place Hub Member'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Cloud Firestore Sync Active</span>
                </div>

                <div className="pt-1 space-y-1 border-t border-slate-100">
                  {onOpenUserSettings && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenUserSettings();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                    >
                      <Bell className="w-4 h-4 text-amber-600" />
                      <span>Saved Searches &amp; Alerts</span>
                    </button>
                  )}
                  {onOpenReferralProgram && (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenReferralProgram();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                    >
                      <Gift className="w-4 h-4 text-amber-600" />
                      <span>Invite Vendors (Earn Boosts)</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onChangeView('favorites');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>My Saved Listings ({savedCount})</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (onSignOut) onSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Favorites Button */}
          <button
            onClick={() => onChangeView('favorites')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-sm font-semibold shadow-2xs ${
              currentView === 'favorites'
                ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200'
            }`}
            title="View Saved Favorites"
          >
            <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span className="hidden md:inline">Favorites</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono">
                {savedCount}
              </span>
            )}
          </button>

          {/* Post a Listing CTA */}
          <button
            onClick={onOpenPostListing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all shadow-md shadow-amber-600/20 active:scale-98 text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Post a Listing</span>
            <span className="sm:hidden">Post</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
