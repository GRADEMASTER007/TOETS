import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X } from 'lucide-react';

interface CookieBannerProps {
  onOpenLegal?: () => void;
  onOpenPrivacy?: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenLegal, onOpenPrivacy }) => {
  const [accepted, setAccepted] = useState(true);
  const handleOpenInfo = onOpenPrivacy || onOpenLegal || (() => {});

  useEffect(() => {
    const isConsentGiven = localStorage.getItem('mph_cookie_consent') || localStorage.getItem('afritrade_cookie_consent');
    if (!isConsentGiven) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('mph_cookie_consent', 'true');
    localStorage.setItem('afritrade_cookie_consent', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-40 max-w-lg bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-2">
          <div className="font-bold text-sm text-slate-100 flex items-center justify-between">
            <span>POPIA & GDPR Cookie Notice</span>
            <button 
              onClick={() => setAccepted(true)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            We use localized regional cookies to store your preferred country subdomain, currency format, and saved favorites across African Union member states and the UAE.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAccept}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept Cookies</span>
            </button>
            <button
              onClick={handleOpenInfo}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
