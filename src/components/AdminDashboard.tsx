import React, { useState } from 'react';
import { 
  Globe, 
  Layers, 
  DollarSign, 
  ShieldAlert, 
  TrendingUp, 
  Check, 
  X, 
  AlertTriangle, 
  BarChart3, 
  Plus, 
  Edit, 
  Search,
  Sparkles,
  Users,
  ShieldCheck,
  SearchCode,
  FileCode,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  CreditCard,
  PieChart,
  BookOpen,
  Settings2,
  Trash2,
  Zap
} from 'lucide-react';
import { BoostPlan, Category, Country, Listing, Transaction, Order, LedgerEntry, CommissionRule, AdCampaign } from '../types';

interface AdminDashboardProps {
  countries: Country[];
  onToggleCountry: (countryId: string) => void;
  categories: Category[];
  onAddCategory: (category: Partial<Category>) => void;
  onUpdateCategory: (categoryId: string, updates: Partial<Category>) => void;
  boostPlans: BoostPlan[];
  onUpdateBoostPlan: (planId: string, updates: Partial<BoostPlan>) => void;
  listings: Listing[];
  onApproveListing: (listingId: string) => void;
  onRejectListing: (listingId: string) => void;
  transactions: Transaction[];
  orders: Order[];
  ledger: LedgerEntry[];
  commissionRules: CommissionRule[];
  onUpdateCommissionRule: (ruleId: string, updates: Partial<CommissionRule>) => void;
  ads: AdCampaign[];
  onUpdateAdCampaign: (adId: string, updates: Partial<AdCampaign>) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  countries,
  onToggleCountry,
  categories,
  onAddCategory,
  onUpdateCategory,
  boostPlans,
  onUpdateBoostPlan,
  listings,
  onApproveListing,
  onRejectListing,
  transactions,
  orders,
  ledger,
  commissionRules,
  onUpdateCommissionRule,
  ads,
  onUpdateAdCampaign,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'countries' | 'categories' | 'pricing' | 'moderation' | 'users' | 'seo' | 'ledger' | 'ads' | 'intelligence'>('overview');

  // Simulated vendor management state
  const [vendorsList, setVendorsList] = useState([
    {
      id: 'v1',
      name: 'Sandton Premier Properties & Services',
      email: 'vendor@sandtonpremier.co.za',
      country: 'South Africa (za)',
      kycStatus: 'verified',
      listingsCount: 14,
      boostSpend: 'R 2,450 ZAR',
      status: 'active',
    },
    {
      id: 'v2',
      name: 'Dubai Horizon Real Estate LLC',
      email: 'agents@dubaihorizon.ae',
      country: 'UAE (ae)',
      kycStatus: 'verified',
      listingsCount: 28,
      boostSpend: 'AED 4,800 AED',
      status: 'active',
    },
    {
      id: 'v3',
      name: 'Lagos FastTrack Courier & Logistics',
      email: 'ops@lagosfasttrack.ng',
      country: 'Nigeria (ng)',
      kycStatus: 'pending',
      listingsCount: 6,
      boostSpend: 'R 650 ZAR',
      status: 'active',
    },
    {
      id: 'v4',
      name: 'Nairobi Master Tech Repairs',
      email: 'contact@nairobitech.co.ke',
      country: 'Kenya (ke)',
      kycStatus: 'pending',
      listingsCount: 3,
      boostSpend: 'R 0 ZAR',
      status: 'active',
    },
  ]);

  // Moderation state
  const pendingModerationListings = listings.filter((l) => l.status === 'pending');

  // Revenue calculation across gateways (Boosts)
  const totalRevenueZAR = transactions
    .filter((t) => t.currency === 'ZAR')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRevenueAED = transactions
    .filter((t) => t.currency === 'AED')
    .reduce((sum, t) => sum + t.amount, 0);

  // Sales & Commission calculations (Marketplace)
  const totalSalesAmount = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalCommission = orders.reduce((sum, o) => sum + o.commissionAmount, 0);
  const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'delivered');

  const payFastCount = transactions.filter((t) => t.gateway === 'payfast').length;
  const yocoCount = transactions.filter((t) => t.gateway === 'yoco').length;
  const payPalCount = transactions.filter((t) => t.gateway === 'paypal').length;

  const handleApproveVendor = (vendorId: string) => {
    setVendorsList((prev) =>
      prev.map((v) => (v.id === vendorId ? { ...v, kycStatus: 'verified' } : v))
    );
  };

  const handleToggleVendorStatus = (vendorId: string) => {
    setVendorsList((prev) =>
      prev.map((v) =>
        v.id === vendorId ? { ...v, status: v.status === 'active' ? 'suspended' : 'active' } : v
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black">Marketplace Hub Master CMS</h1>
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-500 border-l-2 border-amber-600 pl-2">
              Super Admin Mode
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global management for 55 regional subdomains across Pan-Africa & UAE on marketplacehub.company
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Ecosystem Revenue</div>
            <div className="text-base font-black text-amber-400 font-mono">
              R {(totalRevenueZAR + totalCommission).toLocaleString()} ZAR • AED {totalRevenueAED.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-sm font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-3 transition-colors shrink-0 relative ${
            activeTab === 'overview' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Gateways & Financials
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-3 px-3 transition-colors shrink-0 relative flex items-center gap-1.5 ${
            activeTab === 'sales' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-500" />
          <span>Marketplace Sales ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 px-3 transition-colors shrink-0 relative flex items-center gap-1.5 ${
            activeTab === 'moderation' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Listing Moderation ({pendingModerationListings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-3 transition-colors shrink-0 relative flex items-center gap-1.5 ${
            activeTab === 'users' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-sky-500" />
          <span>Vendor & KYC Oversight ({vendorsList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('countries')}
          className={`pb-3 px-3 transition-colors shrink-0 relative flex items-center gap-1.5 ${
            activeTab === 'countries' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-500" />
          <span>Subdomains CMS ({countries.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 px-3 transition-colors shrink-0 relative ${
            activeTab === 'categories' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Categories Tree ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`pb-3 px-3 transition-colors shrink-0 relative ${
            activeTab === 'pricing' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Pricing & Commissions
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 px-3 transition-colors shrink-0 relative flex items-center gap-1.5 ${
            activeTab === 'ledger' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-slate-500" />
          <span>Financial Ledger</span>
        </button>
        <button
          onClick={() => setActiveTab('ads')}
          className={`pb-3 px-3 transition-colors shrink-0 relative flex items-center gap-1.5 ${
            activeTab === 'ads' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4 text-slate-500" />
          <span>Ad Campaigns</span>
        </button>
        <button
          onClick={() => setActiveTab('intelligence')}
          className={`pb-3 px-3 transition-colors shrink-0 relative flex items-center gap-1.5 ${
            activeTab === 'intelligence' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>Market Intelligence</span>
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`pb-3 px-3 transition-colors shrink-0 relative flex items-center gap-1.5 ${
            activeTab === 'seo' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <SearchCode className="w-4 h-4 text-indigo-500" />
          <span>SEO & Schemas</span>
        </button>
      </div>

      {/* TAB: MARKET INTELLIGENCE BI */}
      {activeTab === 'intelligence' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Top Category</div>
          <div className="text-lg font-black text-slate-900">Residential Property</div>
          <div className="text-[10px] text-emerald-600 font-black uppercase tracking-tight mt-1 border-l-2 border-emerald-500 pl-2">34% of Global Leads</div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Growth Region</div>
          <div className="text-lg font-black text-slate-900">UAE (Dubai)</div>
          <div className="text-[10px] text-emerald-600 font-black uppercase tracking-tight mt-1 border-l-2 border-emerald-500 pl-2">+124% YoY Volume</div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Lead Cost</div>
          <div className="text-lg font-black text-slate-900 tabular-nums">R 84.50 ZAR</div>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-tight mt-1 border-l-2 border-slate-300 pl-2">Boosted vs Standard</div>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Search Usage</div>
          <div className="text-lg font-black text-slate-900 tabular-nums">68,200 Queries</div>
          <div className="text-[10px] text-indigo-600 font-black uppercase tracking-tight mt-1 border-l-2 border-indigo-500 pl-2">82% Match Rate</div>
        </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Revenue by Pillar (30 Day Trend)</h3>
              <div className="h-64 flex items-end justify-between gap-2 px-2 pb-6">
                {[
                  { pillar: 'Prop', h: '90%', c: 'bg-amber-500' },
                  { pillar: 'Mot', h: '65%', c: 'bg-emerald-500' },
                  { pillar: 'Mkt', h: '85%', c: 'bg-sky-500' },
                  { pillar: 'Job', h: '40%', c: 'bg-rose-500' },
                  { pillar: 'Biz', h: '55%', c: 'bg-indigo-500' },
                  { pillar: 'Srv', h: '75%', c: 'bg-purple-500' },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className={`w-full ${item.c} rounded-t-lg transition-all group-hover:brightness-110`} style={{ height: item.h }}>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-bold pointer-events-none">
                        {item.h} Share
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase">{item.pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Real-time SADC Traffic</h3>
              <div className="space-y-3">
                {[
                  { country: 'South Africa', load: 85, trend: 'up' },
                  { country: 'UAE', load: 62, trend: 'up' },
                  { country: 'Nigeria', load: 45, trend: 'down' },
                  { country: 'Kenya', load: 38, trend: 'up' },
                  { country: 'Botswana', load: 24, trend: 'up' },
                ].map((row, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-bold text-slate-700">{row.country}</span>
                      <span className="font-mono text-slate-500">{row.load}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${row.load > 70 ? 'bg-amber-500' : 'bg-emerald-500'} rounded-full`} style={{ width: `${row.load}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
                <span className="text-slate-400 uppercase">System Status</span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                  All Nodes Healthy
                </span>
              </div>
            </div>
          </div>

          {/* Regional Performance Table */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Regional KPI Performance (All Subdomains)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="pb-3 px-2">Subdomain</th>
                    <th className="pb-3 px-2">Listings</th>
                    <th className="pb-3 px-2">Active Vendors</th>
                    <th className="pb-3 px-2">Conversion Rate</th>
                    <th className="pb-3 px-2 text-right">30D Revenue</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {[
                    { code: 'za', name: 'South Africa', count: 1240, vendors: 85, conv: '4.2%', rev: 'R 842k' },
                    { code: 'ae', name: 'UAE', count: 850, vendors: 62, conv: '5.8%', rev: 'AED 125k' },
                    { code: 'ng', name: 'Nigeria', count: 2100, vendors: 140, conv: '2.1%', rev: '₦ 4.8M' },
                    { code: 'ke', name: 'Kenya', count: 680, vendors: 45, conv: '3.5%', rev: 'KSh 1.2M' },
                    { code: 'bw', name: 'Botswana', count: 320, vendors: 22, conv: '4.9%', rev: 'P 185k' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 uppercase">{row.code}</span>
                          <span className="text-slate-500">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-600">{row.count}</td>
                      <td className="py-3 px-2 font-mono text-slate-600">{row.vendors}</td>
                      <td className="py-3 px-2">
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
                          {row.conv}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right font-black text-slate-900 tabular-nums">{row.rev}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: OVERVIEW & GATEWAY RECONCILIATION */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">PayFast Gateway (ZAR)</span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Active</span>
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                R {totalRevenueZAR.toLocaleString()} ZAR
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{payFastCount} Settlements</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform Commissions</span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Active</span>
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                R {totalCommission.toLocaleString()} ZAR
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">From {orders.length} Sales</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">PayPal International</span>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Active</span>
              </div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                AED {totalRevenueAED.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{payPalCount} Checkouts</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MARKETPLACE SALES */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Total Sales Volume</div>
              <div className="text-xl font-black text-slate-900 mt-1">R {totalSalesAmount.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Net Commission (Profit)</div>
              <div className="text-xl font-black text-emerald-600 mt-1">R {totalCommission.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Avg. Ticket Size</div>
              <div className="text-xl font-black text-slate-900 mt-1">R {(totalSalesAmount / (orders.length || 1)).toFixed(0)}</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase">Completion Rate</div>
              <div className="text-xl font-black text-amber-600 mt-1">{((completedOrders.length / (orders.length || 1)) * 100).toFixed(1)}%</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Listing</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Commission (15%)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="p-4 font-mono font-bold text-slate-600">{o.id}</td>
                    <td className="p-4 font-bold text-slate-900">{o.listingTitle}</td>
                    <td className="p-4 font-bold text-slate-900">R {o.amount.toLocaleString()}</td>
                    <td className="p-4 font-bold text-emerald-600">R {o.commissionAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 
                        o.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MODERATION QUEUE */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Listings Awaiting Moderation</h2>
            <span className="text-xs text-slate-500">AI Trust Scoring Active</span>
          </div>

          {pendingModerationListings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <div className="font-bold text-slate-800 text-sm">All Clean! No Pending Listings</div>
              <p className="text-xs text-slate-500">The automated AI pre-screen approved current safe postings.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingModerationListings.map((l) => (
                <div key={l.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={l.images[0]} alt={l.title} className="w-16 h-16 rounded-xl object-cover border" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{l.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {l.city} • Posted by <strong className="text-slate-700">{l.vendor.name}</strong>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                          AI Safety Score: 94% Legitimate
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onApproveListing(l.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Listing</span>
                    </button>
                    <button
                      onClick={() => onRejectListing(l.id)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject & Flag</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VENDOR & KYC OVERSIGHT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Registered Regional Vendors</h3>
              <p className="text-xs text-slate-500">Manage KYC identity verification and account statuses.</p>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
              {vendorsList.filter((v) => v.kycStatus === 'verified').length} / {vendorsList.length} Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Vendor Entity</th>
                  <th className="p-4">Region</th>
                  <th className="p-4">KYC Badge</th>
                  <th className="p-4">Listings</th>
                  <th className="p-4">Boost Spend</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {vendorsList.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{v.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{v.email}</div>
                    </td>
                    <td className="p-4 text-slate-600">{v.country}</td>
                    <td className="p-4">
                      {v.kycStatus === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[10px]">
                          <ShieldCheck className="w-3 h-3 text-sky-600" />
                          <span>Tier-1 Verified</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px]">
                          <span>Pending Review</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-800">{v.listingsCount}</td>
                    <td className="p-4 font-mono font-bold text-emerald-700">{v.boostSpend}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        v.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {v.kycStatus !== 'verified' && (
                          <button
                            onClick={() => handleApproveVendor(v.id)}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-[11px]"
                          >
                            Approve KYC
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleVendorStatus(v.id)}
                          className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                            v.status === 'active'
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {v.status === 'active' ? 'Suspend' : 'Reactivate'}
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

      {/* TAB 4: COUNTRIES & SUBDOMAINS CMS */}
      {activeTab === 'countries' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">CMS-Managed Regional Subdomains</h3>
              <p className="text-xs text-slate-500">Toggle active country portals, currencies, and languages dynamically without code deployments.</p>
            </div>
            <div className="text-xs font-mono text-slate-500">
              {countries.filter((c) => c.active).length} Active Subdomains
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="p-3">Country</th>
                  <th className="p-3">Subdomain</th>
                  <th className="p-3">Currency</th>
                  <th className="p-3">Region / Bloc</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {countries.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="p-3 flex items-center gap-2">
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span className="font-bold text-slate-900">{c.name}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-700">{c.subdomain}</td>
                    <td className="p-3 font-mono">
                      {c.currencyCode} ({c.currencySymbol})
                    </td>
                    <td className="p-3 text-slate-600">{c.region}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {c.active ? 'LIVE' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onToggleCountry(c.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          c.active
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {c.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CATEGORIES TREE */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Category & Vertical CMS</h2>
            <button
              onClick={() => onAddCategory({ name: 'New Category', pillar: 'marketplace', subcategories: [] })}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Master Category</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] uppercase font-mono">
                      {cat.pillar}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center gap-1">
                      <span>{sub}</span>
                      <button className="text-slate-300 hover:text-rose-500">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  <button className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold flex items-center gap-0.5">
                    <Plus className="w-2.5 h-2.5" />
                    <span>Add Sub</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: BOOST PRICING & COMMISSIONS */}
      {activeTab === 'pricing' && (
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Boost Tier Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {boostPlans.map((bp) => (
                <div key={bp.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 text-sm">{bp.title}</div>
                    <Edit className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-amber-600" />
                  </div>
                  <div className="text-xs text-slate-500">{bp.durationDays} Days Duration</div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">ZAR:</span>
                      <input type="number" defaultValue={bp.priceZAR} className="w-20 text-right bg-slate-50 border border-slate-100 rounded px-1 font-bold" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">AED:</span>
                      <input type="number" defaultValue={bp.priceAED} className="w-20 text-right bg-slate-50 border border-slate-100 rounded px-1 font-bold" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Category-Specific Commission Rules</h2>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>New Rule</span>
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Vertical / Category</th>
                    <th className="p-4">Commission Type</th>
                    <th className="p-4">Rate (%)</th>
                    <th className="p-4">Fixed Fee</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {commissionRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-50/60">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{rule.categoryName || 'Global Default'}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{rule.pillar}</div>
                      </td>
                      <td className="p-4 font-medium uppercase text-slate-600">{rule.ruleType}</td>
                      <td className="p-4 font-black text-slate-900">{(rule.percentage || 0) * 100}%</td>
                      <td className="p-4 font-mono text-slate-600">{rule.fixedFee || 0}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active</span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-amber-600">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: FINANCIAL LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Platform Financial Ledger</h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Type</th>
                  <th className="p-4">Ref ID</th>
                  <th className="p-4">Credit (+)</th>
                  <th className="p-4">Debit (-)</th>
                  <th className="p-4">Balance</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {ledger.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/60">
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                        entry.type === 'commission' ? 'bg-emerald-100 text-emerald-800' :
                        entry.type === 'boost_sale' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[10px]">{(entry.relatedId || '').substring(0, 12)}...</td>
                    <td className="p-4 font-bold text-emerald-600">{(entry.credit || 0) > 0 ? `+${(entry.credit || 0).toLocaleString()}` : '-'}</td>
                    <td className="p-4 font-bold text-rose-600">{(entry.debit || 0) > 0 ? `-${(entry.debit || 0).toLocaleString()}` : '-'}</td>
                    <td className="p-4 font-bold text-slate-900">{(entry.balance || 0).toLocaleString()}</td>
                    <td className="p-4 text-slate-600 font-sans text-[11px]">{entry.description || ''}</td>
                    <td className="p-4 text-slate-400 text-[10px]">{new Date(entry.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: AD CAMPAIGNS */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Sponsored Ad Campaigns</h2>
            <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Campaign</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                <div className="h-32 relative">
                  <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      ad.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                    }`}>
                      {ad.status}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="font-bold text-slate-900 text-sm mb-1">{ad.name}</div>
                  <div className="text-[11px] text-slate-500 mb-4 flex items-center gap-3">
                    <span>Target: {ad.targetCountry || 'Global'}</span>
                    <span>Placement: {ad.placement}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-2 bg-slate-50 rounded-lg text-center">
                      <div className="text-[10px] text-slate-400">Impressions</div>
                      <div className="text-xs font-bold text-slate-900">{ad.impressions.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg text-center">
                      <div className="text-[10px] text-slate-400">Clicks</div>
                      <div className="text-xs font-bold text-slate-900">{ad.clicks.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg text-center">
                      <div className="text-[10px] text-slate-400">CTR</div>
                      <div className="text-xs font-bold text-slate-900">{((ad.clicks / ad.impressions) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="text-[11px] text-slate-500">
                      Budget Spent: <strong className="text-slate-900">${ad.spent.toLocaleString()} / ${ad.budget.toLocaleString()}</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 text-slate-400 hover:text-amber-600">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SEO & SCHEMA.ORG MANAGEMENT */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Google Rich Results & Schema.org JSON-LD Configuration</h3>
            <p className="text-xs text-slate-500">
              Automatic structured metadata applied per listing type for Google Rich Snippets across African & UAE search indexes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-900 text-emerald-400 rounded-xl space-y-2">
                <div className="font-bold text-amber-400 font-sans">Marketplace: schema.org/Product</div>
                <pre className="text-[10px] overflow-x-auto text-slate-300">
{`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Listing Title",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "ZAR",
    "price": "14500"
  }
}`}
                </pre>
              </div>

              <div className="p-4 bg-slate-900 text-sky-400 rounded-xl space-y-2">
                <div className="font-bold text-sky-300 font-sans">Directory: schema.org/LocalBusiness</div>
                <pre className="text-[10px] overflow-x-auto text-slate-300">
{`{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Company Name",
  "address": {
    "addressCountry": "ZA",
    "addressLocality": "Johannesburg"
  }
}`}
                </pre>
              </div>

              <div className="p-4 bg-slate-900 text-amber-400 rounded-xl space-y-2">
                <div className="font-bold text-amber-300 font-sans">Property: schema.org/RealEstateListing</div>
                <pre className="text-[10px] overflow-x-auto text-slate-300">
{`{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "offers": {
    "priceCurrency": "AED",
    "price": "2400000"
  },
  "geo": { "lat": -26.1, "lng": 28.0 }
}`}
                </pre>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-slate-900">Dynamic XML Sitemap & Robots.txt</div>
              <div className="text-slate-500">Auto-routes crawlers for 55 country subdomains (e.g. za.marketplacehub.company/sitemap.xml).</div>
            </div>
            <button
              onClick={() => alert('Sitemap XML regenerated successfully across all 55 active country subdomains.')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
            >
              Rebuild Global Sitemap
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
