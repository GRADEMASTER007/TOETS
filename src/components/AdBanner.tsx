import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { AdCampaign } from '../types';

interface AdBannerProps {
  ads: AdCampaign[];
  currentCountryCode: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ ads, currentCountryCode }) => {
  // Filter ads for the current country or global
  const activeAds = ads.filter(
    ad => ad.status === 'active' && 
    (ad.targetCountry === currentCountryCode || !ad.targetCountry) &&
    ad.placement === 'homepage'
  );

  if (activeAds.length === 0) return null;

  // For now just show the first active ad
  const ad = activeAds[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-8">
      <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden group shadow-xl border border-slate-200">
        <img 
          src={ad.imageUrl} 
          alt={ad.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
        
        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-center max-w-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 border-l-2 border-amber-500 pl-2">
              <Sparkles className="w-3 h-3" />
              <span>Sponsored</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white mb-2 leading-tight drop-shadow-md">
            {ad.name}
          </h2>
          <p className="text-sm text-slate-200 mb-6 font-medium line-clamp-2">
            Experience the future of trade across the Africa-UAE corridor. Click to learn more.
          </p>
          <a 
            href={ad.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg"
          >
            <span>Visit Advertiser</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
