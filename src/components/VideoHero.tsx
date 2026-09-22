import React, { useState } from 'react';
import { Search, Sparkles, Mic, MapPin, ArrowRight, ShieldCheck, Zap, Home, ShoppingBag, Building2, Wrench } from 'lucide-react';
import { Country, PillarType } from '../types';

interface VideoHeroProps {
  currentCountry: Country;
  activePillar: PillarType | 'all';
  onSearch: (query: string) => void;
  onOpenCountryModal: () => void;
  onOpenAISearch: () => void;
  onVoiceSearch: () => void;
  isTranscribing: boolean;
}

export const VideoHero: React.FC<VideoHeroProps> = ({
  currentCountry,
  activePillar,
  onSearch,
  onOpenCountryModal,
  onOpenAISearch,
  onVoiceSearch,
  isTranscribing,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const pillarHeroData: Record<string, { title: string; subtitle: string; videoSrc: string; poster: string; suggestions: string[] }> = {
    all: {
      title: `Pan-African & UAE Unified Commerce Portal`,
      subtitle: `Browse verified Marketplace products, certified Tradespeople, registered Businesses, and Luxury Real Estate across Africa & the UAE.`,
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-modern-city-buildings-with-lights-at-night-42861-large.mp4',
      poster: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
      suggestions: [
        '3 bedroom house in Sandton under R15000',
        'Tier-1 Solar PV Installer with COC',
        'Dubai Marina Waterfront Apartment',
        'Toyota Hilux 4x4 low mileage',
      ],
    },
    marketplace: {
      title: `Pan-African Marketplace & Classifieds`,
      subtitle: `Buy and sell vehicles, gadgets, building materials, agricultural machinery, and consumer goods in local currencies.`,
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-and-showing-a-smartphone-41223-large.mp4',
      poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
      suggestions: [
        'Used iPhone 15 Pro Max under 4500 AED',
        '2024 Toyota Hilux 4x4 Legend Auto',
        'Commercial Solar Inverter 8kW Sunsynk',
        'John Deere Tractor or Farming Equipment',
      ],
    },
    business: {
      title: `Verified African & Gulf Business Directory`,
      subtitle: `Discover reputable corporations, freight forwarders, banks, medical centers, and fine dining establishments.`,
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41589-large.mp4',
      poster: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1600&q=80',
      suggestions: [
        'Cross-border freight logistics SADC to Dubai',
        'Fine dining steakhouse in Rosebank',
        'Forex & international wire bureaus in Nairobi',
        'Accredited private healthcare clinic',
      ],
    },
    service: {
      title: `Accredited Tradespeople & Local Services`,
      subtitle: `Hire licensed plumbers, master electricians, solar engineers, builders, and emergency contractors with verified reviews.`,
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-craftsman-working-with-wood-42289-large.mp4',
      poster: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1600&q=80',
      suggestions: [
        'Emergency plumber burst geyser repair',
        'Certified master electrician COC certificate',
        'Solar backup inverter installation quote',
        'Waterproofing and roof repair contractor',
      ],
    },
    property: {
      title: `Premier Property & Real Estate Portal`,
      subtitle: `Houses for sale, luxury apartments to rent, commercial developments, and agricultural farmland across SADC & UAE.`,
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-residential-suburb-42037-large.mp4',
      poster: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      suggestions: [
        '4 bedroom villa in Sandton with solar & pool',
        'High floor 2 bed Dubai Marina with sea view',
        'Oceanfront Camps Bay Cape Town penthouse',
        'Commercial warehouse for lease in Gaborone',
      ],
    },
  };

  const currentHero = pillarHeroData[activePillar] || pillarHeroData.all;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[460px] md:min-h-[520px] flex items-center justify-center">
      {/* Background Video with Fallback Poster */}
      <video
        key={currentHero.videoSrc}
        autoPlay
        muted
        loop
        playsInline
        poster={currentHero.poster}
        className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105 transform motion-safe:transition-opacity duration-1000"
      >
        <source src={currentHero.videoSrc} type="video/mp4" />
      </video>

      {/* Atmospheric Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
      <div className="absolute inset-0 bg-radial-at-c from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
        {/* Country & Region Quick Switcher Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium mb-6 transition-colors shadow-lg cursor-pointer"
             onClick={onOpenCountryModal}>
          <span className="text-xl leading-none">{currentCountry.flag}</span>
          <span>Browsing: <strong>{currentCountry.name}</strong></span>
          <span className="font-mono text-amber-300 font-semibold">({currentCountry.subdomain}.marketplacehub.company)</span>
          <span className="text-slate-300">|</span>
          <span className="text-amber-400 underline underline-offset-2">Change Region</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          {currentHero.title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8 font-light">
          {currentHero.subtitle}
        </p>

        {/* AI-Powered Search Bar Container */}
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="p-2 sm:p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 flex flex-col sm:flex-row items-center gap-2 text-slate-900"
          >
            <div className="flex items-center gap-3 w-full px-3 py-1.5 flex-1">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 animate-pulse" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ask AI: e.g. 3 bedroom house in Sandton under R15k or solar electrician..."
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
              />
              {/* Voice Microphone Input */}
              <button
                type="button"
                onClick={onVoiceSearch}
                className={`p-2 rounded-xl transition-all ${
                  isTranscribing
                    ? 'bg-rose-500 text-white animate-bounce'
                    : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
                }`}
                title="Voice Search (Microphone speech-to-text)"
              >
                <Mic className="w-4 h-4 sm:w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenAISearch}
                className="px-3.5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>AI Chat</span>
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm sm:text-base transition-all shadow-md shadow-amber-600/30 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Predictive / Suggested Search Queries */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Trending AI Queries:</span>
            {currentHero.suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchInput(s);
                  onSearch(s);
                }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-slate-200 hover:text-white transition-all text-[11px] sm:text-xs"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>KYC Verified Vendors & Agents</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant PayPal, PayFast & Yoco Boosts</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>54 African Nations + SADC + UAE Subdomains</span>
          </div>
        </div>
      </div>
    </div>
  );
};
