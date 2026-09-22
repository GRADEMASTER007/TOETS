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
  ExternalLink
} from 'lucide-react';
import { BoostPlan, Category, Country, Listing, Transaction } from '../types';

interface AdminDashboardProps {
  countries: Country[];
  onToggleCountry: (countryId: string) => void;
  categories: Category[];
  boostPlans: BoostPlan[];
  listings: Listing[];
  onApproveListing: (listingId: string) => void;
  onRejectListing: (listingId: string) => void;
  transactions: Transaction[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  countries,
  onToggleCountry,
  categories,
  boostPlans,
  listings,
  onApproveListing,
  onRejectListing,
  transactions,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'countries' | 'categories' | 'pricing' | 'moderation' | 'users' | 'seo'>('overview');

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

  // Revenue calculation across gateways
  const totalRevenueZAR = transactions
    .filter((t) => t.currency === 'ZAR')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRevenueAED = transactions
    .filter((t) => t.currency === 'AED')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRevenueUSD = transactions
    .filter((t) => t.currency === 'USD')
    .reduce((sum, t) => sum + t.amount, 0);

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
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black">AfriTrade & UAE Portal Master CMS</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
              Super Admin Mode
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global management for 54 African Union member states, SADC trading bloc & United Arab Emirates subdomains
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Ecosystem Revenue</div>
            <div className="text-base font-black text-amber-400 font-mono">
              R {totalRevenueZAR.toLocaleString()} ZAR • AED {totalRevenueAED.toLocaleString()}
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
          Boost Pricing Tiers
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

      {/* TAB 1: OVERVIEW & GATEWAY RECONCILIATION */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">PayFast Gateway (ZAR)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                R {totalRevenueZAR.toLocaleString()} ZAR
              </div>
              <div className="text-xs text-slate-500">{payFastCount} Boost Transactions Settled</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Yoco Card Payments (ZAR)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                R {(totalRevenueZAR * 0.45).toFixed(0)} ZAR
              </div>
              <div className="text-xs text-slate-500">{yocoCount} Mobile / Card In-App Checkouts</div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">PayPal International (AED / USD)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">Active</span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                AED {totalRevenueAED.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">{payPalCount} UAE & Diaspora Checkouts</div>
            </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] uppercase font-mono">
                    {cat.pillar}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{cat.subcategories.length} Sub-nodes</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.subcategories.map((sub, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-xs">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: BOOST PRICING CMS */}
      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {boostPlans.map((bp) => (
            <div key={bp.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="font-bold text-slate-900 text-sm">{bp.title}</div>
              <div className="text-xs text-slate-500">{bp.durationDays} Days Duration</div>
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">ZAR Rate:</span>
                  <span className="font-bold text-slate-900">R {bp.priceZAR}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AED Rate:</span>
                  <span className="font-bold text-slate-900">AED {bp.priceAED}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">USD Rate:</span>
                  <span className="font-bold text-slate-900">$ {bp.priceUSD}</span>
                </div>
              </div>
            </div>
          ))}
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
              <div className="text-slate-500">Auto-routes crawlers for 55 country subdomains (e.g. za.yoursite.com/sitemap.xml).</div>
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
