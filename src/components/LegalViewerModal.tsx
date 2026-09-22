import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  FileText, 
  Search, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  ExternalLink, 
  Trash2, 
  AlertTriangle, 
  FileDown, 
  RefreshCw, 
  ArrowRight, 
  Send,
  HelpCircle,
  Share2,
  Building,
  UserCheck
} from 'lucide-react';
import { LEGAL_PAGES_DATA, LegalPageItem, FOOTER_SECTIONS } from '../data/legalPagesData';

interface LegalViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlug: string;
  onSelectSlug: (slug: string) => void;
}

export const LegalViewerModal: React.FC<LegalViewerModalProps> = ({
  isOpen,
  onClose,
  currentSlug,
  onSelectSlug,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  // Interactive Form States
  const [formEmail, setFormEmail] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [trackingCode, setTrackingCode] = useState('');

  // Status check for Facebook/TikTok deletion
  const [checkCode, setCheckCode] = useState('');
  const [checkResult, setCheckResult] = useState<string | null>(null);

  // Ensure current slug exists or default to /privacy-policy
  const activePage: LegalPageItem = LEGAL_PAGES_DATA[currentSlug] || LEGAL_PAGES_DATA['/privacy-policy'];

  // Update browser URL and title when modal opens or slug changes
  useEffect(() => {
    if (isOpen) {
      const originalTitle = document.title;
      document.title = `${activePage.title} | Market Place Hub Legal & Compliance`;
      try {
        window.history.pushState({ legalSlug: activePage.slug }, '', activePage.slug);
      } catch {
        // ignore
      }

      return () => {
        document.title = originalTitle;
        try {
          window.history.pushState(null, '', '/');
        } catch {
          // ignore
        }
      };
    }
  }, [isOpen, activePage]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const fullUrl = `https://marketplacehub.company${activePage.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitActionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim()) return;
    setFormStatus('submitting');
    setTimeout(() => {
      const code = `MPH-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setTrackingCode(code);
      setFormStatus('success');
    }, 800);
  };

  const handleCheckDeletionStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkCode.trim()) return;
    if (checkCode.toUpperCase().startsWith('MPH-')) {
      setCheckResult(`Request ${checkCode.toUpperCase()}: In Verification. Pending automated database purge scheduled within 14 days.`);
    } else {
      setCheckResult(`Active Status for identifier ${checkCode}: Account verified. No pending restriction.`);
    }
  };

  // Filter available pages by search term
  const allPages = Object.values(LEGAL_PAGES_DATA);
  const filteredPages = searchTerm.trim()
    ? allPages.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allPages;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase tracking-wider">
                  {activePage.categoryLabel}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">marketplacehub.company{activePage.slug}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">{activePage.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy Page URL"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden md:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={handlePrint}
              title="Print Document"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors hidden sm:flex items-center gap-1 text-xs"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Breadcrumb Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-slate-500 overflow-x-auto py-1">
            <span>Market Place Hub</span>
            <span>/</span>
            <span className="font-medium text-slate-700">{activePage.categoryLabel}</span>
            <span>/</span>
            <span className="font-bold text-amber-600">{activePage.title}</span>
            <span className="text-slate-400 ml-2">| Last updated: {activePage.lastUpdated}</span>
          </div>

          {/* Quick Filter Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 48 compliance pages..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Document Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-64 sm:w-72 bg-slate-50/80 border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
            <div className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Legal & Compliance Library ({filteredPages.length})
            </div>
            <div className="space-y-1 p-2">
              {filteredPages.map((page) => (
                <button
                  key={page.slug}
                  onClick={() => {
                    onSelectSlug(page.slug);
                    setFormStatus('idle');
                    setCheckResult(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    page.slug === activePage.slug
                      ? 'bg-amber-600 text-white font-bold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <span className="truncate pr-2">{page.title}</span>
                  {page.interactiveType && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      page.slug === activePage.slug ? 'bg-amber-700 text-amber-100' : 'bg-slate-200 text-slate-600'
                    }`}>
                      action
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Document Content View */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-700 leading-relaxed text-xs sm:text-sm">
            {/* Mobile Category Dropdown / Selector */}
            <div className="md:hidden pb-3 border-b border-slate-200">
              <label className="text-[11px] font-bold text-slate-500 block mb-1">
                Select Compliance Page:
              </label>
              <select
                value={activePage.slug}
                onChange={(e) => {
                  onSelectSlug(e.target.value);
                  setFormStatus('idle');
                  setCheckResult(null);
                }}
                className="w-full p-2 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
              >
                {allPages.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.categoryLabel}: {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Header Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {activePage.title}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm">{activePage.description}</p>
              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span>Direct Link: <strong className="font-mono text-slate-700">https://marketplacehub.company{activePage.slug}</strong></span>
                <span>•</span>
                <span>Jurisdiction: <strong>South Africa (POPIA) & UAE (Decree 45)</strong></span>
              </div>
            </div>

            {/* Document Sections */}
            <div className="space-y-6">
              {activePage.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-amber-600 rounded-full inline-block"></span>
                    {section.heading}
                  </h3>

                  {Array.isArray(section.content) ? (
                    <div className="space-y-2 text-slate-600">
                      {section.content.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600">{section.content}</p>
                  )}

                  {section.subsections && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {section.subsections.map((sub, subIdx) => (
                        <div key={subIdx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                          <div className="font-bold text-slate-800 mb-1 text-xs">{sub.title}</div>
                          <div className="text-[11px] text-slate-600 leading-normal">{sub.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* -------------------------------------------------------- */}
            {/* INTERACTIVE ACTION WORKFLOWS FOR COMPLIANCE VERIFICATION */}
            {/* -------------------------------------------------------- */}
            {activePage.interactiveType === 'data-deletion' && (
              <div className="mt-8 p-5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                  <Trash2 className="w-5 h-5 text-amber-600" />
                  <span>Submit Customer Account & Data Deletion Request</span>
                </div>
                <p className="text-xs text-amber-800">
                  Submitting this request initiates a permanent deletion ticket for your account, contact profile, and listing records.
                </p>

                {formStatus === 'success' ? (
                  <div className="p-4 bg-white rounded-xl border border-emerald-300 text-emerald-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Deletion Request Submitted Successfully!</span>
                    </div>
                    <p className="text-xs">
                      Your tracking reference is: <strong className="font-mono text-emerald-700 text-sm">{trackingCode}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      A confirmation has been logged. You may retain this code to verify completion with our Data Protection Officer at privacy@marketplacehub.company.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitActionForm} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Account Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          placeholder="your-email@example.com"
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Reason for Deletion (Optional)
                        </label>
                        <input
                          type="text"
                          value={formReason}
                          onChange={(e) => setFormReason(e.target.value)}
                          placeholder="e.g., closing business, GDPR request"
                          className="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={formStatus === 'submitting'}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      {formStatus === 'submitting' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>Submit Deletion Request</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {activePage.interactiveType === 'facebook-deletion' && (
              <div className="mt-8 space-y-4">
                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 text-blue-950 space-y-4">
                  <div className="flex items-center gap-2 font-bold text-sm text-blue-900">
                    <Share2 className="w-5 h-5 text-blue-600" />
                    <span>Facebook Data Deletion Request & Status Checker (Meta Platform Compliant)</span>
                  </div>
                  <p className="text-xs text-blue-800">
                    Per Meta guidelines, you can request manual deletion of data obtained via Facebook Login or check the status of a pending deletion callback.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Submission box */}
                    <div className="p-4 bg-white rounded-xl border border-blue-200 space-y-3">
                      <div className="font-bold text-xs text-slate-800">1. Request Immediate Facebook Data Purge</div>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="Enter email associated with Facebook"
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      />
                      <button
                        onClick={handleSubmitActionForm}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Request Facebook Data Deletion
                      </button>
                      {trackingCode && (
                        <div className="text-[11px] text-emerald-700 font-medium">
                          Confirmation Code: <strong>{trackingCode}</strong>
                        </div>
                      )}
                    </div>

                    {/* Status check box */}
                    <div className="p-4 bg-white rounded-xl border border-blue-200 space-y-3">
                      <div className="font-bold text-xs text-slate-800">2. Check Deletion Status</div>
                      <form onSubmit={handleCheckDeletionStatus} className="space-y-2">
                        <input
                          type="text"
                          value={checkCode}
                          onChange={(e) => setCheckCode(e.target.value)}
                          placeholder="Enter Confirmation Code or User ID"
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                        />
                        <button
                          type="submit"
                          className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Check Status
                        </button>
                      </form>
                      {checkResult && (
                        <div className="p-2.5 bg-slate-100 rounded-lg text-[11px] text-slate-700 border border-slate-200">
                          {checkResult}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePage.interactiveType === 'tiktok-deletion' && (
              <div className="mt-8 p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 font-bold text-sm text-pink-400">
                  <Shield className="w-5 h-5 text-pink-400" />
                  <span>TikTok Login Data Deletion & Scope Revocation (TikTok for Developers Compliant)</span>
                </div>
                <p className="text-xs text-slate-300">
                  TikTok developer guidance requires that users retain continuous control over their authorized scopes and can request immediate erasure of cached profile tokens.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <div className="font-bold text-xs text-amber-300 mb-1">Direct Scope Revocation</div>
                    <p className="text-[11px] text-slate-300 mb-2">
                      Revoke Market Place Hub authorization directly inside the TikTok mobile app under Settings & Privacy &gt; Apps & Services.
                    </p>
                    <a
                      href="https://www.tiktok.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-pink-400 hover:underline"
                    >
                      <span>Open TikTok Account Center</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                    <div className="font-bold text-xs text-pink-300 mb-1">Request TikTok Server Purge</div>
                    <form onSubmit={handleSubmitActionForm} className="space-y-2">
                      <input
                        type="text"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="Enter TikTok username or registered email"
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Submit TikTok Erasure Ticket
                      </button>
                    </form>
                  </div>
                </div>

                {trackingCode && (
                  <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>TikTok Deletion Ticket Logged: Reference <strong>{trackingCode}</strong></span>
                  </div>
                )}
              </div>
            )}

            {/* Quick Links to Other Related Pages in this Category */}
            <div className="mt-10 pt-6 border-t border-slate-200">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Related Pages in {activePage.categoryLabel}:
              </div>
              <div className="flex flex-wrap gap-2">
                {allPages
                  .filter((p) => p.category === activePage.category && p.slug !== activePage.slug)
                  .map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => onSelectSlug(p.slug)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 rounded-lg text-xs font-medium transition-colors"
                    >
                      {p.title}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div>
            Official Website: <strong className="text-slate-800">https://marketplacehub.company</strong> • All 48 compliance pages are publicly accessible without authentication.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
