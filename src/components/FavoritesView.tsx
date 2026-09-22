import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  ArrowLeft, 
  Trash2, 
  ShoppingBag, 
  Building2, 
  Wrench, 
  Home, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Country, Listing, PillarType } from '../types';
import { ListingCard } from './ListingCard';

interface FavoritesViewProps {
  currentCountry: Country;
  countries: Country[];
  listings: Listing[];
  savedIds: string[];
  onToggleSave: (listingId: string) => void;
  onClearAllFavorites: () => void;
  onSelectListing: (listing: Listing) => void;
  onNavigateToPortal: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  currentCountry,
  countries,
  listings,
  savedIds,
  onToggleSave,
  onClearAllFavorites,
  onSelectListing,
  onNavigateToPortal,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<PillarType | 'all'>('all');

  // Filter listings that are saved
  const savedListings = useMemo(() => {
    return listings.filter((l) => savedIds.includes(l.id));
  }, [listings, savedIds]);

  // Sub-filter by pillar
  const filteredFavorites = useMemo(() => {
    if (selectedPillar === 'all') return savedListings;
    return savedListings.filter((l) => l.pillar === selectedPillar);
  }, [savedListings, selectedPillar]);

  const pillars = [
    { id: 'all', label: 'All Favorites', icon: Layers, count: savedListings.length },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, count: savedListings.filter(l => l.pillar === 'marketplace').length },
    { id: 'business', label: 'Businesses', icon: Building2, count: savedListings.filter(l => l.pillar === 'business').length },
    { id: 'service', label: 'Services', icon: Wrench, count: savedListings.filter(l => l.pillar === 'service').length },
    { id: 'property', label: 'Properties', icon: Home, count: savedListings.filter(l => l.pillar === 'property').length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center text-rose-400 text-2xl shadow-inner">
            <Heart className="w-7 h-7 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">My Saved Favorites</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-bold font-mono">
                {savedListings.length} {savedListings.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Your personalized shortlist of properties, vehicles, accredited contractors, and businesses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedListings.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to remove all saved favorites?')) {
                  onClearAllFavorites();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Clear all saved listings"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          <button
            onClick={onNavigateToPortal}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Browsing</span>
          </button>
        </div>
      </div>

      {/* Pillar Filter Tabs */}
      {savedListings.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
          {pillars.map((p) => {
            const Icon = p.icon;
            const isSel = selectedPillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all border ${
                  isSel
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSel ? 'text-white' : 'text-slate-500'}`} />
                <span>{p.label}</span>
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold ${
                  isSel ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {p.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredFavorites.map((item) => {
            const srcCountry =
              countries.find((c) => c.isoCode === item.countryCode) || currentCountry;
            return (
              <ListingCard
                key={item.id}
                listing={item}
                currentCountry={currentCountry}
                sourceCountry={srcCountry}
                onSelect={onSelectListing}
                isSaved={true}
                onToggleSave={onToggleSave}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 sm:p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {savedListings.length === 0
                ? 'No Saved Favorites Yet'
                : `No Favorites in ${selectedPillar.toUpperCase()}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
              {savedListings.length === 0
                ? 'Tap the heart icon on any listing across the Marketplace, Business Directory, Trades, or Property Portal to save them here for quick comparison and direct WhatsApp contact.'
                : 'You have not saved any listings under this specific section yet. Try switching tabs or explore new listings.'}
            </p>
          </div>

          <button
            onClick={onNavigateToPortal}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md shadow-amber-600/20 transition-all active:scale-98"
          >
            <span>Explore Pan-African & UAE Listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
