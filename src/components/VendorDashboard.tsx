import React, { useState } from 'react';
import { 
  PlusCircle, 
  Zap, 
  Eye, 
  MessageSquare, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  Trash2, 
  Edit, 
  Download, 
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Crown,
  Share2,
  Check,
  Send,
  Upload,
  Sparkles,
  Users
} from 'lucide-react';
import { Country, Listing, Transaction } from '../types';
import { formatPrice } from '../utils/currency';

interface VendorDashboardProps {
  currentCountry: Country;
  listings: Listing[];
  transactions: Transaction[];
  onOpenPostListing: () => void;
  onOpenBoostModal: (listing: Listing) => void;
  onDeleteListing: (listingId: string) => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  currentCountry,
  listings,
  transactions,
  onOpenPostListing,
  onOpenBoostModal,
  onDeleteListing,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'leads' | 'transactions' | 'membership' | 'referral'>('listings');
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [kycUploaded, setKycUploaded] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [repliedMap, setRepliedMap] = useState<Record<string, string[]>>({});

  // Simulated vendor inquiries/leads
  const [leads, setLeads] = useState([
    {
      id: 'lead-1',
      buyerName: 'David Nkosi',
      listingTitle: '4 Bedroom Modern Architectural Home in Sandton',
      date: '2026-09-21 14:32',
      message: 'Hi, I would like to arrange a private viewing this Saturday afternoon. Is that possible?',
      status: 'unread',
      phone: '+27 83 999 1234',
    },
    {
      id: 'lead-2',
      buyerName: 'Fatima Al-Mansoor',
      listingTitle: 'Luxury 2-Bedroom Apartment in Dubai Marina',
      date: '2026-09-20 09:15',
      message: 'Can you provide the title deed copy and confirm if short-term holiday letting is approved by HOA?',
      status: 'replied',
      phone: '+971 50 123 4567',
    },
    {
      id: 'lead-3',
      buyerName: 'Sipho Zulu',
      listingTitle: 'Emergency Master Electrician & Solar COC Certificate',
      date: '2026-09-19 18:40',
      message: 'Need a COC inspection for a residential property transfer in Randburg ASAP.',
      status: 'replied',
      phone: '+27 72 444 8888',
    },
  ]);

  const handleSendLeadReply = (leadId: string) => {
    const text = replyTextMap[leadId]?.trim();
    if (!text) return;
    setRepliedMap((prev) => ({
      ...prev,
      [leadId]: [...(prev[leadId] || []), text],
    }));
    setReplyTextMap((prev) => ({ ...prev, [leadId]: '' }));
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: 'replied' } : l))
    );
  };

  const totalViews = listings.reduce((acc, l) => acc + l.views, 0);
  const totalLeads = listings.reduce((acc, l) => acc + l.leadsCount, 0) + leads.length;
  const activeBoostsCount = listings.filter((l) => l.featuredTier !== 'free').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner with Profile & KYC Status */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl font-black">
            VD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black">Sandton Premier Properties & Services</h1>
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{kycUploaded ? 'KYC Tier-1 Verified' : 'KYC Verified'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Regional Vendor ID: <span className="font-mono text-slate-300">ZA-VND-8821</span> • Registered on {currentCountry.name} Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setKycModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>KYC Verification</span>
          </button>
          <button
            onClick={onOpenPostListing}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Listing</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Active Listings</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{listings.length}</div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Across 4 Core Pillars</span>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Paid Boosts</div>
          <div className="text-2xl font-black text-amber-600 mt-1 font-mono">{activeBoostsCount}</div>
          <div className="text-xs text-amber-700 font-medium mt-1">Priority AI & Top Placement</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Impressions / Views</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{totalViews.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Last 30 Days</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Leads & Inquiries</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{totalLeads}</div>
          <div className="text-xs text-sky-600 font-medium mt-1">WhatsApp & Direct In-App</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-sm font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-3 transition-colors shrink-0 relative ${
            activeTab === 'listings' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          My Listings ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 px-3 transition-colors shrink-0 relative ${
            activeTab === 'leads' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Inquiries & Leads ({leads.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 px-3 transition-colors shrink-0 relative ${
            activeTab === 'transactions' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Billing & Invoices ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('membership')}
          className={`pb-3 px-3 transition-colors shrink-0 relative flex items-center gap-1.5 ${
            activeTab === 'membership' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-500" />
          <span>Membership Tiers</span>
        </button>
        <button
          onClick={() => setActiveTab('referral')}
          className={`pb-3 px-3 transition-colors shrink-0 relative flex items-center gap-1.5 ${
            activeTab === 'referral' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4 text-emerald-500" />
          <span>Referral Program</span>
        </button>
      </div>

      {/* TAB 1: LISTINGS TABLE */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Listing</th>
                  <th className="p-4">Pillar</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status & Boost</th>
                  <th className="p-4">Stats</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={l.images[0]}
                          alt={l.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-slate-900 truncate">{l.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{l.city}, {l.regionArea || l.region || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {l.pillar}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 font-mono">
                      {formatPrice(l.price, currentCountry.currencyCode, currentCountry.currencySymbol)}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase w-fit">
                          {l.status}
                        </span>
                        {l.featuredTier !== 'free' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-bold">
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{l.featuredTier.replace('_', ' ').toUpperCase()}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Standard Rank</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-600">
                      <div>{l.views} views</div>
                      <div className="text-slate-400 text-[11px]">{l.leadsCount} leads</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenBoostModal(l)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold flex items-center gap-1 transition-colors"
                          title="Boost Listing"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                          <span>Boost</span>
                        </button>
                        <button
                          onClick={() => onDeleteListing(l.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRIES & LEADS WITH DIRECT REPLY THREAD */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{lead.buyerName}</span>
                  <span className="text-slate-400">({lead.phone})</span>
                  {lead.status === 'unread' ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      New Inquiry
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px]">
                      Replied • Read Receipt
                    </span>
                  )}
                </div>
                <div className="text-slate-400">{lead.date}</div>
              </div>

              <div className="text-xs text-slate-500">
                Interested in: <strong className="text-slate-800">{lead.listingTitle}</strong>
              </div>

              <p className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
                "{lead.message}"
              </p>

              {/* Threaded In-App Replies */}
              {repliedMap[lead.id] && repliedMap[lead.id].length > 0 && (
                <div className="space-y-2 pt-1 pl-4 border-l-2 border-amber-300">
                  {repliedMap[lead.id].map((reply, idx) => (
                    <div key={idx} className="p-2.5 bg-amber-50/60 rounded-xl text-xs text-slate-800 border border-amber-200/60">
                      <div className="font-bold text-[10px] text-amber-900 mb-0.5">Your In-Platform Response:</div>
                      <div>{reply}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Controls */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2 items-center justify-between">
                <div className="flex-1 w-full flex gap-2">
                  <input
                    type="text"
                    value={replyTextMap[lead.id] || ''}
                    onChange={(e) =>
                      setReplyTextMap({ ...replyTextMap, [lead.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendLeadReply(lead.id);
                    }}
                    placeholder={`Type quick response to ${lead.buyerName}...`}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    onClick={() => handleSendLeadReply(lead.id)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>

                <a
                  href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: BILLING & INVOICES */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Invoice No</th>
                  <th className="p-4">Item / Plan</th>
                  <th className="p-4">Gateway</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{tx.invoiceNumber}</td>
                    <td className="p-4 font-sans text-slate-700">{tx.planTitle}</td>
                    <td className="p-4 uppercase text-slate-600 font-semibold">{tx.gateway}</td>
                    <td className="p-4 font-bold text-slate-900">{tx.currency} {tx.amount}</td>
                    <td className="p-4 text-slate-500">{tx.date}</td>
                    <td className="p-4 font-sans">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          const content = `AFRITRADE INVOICE: ${tx.invoiceNumber}\nListing: ${tx.listingTitle}\nAmount: ${tx.currency} ${tx.amount}\nGateway: ${tx.gateway}\nStatus: ${tx.status}`;
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${tx.invoiceNumber}.txt`;
                          a.click();
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Download Invoice"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MEMBERSHIP TIERS */}
      {activeTab === 'membership' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-black text-slate-900">Vendor Membership Plans</h2>
            <p className="text-xs text-slate-500">
              Upgrade your vendor allowance across South Africa, SADC, and UAE regional hubs with reduced boost fees and dedicated priority AI matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Basic Plan */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter</span>
                <div className="text-2xl font-black text-slate-900">Free Tier</div>
                <p className="text-xs text-slate-500">For individual sellers and casual classified postings.</p>
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Up to 3 Active Listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Standard Search Indexing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Community Support</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs" disabled>
                Current Active Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-6 bg-amber-50/50 rounded-3xl border-2 border-amber-500 shadow-md flex flex-col justify-between space-y-4 relative">
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                Most Popular
              </span>
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Professional</span>
                <div className="text-2xl font-black text-slate-900">
                  {currentCountry.currencySymbol} 499 <span className="text-xs font-normal text-slate-500">/month</span>
                </div>
                <p className="text-xs text-slate-600">For established trades, agencies, and regional dealerships.</p>
                <div className="pt-3 border-t border-amber-200/60 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Up to 35 Active Listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>2 Free Monthly 1-Week Boosts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Verified KYC Blue Shield</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Direct WhatsApp & Call Button</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => alert(`Upgrading to Pro Membership. Checkout redirected via PayFast / Yoco.`)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-98"
              >
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise / Premium */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enterprise</span>
                <div className="text-2xl font-black text-slate-900">
                  {currentCountry.currencySymbol} 1,299 <span className="text-xs font-normal text-slate-500">/month</span>
                </div>
                <p className="text-xs text-slate-500">For multi-country franchises, property developers, and logistics hubs.</p>
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Unlimited Listings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>5 Free Monthly 1-Month Boosts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Priority AI Search Ranking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Dedicated Key Account Manager</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => alert(`Upgrading to Enterprise Membership. Contacting key accounts team.`)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
              >
                Upgrade to Enterprise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REFERRAL PROGRAM */}
      {activeTab === 'referral' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-black text-slate-900">Vendor Referral Program</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Invite fellow contractors, business owners, or property agents to join AfriTrade & UAE Portal.
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-right">
              <div className="text-[10px] text-emerald-700 font-bold uppercase">Earned Boost Credit</div>
              <div className="text-xl font-black text-emerald-900 font-mono">R 450.00 ZAR</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Unique Referral Link</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://afritrade.com/join?ref=ZA-VND-8821"
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://afritrade.com/join?ref=ZA-VND-8821');
                    setCopiedRef(true);
                    setTimeout(() => setCopiedRef(false), 2000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0"
                >
                  {copiedRef ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Share this link on WhatsApp groups or industry forums. For each approved vendor who registers and lists, you receive <strong>R150 Boost Credit</strong> automatically applied to your invoice ledger.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Referred Vendors (3)</h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Cape Solars & Inverters</div>
                    <div className="text-[10px] text-slate-400">Joined 2 days ago • Verified</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    +R150 Credit
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">Gauteng Auto Removals</div>
                    <div className="text-[10px] text-slate-400">Joined 1 week ago • Active</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    +R150 Credit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KYC Upload Dialog Modal */}
      {kycModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Vendor KYC Verification</h3>
                <p className="text-xs text-slate-500">Upload business or identity documents for the verified blue shield badge.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company / Trading Name</label>
                <input
                  type="text"
                  defaultValue="Sandton Premier Properties & Services (Pty) Ltd"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">CIPC / Trade License Number</label>
                <input
                  type="text"
                  defaultValue="2022/948302/07"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 font-mono"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2 bg-slate-50/50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <div className="text-slate-600 font-medium">Attach ID or Registration PDF</div>
                <div className="text-[10px] text-slate-400">Supported: PDF, JPG, PNG up to 10MB</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setKycModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setKycUploaded(true);
                  setKycModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
              >
                Submit Documents
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
