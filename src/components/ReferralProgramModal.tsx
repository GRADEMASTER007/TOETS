import React, { useState } from 'react';
import { 
  X, 
  Gift, 
  Share2, 
  Copy, 
  Check, 
  Users, 
  Award, 
  DollarSign, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  MessageCircle,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Country } from '../types';

interface ReferralProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCountry: Country;
  currentUser: any;
  onOpenBoostModal?: () => void;
}

export const ReferralProgramModal: React.FC<ReferralProgramModalProps> = ({
  isOpen,
  onClose,
  currentCountry,
  currentUser,
  onOpenBoostModal,
}) => {
  const [copied, setCopied] = useState(false);
  const referralCode = currentUser?.uid ? `MPH-${currentUser.uid.slice(0, 6).toUpperCase()}` : 'MPH-AFRI88';
  const referralLink = `https://marketplacehub.company/register?ref=${referralCode}`;

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Join Market Place Hub to post your products, company profile, trades services, or property listings across 54 African countries and the UAE! Use my invite code ${referralCode} to get 1 Month Free Featured Boost: ${referralLink}`;

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md text-amber-300 flex items-center justify-center border border-white/20">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Partner &amp; Vendor Growth Program
              </div>
              <h2 className="text-xl font-black text-white">Invite Vendors, Earn Boost Credits</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Credit balance card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center space-y-1">
              <div className="text-[11px] font-bold text-amber-800 uppercase">Available Boost Credits</div>
              <div className="text-2xl font-black text-amber-950">
                {currentCountry.currencySymbol} 450 <span className="text-xs font-semibold">{currentCountry.currencyCode}</span>
              </div>
              <div className="text-[10px] text-amber-700">Valid for Featured Boosts</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Vendors Invited</div>
              <div className="text-2xl font-black text-slate-900">8</div>
              <div className="text-[10px] text-slate-500">Cross-Border Artisans &amp; Shops</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase">Active Listings Generated</div>
              <div className="text-2xl font-black text-emerald-600">14</div>
              <div className="text-[10px] text-emerald-700">Earned 100% Commission</div>
            </div>
          </div>

          {/* How it works */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">How the Vendor Referral Program Works:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">1</div>
                <div className="font-bold text-slate-900">Share Your Link</div>
                <p className="text-[11px] text-slate-600">Send your personalized invite link or code to businesses, contractors, or property agents.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">2</div>
                <div className="font-bold text-slate-900">Vendor Registers</div>
                <p className="text-[11px] text-slate-600">They receive 20% off their first Featured Boost plan across any of the 55 regional subdomains.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">3</div>
                <div className="font-bold text-slate-900">Earn Boost Credits</div>
                <p className="text-[11px] text-slate-600">You automatically receive credit in your account to boost your own listings for free!</p>
              </div>
            </div>
          </div>

          {/* Referral Link Copy Area */}
          <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3">
            <div className="text-xs font-bold text-slate-300">Your Unique Referral Link:</div>
            <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl border border-slate-700">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="bg-transparent text-xs text-amber-300 font-mono flex-1 outline-none px-2"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>

            {/* Quick Social Share */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400">Quick Share:</span>
              <button
                onClick={shareOnWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={shareOnTwitter}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>Twitter / X</span>
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500">Credits never expire and apply to all 55 country portals.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
