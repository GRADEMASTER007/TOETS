import React from 'react';
import { 
  ShieldCheck, 
  Globe, 
  ExternalLink, 
  Lock, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  FileText,
  CreditCard
} from 'lucide-react';
import { FOOTER_SECTIONS } from '../data/legalPagesData';
import { Country } from '../types';

interface FooterProps {
  countries: Country[];
  currentCountry: Country;
  onSelectCountry: (country: Country) => void;
  onOpenLegalPage: (slug: string) => void;
  onOpenPostListing: () => void;
  onOpenDeliverables: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  countries,
  currentCountry,
  onSelectCountry,
  onOpenLegalPage,
  onOpenPostListing,
  onOpenDeliverables,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Brand & Mission Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tighter text-white font-display">
                Market Place Hub
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              The premier cross-border commercial nexus connecting 54 African countries and the United Arab Emirates across Marketplace Deals, Verified Business Directory, Accredited Service Artisans, and Prime Real Estate.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenLegalPage('/facebook-data-deletion')}
              className="px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-300 hover:bg-blue-900/60 text-xs flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Facebook Deletion</span>
            </button>
            <button
              onClick={() => onOpenLegalPage('/tiktok-data-deletion')}
              className="px-3 py-1.5 rounded-lg bg-pink-950/60 border border-pink-800/60 text-pink-300 hover:bg-pink-900/60 text-xs flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
              <span>TikTok Deletion</span>
            </button>
            <button
              onClick={onOpenPostListing}
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shadow-sm"
            >
              Post a Listing
            </button>
          </div>
        </div>

        {/* 6-Column Legal & Compliance Links Grid (Recommended Structure) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {FOOTER_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-200 border-b border-slate-800/80 pb-1.5">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      onClick={(e) => {
                        e.preventDefault();
                        onOpenLegalPage(link.path);
                      }}
                      className="text-slate-400 hover:text-amber-400 transition-colors block text-[11px] leading-tight"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Subdomain Directory: 54 African Countries & UAE */}
        <div className="pt-8 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              <span>Regional Subdomain Directory (54 African Nations &amp; UAE):</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">55 Active Geographic Portals</span>
          </div>
          <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-[11px]">
            {countries.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCountry(c);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`hover:text-amber-400 transition-colors flex items-center gap-1 ${
                  c.id === currentCountry.id ? 'text-amber-400 font-bold underline' : 'text-slate-500'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                <span className="text-[9px] text-slate-600 font-mono">({c.subdomain}.marketplacehub.company)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Compliance Badges & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>
              © 2026 <strong>Market Place Hub</strong> (marketplacehub.company). All rights reserved. SADC, AfCFTA &amp; UAE Gateway.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <button
              onClick={() => onOpenLegalPage('/privacy-rights')}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>POPIA &amp; UAE Decree 45 Compliant</span>
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegalPage('/security')}
              className="hover:text-amber-400 transition-colors"
            >
              PCI-DSS Level 1 Encrypted
            </button>
            <span>•</span>
            <button
              onClick={onOpenDeliverables}
              className="text-amber-400 hover:underline font-semibold"
            >
              System Specs
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">PayFast EFT</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">Yoco 3DS</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">PayPal Global</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
