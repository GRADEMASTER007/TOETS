import React, { useState } from 'react';
import { X, Search, Globe, Check, ArrowRight } from 'lucide-react';
import { Country } from '../types';

interface CountrySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  countries: Country[];
  currentCountry: Country;
  onSelectCountry: (country: Country) => void;
}

export const CountrySelectorModal: React.FC<CountrySelectorModalProps> = ({
  isOpen,
  onClose,
  countries,
  currentCountry,
  onSelectCountry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  if (!isOpen) return null;

  const regions = ['All', 'SADC', 'UAE', 'East Africa', 'West Africa', 'North Africa', 'Central Africa'];

  const filteredCountries = countries.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.currencyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.isoCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;

    return matchesSearch && matchesRegion && c.active;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Select Country / Subdomain</h2>
              <p className="text-xs text-slate-500">
                Browse localized listings and prices across all 54 African countries, SADC bloc & UAE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Subdomain Indicator */}
        <div className="px-5 py-3 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span>Currently Active:</span>
            <span className="text-base">{currentCountry.flag}</span>
            <strong className="text-slate-900">{currentCountry.name}</strong>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-900 font-semibold">
              {currentCountry.subdomain}.marketplacehub.company
            </span>
          </div>
          <div className="text-slate-600 font-medium hidden sm:block">
            Base Currency: <strong className="text-slate-900">{currentCountry.currencyCode} ({currentCountry.currencySymbol})</strong>
          </div>
        </div>

        {/* Search & Region Filter Bar */}
        <div className="p-5 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by country name, currency (ZAR, AED, NGN), or subdomain..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedRegion === reg
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Countries Grid */}
        <div className="p-5 overflow-y-auto max-h-[50vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredCountries.map((c) => {
            const isSelected = c.id === currentCountry.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCountry(c);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between group ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-amber-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl leading-none">{c.flag}</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{c.name}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-amber-600 stroke-[3]" />
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {c.subdomain}.marketplacehub.company
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                        {c.currencyCode} ({c.currencySymbol})
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {c.region}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all mt-1" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Showing <strong>{filteredCountries.length}</strong> active regional hubs (All AU Member States + SADC Bloc + UAE).
          </span>
          <span className="text-slate-400">
            Selection will be preserved on your return visits via local session.
          </span>
        </div>
      </div>
    </div>
  );
};
