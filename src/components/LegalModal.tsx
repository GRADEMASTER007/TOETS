import React, { useState } from 'react';
import { X, Shield, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'popia';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'popia',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'popia'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Market Place Hub Legal & Regulatory Framework</h2>
              <p className="text-xs text-slate-400">POPIA Act 4 of 2013, GDPR & UAE Data Protection Compliance (marketplacehub.company)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('popia')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'popia'
                ? 'border-amber-600 text-amber-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>POPIA & GDPR Compliance</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'privacy'
                ? 'border-amber-600 text-amber-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'terms'
                ? 'border-amber-600 text-amber-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'popia' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Protection of Personal Information Act (POPIA) & Cross-Border Data Flow</h3>
              <p>
                Market Place Hub (marketplacehub.company) adheres strictly to South Africa's Protection of Personal Information Act (POPIA No. 4 of 2013) and UAE Federal Decree-Law No. 45 of 2021 regarding Personal Data Protection.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>Key Principles Applied:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>Accountability:</strong> We protect all buyer and vendor contact information collected through listing inquiries.</li>
                  <li><strong>Processing Limitation:</strong> Phone and WhatsApp numbers are only disclosed upon buyer consent or verified business listing opt-in.</li>
                  <li><strong>Security Safeguards:</strong> In-platform communications, KYC identity documents, and payment gateway tokens are encrypted in transit and at rest.</li>
                  <li><strong>Cross-Border Data Transfers:</strong> Data transmitted between SADC member states, UAE, and Pan-African hubs complies with Section 72 of POPIA.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Global Privacy Policy</h3>
              <p>
                We do not sell personal data to third parties. Information collected (e.g. email, WhatsApp phone, listing details, IP geolocation) is strictly used to deliver localized marketplace, business, service, and property discovery across African countries and the UAE.
              </p>
              <p>
                <strong>Payment Information:</strong> Financial transactions are processed directly by certified Payment Card Industry (PCI-DSS) compliant gateways: PayFast, Yoco, and PayPal. Market Place Hub never stores full credit card numbers or banking credentials.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Listing & Platform Terms of Service</h3>
              <p>
                1. <strong>Authenticity:</strong> All vendors must provide truthful descriptions, accurate pricing, and valid contact details.
              </p>
              <p>
                2. <strong>Prohibited Content:</strong> Counterfeit goods, unlicensed medical supplies, predatory financial schemes, and illegal trade are strictly banned. Our automated AI moderation system immediately flags and removes violating postings.
              </p>
              <p>
                3. <strong>Boost Placements:</strong> Paid ranking boosts (1 Week, 1 Month, 3 Months) grant priority algorithmic and visual placement but do not waive moderation obligations.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
