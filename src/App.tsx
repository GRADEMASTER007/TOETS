import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  VideoHero 
} from './components/VideoHero';
import { 
  ListingCard 
} from './components/ListingCard';
import { 
  ListingDetailModal 
} from './components/ListingDetailModal';
import { 
  BoostModal 
} from './components/BoostModal';
import { 
  AISearchModal 
} from './components/AISearchModal';
import { 
  CountrySelectorModal 
} from './components/CountrySelectorModal';
import { 
  PostListingWizard 
} from './components/PostListingWizard';
import { 
  VendorDashboard 
} from './components/VendorDashboard';
import { 
  AdminDashboard 
} from './components/AdminDashboard';
import { 
  DeliverablesExplorerModal 
} from './components/DeliverablesExplorerModal';
import { 
  FavoritesView 
} from './components/FavoritesView';
import { 
  Footer 
} from './components/Footer';
import { 
  LegalViewerModal 
} from './components/LegalViewerModal';
import { 
  LEGAL_PAGES_DATA 
} from './data/legalPagesData';
import { 
  CookieBanner 
} from './components/CookieBanner';
import { 
  GeminiChatModal 
} from './components/GeminiChatModal';
import { 
  LiveVoiceModal 
} from './components/LiveVoiceModal';
import { 
  UserSettingsModal 
} from './components/UserSettingsModal';
import { 
  ReferralProgramModal 
} from './components/ReferralProgramModal';
import { 
  signInWithGoogle, 
  logOut, 
  onAuthUserChanged,
  fetchUserFavoritesFromFirestore,
  toggleFavoriteInFirestore,
  saveListingToFirestore,
  fetchFirestoreListings
} from './lib/firebase';
import type { User } from 'firebase/auth';

import { 
  COUNTRIES as allAfricanCountries, 
  CATEGORIES as initialCategories, 
  INITIAL_LISTINGS as initialListings, 
  BOOST_PLANS as initialBoostPlans, 
  INITIAL_TRANSACTIONS as initialTransactions, 
  INITIAL_REVIEWS as initialReviews 
} from './data/initialData';
import { Category, Country, Listing, PillarType, Transaction, Review, SavedSearchAlert } from './types';
import { 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Sparkles, 
  Zap, 
  MapPin, 
  X,
  Layers,
  ShoppingBag,
  Building2,
  Wrench,
  Home,
  Check
} from 'lucide-react';

// Intelligent Subdomain & GEO Country Resolution
function resolveInitialCountry(countryList: Country[]): Country {
  if (typeof window !== 'undefined') {
    // 1. Detect subdomain (e.g. za.marketplacehub.company, ae.marketplacehub.company)
    const hostname = window.location.hostname.toLowerCase();
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const candidateSub = parts[0];
      if (candidateSub !== 'www' && candidateSub !== 'marketplacehub' && candidateSub !== 'ais-dev' && candidateSub !== 'ais-pre') {
        const matchSub = countryList.find(
          (c) => c.subdomain.toLowerCase() === candidateSub || c.isoCode.toLowerCase() === candidateSub
        );
        if (matchSub) return matchSub;
      }
    }

    // 2. Detect URL search query parameters (?country=ae, ?geo=ke, ?subdomain=ng)
    try {
      const params = new URLSearchParams(window.location.search);
      const queryParam = (params.get('country') || params.get('geo') || params.get('subdomain') || '').toLowerCase();
      if (queryParam) {
        const matchParam = countryList.find(
          (c) => c.subdomain.toLowerCase() === queryParam || c.isoCode.toLowerCase() === queryParam || c.id.toLowerCase() === queryParam
        );
        if (matchParam) return matchParam;
      }
    } catch {
      // ignore
    }

    // 3. Detect saved user preference
    const savedId = localStorage.getItem('mph_country_id') || localStorage.getItem('afritrade_country_id');
    if (savedId) {
      const found = countryList.find((c: Country) => c.id === savedId);
      if (found) return found;
    }

    // 4. Geo-detect by browser timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase();
      if (tz.includes('dubai') || tz.includes('uae')) {
        const match = countryList.find((c) => c.id === 'ae');
        if (match) return match;
      } else if (tz.includes('nairobi')) {
        const match = countryList.find((c) => c.id === 'ke');
        if (match) return match;
      } else if (tz.includes('lagos')) {
        const match = countryList.find((c) => c.id === 'ng');
        if (match) return match;
      } else if (tz.includes('cairo')) {
        const match = countryList.find((c) => c.id === 'eg');
        if (match) return match;
      } else if (tz.includes('accra')) {
        const match = countryList.find((c) => c.id === 'gh');
        if (match) return match;
      } else if (tz.includes('gaborone')) {
        const match = countryList.find((c) => c.id === 'bw');
        if (match) return match;
      } else if (tz.includes('windhoek')) {
        const match = countryList.find((c) => c.id === 'na');
        if (match) return match;
      } else if (tz.includes('kigali')) {
        const match = countryList.find((c) => c.id === 'rw');
        if (match) return match;
      }
    } catch {
      // ignore
    }
  }

  // Anchor Market Default: South Africa (ZA)
  return countryList.find((c: Country) => c.id === 'za') || countryList[0];
}

export function App() {
  // 1. Regional Country State (Persisted in localStorage & Subdomain/GEO detected)
  const [countries, setCountries] = useState<Country[]>(() => {
    return allAfricanCountries;
  });

  const [currentCountry, setCurrentCountry] = useState<Country>(() => {
    return resolveInitialCountry(allAfricanCountries);
  });

  useEffect(() => {
    localStorage.setItem('mph_country_id', currentCountry.id);
    localStorage.setItem('afritrade_country_id', currentCountry.id);
  }, [currentCountry]);

  // 2. Core Entities State
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [categories, setCategories] = useState(initialCategories);
  const [boostPlans] = useState(initialBoostPlans);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // 3. Navigation & Filters
  const [activePillar, setActivePillar] = useState<PillarType | 'all'>('all');
  const [currentView, setCurrentView] = useState<'portal' | 'vendor' | 'admin' | 'favorites'>('portal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'boost' | 'price_asc' | 'price_desc' | 'date'>('boost');
  const [aiFilteredIds, setAiFilteredIds] = useState<string[] | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Dynamic SEO & Canonical synchronization
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const pillarName = activePillar !== 'all' ? `${activePillar.charAt(0).toUpperCase() + activePillar.slice(1)} | ` : '';
    document.title = `${pillarName}Market Place Hub – ${currentCountry.name} (${currentCountry.subdomain}.marketplacehub.company)`;

    // Update canonical link
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://${currentCountry.subdomain}.marketplacehub.company/${activePillar !== 'all' ? activePillar : ''}`;

    // Update Geo Meta Tags
    let geoRegion = document.querySelector<HTMLMetaElement>('meta[name="geo.region"]');
    if (geoRegion) geoRegion.content = currentCountry.isoCode;
    let geoPlace = document.querySelector<HTMLMetaElement>('meta[name="geo.placename"]');
    if (geoPlace) geoPlace.content = `${currentCountry.name}, ${currentCountry.region}`;
  }, [currentCountry, activePillar]);

  // 4. Saved / Favorites
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mph_saved_ids') || localStorage.getItem('afritrade_saved_ids');
    return saved ? JSON.parse(saved) : [];
  });

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthUserChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync user favorites from Cloud Firestore
        try {
          const cloudFavorites = await fetchUserFavoritesFromFirestore(user.uid);
          if (cloudFavorites && cloudFavorites.length > 0) {
            setSavedIds((prev) => Array.from(new Set([...prev, ...cloudFavorites])));
          }
        } catch (err) {
          console.warn('Failed to fetch user favorites from Firestore:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('mph_saved_ids', JSON.stringify(savedIds));
    localStorage.setItem('afritrade_saved_ids', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSaveListing = async (listingId: string) => {
    const isSaved = savedIds.includes(listingId);
    setSavedIds((prev) =>
      isSaved ? prev.filter((id) => id !== listingId) : [...prev, listingId]
    );

    if (currentUser) {
      try {
        await toggleFavoriteInFirestore(currentUser.uid, listingId, !isSaved);
      } catch (err) {
        console.warn('Failed to update favorite in Firestore:', err);
      }
    }
  };

  const handleClearAllFavorites = () => {
    setSavedIds([]);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn('Google Sign-In notice:', err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err: any) {
      console.warn('Sign out notice:', err.message);
    }
  };

  // 5. Modals State
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [selectedListingDetail, setSelectedListingDetail] = useState<Listing | null>(null);
  const [selectedBoostListing, setSelectedBoostListing] = useState<Listing | null>(null);
  const [aiSearchModalOpen, setAiSearchModalOpen] = useState(false);
  const [geminiChatModalOpen, setGeminiChatModalOpen] = useState(false);
  const [liveVoiceModalOpen, setLiveVoiceModalOpen] = useState(false);
  const [postListingModalOpen, setPostListingModalOpen] = useState(false);
  const [deliverablesModalOpen, setDeliverablesModalOpen] = useState(false);
  const [userSettingsModalOpen, setUserSettingsModalOpen] = useState(false);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalSlug, setLegalModalSlug] = useState<string>('/privacy-policy');

  // Saved Searches & Listing Notification Alerts
  const [savedSearches, setSavedSearches] = useState<SavedSearchAlert[]>(() => {
    const saved = localStorage.getItem('mph_saved_searches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'alert-1',
        name: '3-Bedroom Houses in Sandton',
        query: 'Sandton 3 bedroom solar pool',
        pillar: 'property',
        countryId: 'za',
        frequency: 'instant',
        emailEnabled: true,
        pushEnabled: true,
        matchCount: 4,
        createdAt: '2026-09-18',
      },
      {
        id: 'alert-2',
        name: 'Toyota Land Cruisers & Hilux',
        query: 'Toyota Hilux 4x4',
        pillar: 'marketplace',
        countryId: 'za',
        frequency: 'daily',
        emailEnabled: true,
        pushEnabled: false,
        matchCount: 7,
        createdAt: '2026-09-20',
      },
      {
        id: 'alert-3',
        name: 'Certified Solar Installers',
        query: 'solar inverter backup',
        pillar: 'services',
        countryId: 'za',
        frequency: 'instant',
        emailEnabled: true,
        pushEnabled: true,
        matchCount: 12,
        createdAt: '2026-09-21',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('mph_saved_searches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  const handleAddSavedSearch = (alertData: Omit<SavedSearchAlert, 'id' | 'createdAt' | 'matchCount'>) => {
    const newAlert: SavedSearchAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      matchCount: Math.floor(Math.random() * 8) + 2,
    };
    setSavedSearches((prev) => [newAlert, ...prev]);
  };

  const handleDeleteSavedSearch = (id: string) => {
    setSavedSearches((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleSavedSearchEmail = (id: string, enabled: boolean) => {
    setSavedSearches((prev) =>
      prev.map((a) => (a.id === id ? { ...a, emailEnabled: enabled } : a))
    );
  };

  const handleToggleSavedSearchPush = (id: string, enabled: boolean) => {
    setSavedSearches((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pushEnabled: enabled } : a))
    );
  };

  const handleExecuteSavedSearch = (query: string, pillar: PillarType | 'all') => {
    setSearchQuery(query);
    if (pillar !== 'all') {
      setActivePillar(pillar);
    }
    setCurrentView('portal');
    setAiFilteredIds(null);
  };

  // Direct URL slug detection & back/forward navigation support for legal compliance pages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path && path !== '/' && LEGAL_PAGES_DATA[path]) {
        setLegalModalSlug(path);
        setLegalModalOpen(true);
      }

      const handlePopState = () => {
        const currentPath = window.location.pathname;
        if (currentPath && currentPath !== '/' && LEGAL_PAGES_DATA[currentPath]) {
          setLegalModalSlug(currentPath);
          setLegalModalOpen(true);
        } else if (currentPath === '/') {
          setLegalModalOpen(false);
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const handleOpenLegalPage = (slug: string) => {
    setLegalModalSlug(slug);
    setLegalModalOpen(true);
  };

  // Dark mode & language & RTL state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (localStorage.getItem('mph_dark_mode') || localStorage.getItem('afritrade_dark_mode')) === 'true';
  });

  const [language, setLanguage] = useState<'en' | 'ar' | 'fr' | 'sw' | 'pt'>(() => {
    return ((localStorage.getItem('mph_lang') || localStorage.getItem('afritrade_lang')) as any) || 'en';
  });

  // Handle dark mode effect on body / root
  useEffect(() => {
    localStorage.setItem('mph_dark_mode', String(isDarkMode));
    localStorage.setItem('afritrade_dark_mode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle language and RTL direction
  useEffect(() => {
    localStorage.setItem('mph_lang', language);
    localStorage.setItem('afritrade_lang', language);
    if (language === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [language]);

  // Voice search transcription state
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Handler for Voice Search in Hero
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setAiSearchModalOpen(true);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      setIsTranscribing(true);

      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setIsTranscribing(false);
        setSearchQuery(text);
        setAiFilteredIds(null);
      };

      recognition.onerror = () => setIsTranscribing(false);
      recognition.onend = () => setIsTranscribing(false);
      recognition.start();
    } catch {
      setIsTranscribing(false);
      setAiSearchModalOpen(true);
    }
  };

  // Handler when listing boost is purchased & confirmed
  const handleActivateBoost = (
    listingId: string,
    planId: 'free' | 'week' | 'month' | 'three_months',
    newTx: Transaction
  ) => {
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === listingId) {
          const durationDays = planId === 'three_months' ? 90 : planId === 'month' ? 30 : planId === 'week' ? 7 : 0;
          return {
            ...l,
            featuredTier: planId,
            featuredDaysLeft: durationDays,
          };
        }
        return l;
      })
    );
    setTransactions((prev) => [newTx, ...prev]);

    // Update active modal if open
    if (selectedListingDetail && selectedListingDetail.id === listingId) {
      setSelectedListingDetail((prev) => (prev ? { ...prev, featuredTier: planId } : null));
    }
  };

  // Add review handler
  const handleAddReview = (listingId: string, authorName: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      listingId,
      authorName,
      authorLocation: currentCountry.name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedBuyer: true,
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  // Admin moderation handlers
  const handleApproveListing = (id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'active' } : l))
    );
  };

  const handleRejectListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  // Country manager toggle
  const handleToggleCountry = (id: string) => {
    setCountries((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  // Filter listings for the current view & selected filters
  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      // Must be active status for public portal
      if (currentView === 'portal' && l.status !== 'active') return false;

      // Filter by Pillar
      if (activePillar !== 'all' && l.pillar !== activePillar) return false;

      // Filter by AI search if active
      if (aiFilteredIds && aiFilteredIds.length > 0) {
        if (!aiFilteredIds.includes(l.id)) return false;
      }

      // Filter by Category
      if (selectedCategory !== 'all' && l.categoryId !== selectedCategory) {
        return false;
      }

      // Filter by City
      if (selectedCity !== 'all' && l.city !== selectedCity) {
        return false;
      }

      // Text query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = l.title.toLowerCase().includes(q);
        const matchesDesc = l.description.toLowerCase().includes(q);
        const matchesCity = l.city.toLowerCase().includes(q);
        const matchesCategory = l.categoryName.toLowerCase().includes(q);
        const matchesSubcategory = l.subcategory.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCity && !matchesCategory && !matchesSubcategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Primary Boost Ranking weight
      if (sortBy === 'boost') {
        const tierRank: Record<string, number> = {
          three_months: 3,
          month: 2,
          week: 1,
          free: 0,
        };
        const rankDiff = (tierRank[b.featuredTier] || 0) - (tierRank[a.featuredTier] || 0);
        if (rankDiff !== 0) return rankDiff;
        return b.views - a.views;
      }

      if (sortBy === 'price_asc') {
        return a.price - b.price;
      }

      if (sortBy === 'price_desc') {
        return b.price - a.price;
      }

      if (sortBy === 'date') {
        return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
      }

      return 0;
    });
  }, [listings, activePillar, aiFilteredIds, selectedCategory, selectedCity, searchQuery, sortBy, currentView]);

  // VIP Spotlight Carousel listings (top tier boosted)
  const vipSpotlightListings = useMemo(() => {
    return listings.filter((l) => l.featuredTier === 'three_months' || l.featuredTier === 'month');
  }, [listings]);

  // Available unique cities for filter dropdown
  const availableCities = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((l) => set.add(l.city));
    return Array.from(set);
  }, [listings]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* 1. Header Navigation */}
      <Header
        currentCountry={currentCountry}
        onOpenCountryModal={() => setCountryModalOpen(true)}
        activePillar={activePillar}
        onSelectPillar={(pillar) => {
          setActivePillar(pillar);
          setSelectedCategory('all');
          setAiFilteredIds(null);
          setAiSummary(null);
        }}
        onOpenAISearch={() => setAiSearchModalOpen(true)}
        onOpenChatbot={() => setGeminiChatModalOpen(true)}
        onOpenLiveVoice={() => setLiveVoiceModalOpen(true)}
        currentUser={currentUser}
        onSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
        onOpenPostListing={() => setPostListingModalOpen(true)}
        onOpenDeliverables={() => setDeliverablesModalOpen(true)}
        onOpenUserSettings={() => setUserSettingsModalOpen(true)}
        onOpenReferralProgram={() => setReferralModalOpen(true)}
        currentView={currentView}
        onChangeView={setCurrentView}
        savedCount={savedIds.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        language={language}
        onChangeLanguage={(lang) => setLanguage(lang as any)}
      />

      {/* 2. Main Content Router */}
      <main className="flex-1">
        {currentView === 'portal' && (
          <div className="space-y-8 pb-16">
            {/* Full-width Video Hero with Pillar Theming */}
            <VideoHero
              currentCountry={currentCountry}
              activePillar={activePillar}
              onSearch={(query) => {
                setSearchQuery(query);
                setAiFilteredIds(null);
                setAiSummary(null);
              }}
              onOpenCountryModal={() => setCountryModalOpen(true)}
              onOpenAISearch={() => setAiSearchModalOpen(true)}
              onVoiceSearch={handleVoiceSearch}
              isTranscribing={isTranscribing}
            />

            {/* AI Search Filter Banner if active */}
            {aiSummary && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="p-4 bg-gradient-to-r from-amber-50 via-indigo-50 to-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                    <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <strong className="text-slate-900">AI Search Active:</strong>{' '}
                      <span className="text-slate-700">{aiSummary}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setAiFilteredIds(null);
                      setAiSummary(null);
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg"
                    title="Clear AI filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* VIP Spotlight Carousel Section */}
            {vipSpotlightListings.length > 0 && !searchQuery && !aiFilteredIds && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">VIP Spotlight Placements</h2>
                      <p className="text-xs text-slate-500">Premium featured listings across South Africa & UAE</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {vipSpotlightListings.slice(0, 3).map((item) => {
                    const srcCountry =
                      countries.find((c) => c.isoCode === item.countryCode) || currentCountry;
                    return (
                      <ListingCard
                        key={item.id}
                        listing={item}
                        currentCountry={currentCountry}
                        sourceCountry={srcCountry}
                        onSelect={(l) => setSelectedListingDetail(l)}
                        isSaved={savedIds.includes(item.id)}
                        onToggleSave={toggleSaveListing}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter & Sorting Controls Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Left: Section Counter & Active Pillar */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {filteredListings.length} Listings
                  </span>
                  <span className="text-slate-400">in</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                    {currentCountry.name}
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      <span>Query: "{searchQuery}"</span>
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Right: Category, City & Sort Dropdowns */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Category Dropdown */}
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                    <span className="text-slate-400">Category:</span>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="bg-transparent font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="all">All Categories</option>
                      {categories
                        .filter((c: Category) => activePillar === 'all' || c.pillar === activePillar)
                        .map((cat: Category) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* City Dropdown */}
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                    <span className="text-slate-400">City:</span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="bg-transparent font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="all">All Locations</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sorting Dropdown */}
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="boost">Ranking (Boosted First)</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="date">Newest Listings</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Listings Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredListings.map((item) => {
                    const srcCountry =
                      countries.find((c) => c.isoCode === item.countryCode) || currentCountry;
                    return (
                      <ListingCard
                        key={item.id}
                        listing={item}
                        currentCountry={currentCountry}
                        sourceCountry={srcCountry}
                        onSelect={(l) => setSelectedListingDetail(l)}
                        isSaved={savedIds.includes(item.id)}
                        onToggleSave={toggleSaveListing}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Filter className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">No Listings Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    We could not find any active listings matching your search or filters. Try adjusting the query, city, or ask the AI assistant.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedCity('all');
                      setAiFilteredIds(null);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vendor Console View */}
        {currentView === 'vendor' && (
          <VendorDashboard
            currentCountry={currentCountry}
            listings={listings}
            transactions={transactions}
            onOpenPostListing={() => setPostListingModalOpen(true)}
            onOpenBoostModal={(l) => setSelectedBoostListing(l)}
            onDeleteListing={(id) => setListings((prev) => prev.filter((item) => item.id !== id))}
          />
        )}

        {/* Admin CMS View */}
        {currentView === 'admin' && (
          <AdminDashboard
            countries={countries}
            onToggleCountry={handleToggleCountry}
            categories={categories}
            boostPlans={boostPlans}
            listings={listings}
            onApproveListing={handleApproveListing}
            onRejectListing={handleRejectListing}
            transactions={transactions}
          />
        )}

        {/* My Favorites View */}
        {currentView === 'favorites' && (
          <FavoritesView
            currentCountry={currentCountry}
            countries={countries}
            listings={listings}
            savedIds={savedIds}
            onToggleSave={toggleSaveListing}
            onClearAllFavorites={handleClearAllFavorites}
            onSelectListing={(l) => setSelectedListingDetail(l)}
            onNavigateToPortal={() => setCurrentView('portal')}
          />
        )}
      </main>

      {/* 3. Comprehensive Compliance & Regional Subdomains Footer */}
      <Footer
        countries={countries}
        currentCountry={currentCountry}
        onSelectCountry={(c) => setCurrentCountry(c)}
        onOpenLegalPage={handleOpenLegalPage}
        onOpenPostListing={() => setPostListingModalOpen(true)}
        onOpenDeliverables={() => setDeliverablesModalOpen(true)}
      />

      {/* 4. Global Modals */}
      {/* Country Selector Modal */}
      <CountrySelectorModal
        isOpen={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
        countries={countries}
        currentCountry={currentCountry}
        onSelectCountry={(c) => setCurrentCountry(c)}
      />

      {/* Listing Detail Modal */}
      {selectedListingDetail && (
        <ListingDetailModal
          listing={selectedListingDetail}
          onClose={() => setSelectedListingDetail(null)}
          currentCountry={currentCountry}
          sourceCountry={
            countries.find((c) => c.isoCode === selectedListingDetail.countryCode) || currentCountry
          }
          onOpenBoostModal={(l) => {
            setSelectedBoostListing(l);
          }}
          reviews={reviews}
          onAddReview={handleAddReview}
          similarListings={listings.filter(
            (l) => l.pillar === selectedListingDetail.pillar && l.id !== selectedListingDetail.id
          )}
          onSelectListing={(l) => setSelectedListingDetail(l)}
          onSendMessage={(listing, message) => {
            console.log('Inquiry message sent:', listing.id, message);
          }}
        />
      )}

      {/* Boost & Paid Placement Modal */}
      {selectedBoostListing && (
        <BoostModal
          isOpen={true}
          onClose={() => setSelectedBoostListing(null)}
          listing={selectedBoostListing}
          boostPlans={boostPlans}
          currentCountry={currentCountry}
          onActivateBoost={handleActivateBoost}
        />
      )}

      {/* AI Conversational Search Modal */}
      <AISearchModal
        isOpen={aiSearchModalOpen}
        onClose={() => setAiSearchModalOpen(false)}
        currentCountry={currentCountry}
        listings={listings}
        onApplyAIFilters={(ids, summary) => {
          setAiFilteredIds(ids);
          setAiSummary(summary);
        }}
      />

      {/* Multi-Turn Gemini AI Chatbot Modal (Roles, Search & Maps Grounding, Pro Thinking) */}
      <GeminiChatModal
        isOpen={geminiChatModalOpen}
        onClose={() => setGeminiChatModalOpen(false)}
        currentCountry={currentCountry}
        onOpenLiveVoice={() => setLiveVoiceModalOpen(true)}
      />

      {/* Real-Time Live Voice Modal (gemini-3.8-live) */}
      <LiveVoiceModal
        isOpen={liveVoiceModalOpen}
        onClose={() => setLiveVoiceModalOpen(false)}
        currentCountry={currentCountry}
        onOpenChatbot={() => setGeminiChatModalOpen(true)}
      />

      {/* Post a Listing Wizard */}
      <PostListingWizard
        isOpen={postListingModalOpen}
        onClose={() => setPostListingModalOpen(false)}
        categories={categories}
        currentCountry={currentCountry}
        boostPlans={boostPlans}
        onListingCreated={async (newListing) => {
          setListings((prev) => [newListing, ...prev]);
          if (currentUser) {
            try {
              await saveListingToFirestore(newListing);
            } catch (err) {
              console.warn('Failed to sync new listing to Firestore:', err);
            }
          }
        }}
      />

      {/* Tech Stack & Master Deliverables Modal */}
      <DeliverablesExplorerModal
        isOpen={deliverablesModalOpen}
        onClose={() => setDeliverablesModalOpen(false)}
      />

      {/* Comprehensive 48-Page Legal & Compliance Library Viewer */}
      <LegalViewerModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        currentSlug={legalModalSlug}
        onSelectSlug={(slug) => setLegalModalSlug(slug)}
      />

      {/* User Settings & Listing Match Notification Alerts */}
      <UserSettingsModal
        isOpen={userSettingsModalOpen}
        onClose={() => setUserSettingsModalOpen(false)}
        currentUser={currentUser}
        currentCountry={currentCountry}
        countries={countries}
        savedSearches={savedSearches}
        onAddSavedSearch={handleAddSavedSearch}
        onDeleteSavedSearch={handleDeleteSavedSearch}
        onToggleSavedSearchEmail={handleToggleSavedSearchEmail}
        onToggleSavedSearchPush={handleToggleSavedSearchPush}
        onExecuteSearchAlert={handleExecuteSavedSearch}
      />

      {/* Vendor Referral Growth & Boost Credit Modal */}
      <ReferralProgramModal
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
        currentCountry={currentCountry}
        currentUser={currentUser}
        onOpenBoostModal={() => {
          setReferralModalOpen(false);
          if (listings.length > 0) {
            setSelectedBoostListing(listings[0]);
          }
        }}
      />

      {/* Regional Cookie Consent Banner */}
      <CookieBanner
        onOpenPrivacy={() => {
          handleOpenLegalPage('/cookie-policy');
        }}
      />
    </div>
  );
}
export default App;
