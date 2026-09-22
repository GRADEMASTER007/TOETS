import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Mic,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';
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
      title: 'Find what moves business forward.',
      subtitle: 'Marketplace Hub brings products, trusted businesses, local services and property into one beautiful regional discovery experience.',
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-modern-city-buildings-with-lights-at-night-42861-large.mp4',
      poster: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
      suggestions: ['3 bedroom house in Sandton under R15000', 'Certified solar installer near me', 'Dubai Marina waterfront apartment', 'Toyota Hilux 4x4 low mileage'],
    },
    marketplace: {
      title: 'Shop the region. Sell with confidence.',
      subtitle: 'Discover vehicles, gadgets, building materials, agricultural machinery and more from local vendors.',
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-and-showing-a-smartphone-41223-large.mp4',
      poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1800&q=85',
      suggestions: ['Used iPhone 15 Pro Max under 4500 AED', '2024 Toyota Hilux 4x4 Legend Auto', 'Commercial solar inverter 8kW', 'John Deere farming equipment'],
    },
    business: {
      title: 'Meet the businesses behind the region.',
      subtitle: 'A sharper way to find reputable corporations, logistics partners, healthcare providers, restaurants and more.',
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41589-large.mp4',
      poster: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1800&q=85',
      suggestions: ['Cross-border freight logistics SADC to Dubai', 'Fine dining steakhouse in Rosebank', 'Forex bureau in Nairobi', 'Accredited private healthcare clinic'],
    },
    service: {
      title: 'Get the right expert, right when you need them.',
      subtitle: 'Hire licensed tradespeople, solar engineers, builders and emergency contractors with verified reviews.',
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-craftsman-working-with-wood-42289-large.mp4',
      poster: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1800&q=85',
      suggestions: ['Emergency plumber burst geyser repair', 'Certified master electrician COC', 'Solar backup inverter installation', 'Waterproofing and roof repair'],
    },
    property: {
      title: 'Make your next move a better one.',
      subtitle: 'Explore homes, apartments, commercial developments and agricultural land across SADC and the UAE.',
      videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-residential-suburb-42037-large.mp4',
      poster: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85',
      suggestions: ['4 bedroom villa in Sandton with solar & pool', 'High floor 2 bed Dubai Marina', 'Oceanfront Camps Bay penthouse', 'Commercial warehouse in Gaborone'],
    },
  };

  const currentHero = pillarHeroData[activePillar] || pillarHeroData.all;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) onSearch(searchInput.trim());
  };

  return (
    <section className="hero-shell relative w-full overflow-hidden bg-slate-950 text-white">
      <video key={currentHero.videoSrc} autoPlay muted loop playsInline poster={currentHero.poster} className="absolute inset-0 h-full w-full object-cover opacity-40 scale-105 motion-safe:transition-opacity duration-1000">
        <source src={currentHero.videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(245,158,11,0.24),transparent_31%),linear-gradient(108deg,rgba(2,6,23,0.98)_12%,rgba(2,6,23,0.82)_54%,rgba(2,6,23,0.45)_100%)]" />
      <div className="absolute inset-0 opacity-30 hero-grid" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,1.1fr)_320px] md:py-20 lg:gap-20">
        <div>
          <button onClick={onOpenCountryModal} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white/90 backdrop-blur-md transition hover:bg-white/15">
            <span className="text-lg leading-none">{currentCountry.flag}</span>
            <span>Browsing {currentCountry.name}</span>
            <span className="font-mono text-amber-300">{currentCountry.subdomain}.marketplacehub.company</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-amber-300" />
          </button>

          <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
            <span className="h-px w-8 bg-amber-400" /> Marketplace Hub <span className="text-white/40">/</span> Business Directory
          </div>
          <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">{currentHero.title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{currentHero.subtitle}</p>

          <form onSubmit={handleSubmit} className="mt-8 max-w-3xl rounded-2xl border border-white/30 bg-white p-2 shadow-2xl shadow-black/30 sm:flex sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2">
              <Sparkles className="h-5 w-5 shrink-0 text-amber-500" />
              <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products, businesses, services or property" className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 sm:text-base" />
              <button type="button" onClick={onVoiceSearch} className={`rounded-xl p-2 transition ${isTranscribing ? 'bg-rose-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-100 hover:text-amber-600'}`} title="Voice search"><Mic className="h-5 w-5" /></button>
            </div>
            <div className="flex gap-2 border-t border-slate-100 pt-2 sm:border-0 sm:pt-0">
              <button type="button" onClick={onOpenAISearch} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-200 sm:flex-none"><Sparkles className="h-4 w-4 text-amber-600" /> AI Search</button>
              <button type="submit" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 active:scale-[.98] sm:flex-none"><Search className="h-4 w-4" /> Search</button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300"><span className="mr-1 font-semibold text-slate-400">Try:</span>{currentHero.suggestions.map((suggestion) => <button key={suggestion} onClick={() => { setSearchInput(suggestion); onSearch(suggestion); }} className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-left text-[11px] transition hover:border-amber-300/50 hover:bg-white/15 hover:text-white">{suggestion}</button>)}</div>
        </div>

        <div className="hero-visual-rail hidden md:block">
          <div className="hero-photo-card hero-photo-card-main" style={{ backgroundImage: `url(${currentHero.poster})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-5">
              <div className="flex items-center justify-between"><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-200 backdrop-blur">Live regional discovery</span><ArrowUpRight className="h-5 w-5 text-white/80" /></div>
              <div><p className="text-xs text-white/70">One hub. More ways to grow.</p><p className="mt-1 font-display text-2xl font-bold text-white">Built for the next move.</p></div>
            </div>
          </div>
          <div className="hero-stat-card -ml-8 mt-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><CheckCircle2 className="h-5 w-5" /></div><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trust layer</p><p className="text-sm font-extrabold text-slate-900">Verified vendors & listings</p></div></div>
          <div className="hero-stat-card ml-8 mt-3 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-amber-300"><Zap className="h-5 w-5" /></div><div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Built to convert</p><p className="text-sm font-extrabold text-slate-900">Secure boost checkout</p></div></div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-slate-950/35 backdrop-blur-sm"><div className="mx-auto flex max-w-7xl flex-wrap gap-x-8 gap-y-3 px-4 py-4 text-xs text-slate-300 sm:px-6"><span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> KYC-ready business profiles</span><span className="flex items-center gap-2"><Zap className="h-4 w-4 text-amber-400" /> PayFast, Yoco & PayPal-ready checkout</span><span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-sky-400" /> Africa + UAE regional reach</span><span className="ml-auto hidden items-center gap-2 font-semibold text-white/70 lg:flex">Explore the network <ArrowRight className="h-4 w-4 text-amber-300" /></span></div></div>
    </section>
  );
};
