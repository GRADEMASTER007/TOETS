import React, { useState } from 'react';
import { 
  X, 
  FileCode, 
  Database, 
  Map, 
  Layers, 
  Calendar, 
  CreditCard, 
  Cpu, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Server
} from 'lucide-react';

interface DeliverablesExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliverablesExplorerModal: React.FC<DeliverablesExplorerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sections = [
    { id: 1, title: '1. Recommended Tech Stack', icon: Server },
    { id: 2, title: '2. Complete Site Map', icon: Map },
    { id: 3, title: '3. Polymorphic Database Schema', icon: Database },
    { id: 4, title: '4. Wireframes & Layout Hierarchy', icon: Layers },
    { id: 5, title: '5. Phased Regional Rollout Roadmap', icon: Calendar },
    { id: 6, title: '6. Payment Gateways Production Code', icon: CreditCard },
    { id: 7, title: '7. AI & Vector Search Architecture', icon: Cpu },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Market Place Hub: Master Technical Deliverables</h2>
              <p className="text-xs text-slate-400">
                Architectural blueprint, SQL/NoSQL schemas, gateway integrations & regional rollout plan across 55 subdomains (marketplacehub.company)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none text-xs font-semibold">
          {sections.map((s) => {
            const Icon = s.icon;
            const isSel = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* SECTION 1: TECH STACK */}
          {activeSection === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                1. Full Recommended Tech Stack (Production Scale)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                To achieve high performance, SEO crawlability, sub-50ms regional edge latency across Africa and the Gulf, and robust security:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-700">
                    Frontend Layer
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    <li><strong>Framework:</strong> React 19 + Next.js App Router / Vite SSR for subpath + subdomain routing</li>
                    <li><strong>Styling:</strong> Tailwind CSS v4 with unified design system & fluid typography</li>
                    <li><strong>Motion:</strong> Motion library for fluid spring modals & transitions</li>
                    <li><strong>Icons:</strong> Lucide React for consistent icons</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-700">
                    Backend & Compute Layer
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    <li><strong>API Runtime:</strong> Node.js with Express / Fastify / Cloud Run Microservices</li>
                    <li><strong>Deployment:</strong> Google Cloud Run (Johannesburg <code>africa-south1</code> + Dubai <code>me-central2</code>)</li>
                    <li><strong>Edge Ingress:</strong> Cloudflare Enterprise / Google Cloud Armor for DDoS & multi-tenant SSL wildcards (<code>*.marketplacehub.company</code>)</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-sky-700">
                    Database & Storage
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    <li><strong>Primary DB:</strong> PostgreSQL 16 on Google Cloud SQL with PostGIS extension for geo-spatial radius queries</li>
                    <li><strong>Document & Cache:</strong> Redis Cloud / Firestore for real-time messaging & session state</li>
                    <li><strong>Media Storage:</strong> Google Cloud Storage / AWS S3 with Cloudflare Image Resizing</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-purple-700">
                    AI, Search & Gateways
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    <li><strong>AI Models:</strong> Gemini 3.5 Flash, Gemini 3.1 Pro (High Thinking), Gemini 3.5 Transcribe</li>
                    <li><strong>Vector Store:</strong> pgvector extension on Cloud SQL with text-embedding-004</li>
                    <li><strong>Gateways:</strong> PayFast (ZAR EFT/cards), Yoco (ZAR in-app cards), PayPal (Global/UAE AED/USD)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: SITE MAP */}
          {activeSection === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                2. Comprehensive Pan-African & UAE Site Map
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Structured hierarchy accommodating multi-country subdomains, regional geo-filtering, and the 4 core pillars:
              </p>

              <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto space-y-1 leading-relaxed">
                <pre>{`
/ (Global Landing Page & African Union + UAE Hub Selector)
├── [country-subdomain].marketplacehub.company (e.g. za.marketplacehub.company, ae.marketplacehub.company, ke.marketplacehub.company)
│   ├── /marketplace (Pillar 1: Consumer Goods, Vehicles, Industrial)
│   │   ├── /vehicles
│   │   ├── /electronics-gadgets
│   │   ├── /home-furniture
│   │   ├── /heavy-machinery-agriculture
│   │   └── /item/[slug-id] (Product detail, WhatsApp button, Offer, Reviews)
│   ├── /business-directory (Pillar 2: Registered Companies & B2B)
│   │   ├── /financial-legal
│   │   ├── /freight-logistics
│   │   ├── /medical-clinics
│   │   ├── /hospitality-dining
│   │   └── /company/[slug-id] (Branches, Operating hours, KYC verification, Map)
│   ├── /services-trades (Pillar 3: Certified Tradespeople & Pros)
│   │   ├── /plumbing
│   │   ├── /electrical-solar-coc
│   │   ├── /building-construction
│   │   ├── /automotive-repair
│   │   └── /contractor/[slug-id] (Licenses, Service radius, Quote form, Reviews)
│   ├── /property (Pillar 4: Real Estate Portal)
│   │   ├── /for-sale
│   │   │   ├── /houses
│   │   │   ├── /apartments
│   │   │   └── /commercial-industrial
│   │   ├── /to-rent
│   │   └── /listing/[slug-id] (Erf m², Beds, Virtual tour, Agent profile, Viewing booking)
│   ├── /search (AI Natural Language & Vector Semantic Search Engine)
│   ├── /post-listing (Multi-step wizard with category-specific polymorphic fields)
│   ├── /checkout (Unified gateway: PayPal, PayFast, Yoco with instant boost activation)
│   ├── /vendor/dashboard (Listing management, Views/impressions, Lead inbox, Invoices)
│   └── /admin (Regional country CMS, Category manager, Fraud queue, Revenue analytics)
`}</pre>
              </div>
            </div>
          )}

          {/* SECTION 3: DATABASE SCHEMA */}
          {activeSection === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  3. Polymorphic Database Schema (PostgreSQL DDL & PostGIS)
                </h3>
                <button
                  onClick={() => copyToClipboard(ddlContent, 'ddl')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {copiedKey === 'ddl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'ddl' ? 'Copied SQL' : 'Copy PostgreSQL DDL'}</span>
                </button>
              </div>
              <p className="text-slate-600 leading-relaxed">
                PostgreSQL schema utilizing polymorphic metadata JSONB structures, PostGIS geo-coordinates, and boost ranking indexing:
              </p>

              <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-2xl overflow-x-auto max-h-[400px]">
                <pre>{ddlContent}</pre>
              </div>
            </div>
          )}

          {/* SECTION 4: WIREFRAMES & COMPONENT HIERARCHY */}
          {activeSection === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                4. Wireframe Layouts & Component Hierarchy
              </h3>
              <p className="text-slate-600 leading-relaxed">
                The visual layout prioritizes instant utility, prominent search, clear trust badges, and frictionless WhatsApp contact:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Homepage & Portal Wireframe</h4>
                  <div className="space-y-2 text-xs font-mono text-slate-600">
                    <div className="p-2 bg-slate-200 rounded text-center">[Subdomain & Country Bar] za.marketplacehub.company | ZAR</div>
                    <div className="p-2 bg-slate-200 rounded text-center">[Header] Logo | 4 Pillars | Ask AI | Post Listing CTA</div>
                    <div className="p-4 bg-slate-300 rounded text-center font-bold">[Video Hero Banner + AI Natural Search Bar + Voice Mic]</div>
                    <div className="p-2 bg-amber-100 text-amber-900 rounded text-center">[VIP Spotlight Carousel] Top-Tier Boosted Listings</div>
                    <div className="p-4 bg-white rounded border border-slate-200 text-center">[4-Column Responsive Grid] Listing Cards with WhatsApp CTAs</div>
                    <div className="p-2 bg-slate-200 rounded text-center">[Footer & Regional Country Links]</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Component Architecture Tree</h4>
                  <div className="space-y-1.5 text-xs text-slate-600 font-mono">
                    <div>├── &lt;App /&gt; (Root state: country, currency, filters, auth)</div>
                    <div>│   ├── &lt;Header /&gt; (Subdomain switcher, 4 pillar tabs, nav)</div>
                    <div>│   ├── &lt;VideoHero /&gt; (Looping media, AI search, voice mic)</div>
                    <div>│   ├── &lt;ListingCard /&gt; (VIP ribbons, WhatsApp, currency conversion)</div>
                    <div>│   ├── &lt;ListingDetailModal /&gt; (Gallery, specs, reviews, vendor)</div>
                    <div>│   ├── &lt;BoostModal /&gt; (4 plans, PayFast/Yoco/PayPal unified checkout)</div>
                    <div>│   ├── &lt;AISearchModal /&gt; (Gemini multi-turn reasoning & TTS)</div>
                    <div>│   ├── &lt;PostListingWizard /&gt; (5-step category specific creation)</div>
                    <div>│   ├── &lt;VendorDashboard /&gt; (Listings, leads, invoices)</div>
                    <div>│   └── &lt;AdminDashboard /&gt; (Country CMS, fraud moderation, revenue)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: PHASED ROADMAP */}
          {activeSection === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                5. Step-by-Step Phased Regional Rollout Roadmap
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Strategic rollout prioritized by market liquidity, digital payment penetration, and trade corridors:
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs sm:text-sm">
                    <span className="text-amber-800">Phase 1 (Months 1–3): South Africa (Anchor Market)</span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded">Launch Target</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Deploy core platform on <code>za.marketplacehub.company</code>. Integrate PayFast & Yoco for instant EFT and card checkouts. Seed Sandton/Cape Town real estate, solar/electrical COC services, and vehicle trade.
                  </p>
                </div>

                <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs sm:text-sm">
                    <span className="text-sky-800">Phase 2 (Months 4–6): SADC Economic Bloc Expansion</span>
                    <span className="text-[10px] bg-sky-200 text-sky-900 px-2 py-0.5 rounded">Regional Scale</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Activate subdomains for Botswana (<code>bw</code>), Namibia (<code>na</code>), Zimbabwe (<code>zw</code>), Zambia (<code>zm</code>), and Mozambique (<code>mz</code>). Launch cross-border freight & logistics directory.
                  </p>
                </div>

                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs sm:text-sm">
                    <span className="text-purple-800">Phase 3 (Months 7–9): United Arab Emirates (UAE) Corridor</span>
                    <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded">Gulf Capital Flow</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Deploy <code>ae.marketplacehub.company</code> with AED currency and PayPal integration. Target Dubai/Abu Dhabi luxury real estate investors, commodity trade houses, and African diaspora entrepreneurs.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-xs sm:text-sm">
                    <span className="text-emerald-800">Phase 4 (Months 10–12): Pan-African Scale (East, West & North Africa)</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Full 54 Nations</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Activate Kenya (<code>ke</code>), Nigeria (<code>ng</code>), Ghana (<code>gh</code>), Egypt (<code>eg</code>), Rwanda (<code>rw</code>). Integrate local mobile money (M-Pesa, Flutterwave, Paystack) alongside PayPal.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: GATEWAY INTEGRATION CODE */}
          {activeSection === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  6. Production Payment Gateway Integration Code (PayFast, Yoco, PayPal)
                </h3>
                <button
                  onClick={() => copyToClipboard(gatewayCodeSnippet, 'gw')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  {copiedKey === 'gw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'gw' ? 'Copied Gateway Code' : 'Copy Integration Code'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto max-h-[400px]">
                <pre>{gatewayCodeSnippet}</pre>
              </div>
            </div>
          )}

          {/* SECTION 7: AI EMBEDDINGS & VECTOR SEARCH */}
          {activeSection === 7 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                7. AI Natural-Language & Vector Semantic Search Architecture
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Combines dense vector retrieval (Gemini <code>text-embedding-004</code>) with generative intent extraction:
              </p>

              <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-2xl overflow-x-auto space-y-2">
                <div className="text-amber-400 font-bold">// 1. Generation of Vector Embedding on Listing Creation</div>
                <pre>{`
const embeddingResponse = await ai.models.embedContent({
  model: 'text-embedding-004',
  contents: \`\${listing.title}. Category: \${listing.categoryName}. Specs: \${JSON.stringify(listing.propertyDetails || listing.serviceDetails)}. City: \${listing.city}\`,
});
const vector = embeddingResponse.embedding.values; // 768-dimensional float array
`}</pre>

                <div className="text-amber-400 font-bold mt-4">// 2. PostgreSQL pgvector Cosine Similarity Query</div>
                <pre>{`
SELECT id, title, price, (embedding <=> $1) AS cosine_distance
FROM listings
WHERE country_code = $2 AND status = 'active'
ORDER BY 
  featured_tier_rank DESC, 
  cosine_distance ASC
LIMIT 20;
`}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ddlContent = `
-- PostgreSQL DDL for Pan-African & UAE Commerce Platform
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Countries & Subdomains
CREATE TABLE countries (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    iso_code VARCHAR(3) NOT NULL UNIQUE,
    subdomain VARCHAR(50) NOT NULL UNIQUE,
    currency_code VARCHAR(5) NOT NULL,
    currency_symbol VARCHAR(5) NOT NULL,
    flag_emoji VARCHAR(10) NOT NULL,
    exchange_rate_to_usd NUMERIC(12, 4) NOT NULL,
    region VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Vendors & Profiles
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp_number VARCHAR(50) NOT NULL,
    country_id VARCHAR(10) REFERENCES countries(id),
    kyc_verified BOOLEAN DEFAULT FALSE,
    kyc_tier INT DEFAULT 1,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Polymorphic Listings Table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    country_code VARCHAR(3) NOT NULL,
    pillar VARCHAR(20) NOT NULL CHECK (pillar IN ('marketplace', 'business', 'service', 'property')),
    category_id VARCHAR(50) NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(15, 2) NOT NULL DEFAULT 0,
    currency_code VARCHAR(5) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region_area VARCHAR(100) NOT NULL,
    address TEXT,
    location_geom GEOMETRY(Point, 4326),
    images TEXT[] NOT NULL DEFAULT '{}',
    
    -- Polymorphic Details JSONB
    pillar_metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Monetization & Boost Fields
    featured_tier VARCHAR(20) DEFAULT 'free' CHECK (featured_tier IN ('free', 'week', 'month', 'three_months')),
    featured_tier_rank INT DEFAULT 0,
    boost_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Status & Moderation
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'expired', 'flagged')),
    ai_moderation_score NUMERIC(4, 3) DEFAULT 1.0,
    
    -- Metrics
    views_count INT DEFAULT 0,
    leads_count INT DEFAULT 0,
    
    -- Vector Semantic Search
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Transactions & Boost Invoices
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    gateway VARCHAR(30) NOT NULL CHECK (gateway IN ('paypal', 'payfast', 'yoco')),
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    gateway_reference VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(5) NOT NULL,
    plan_id VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for lightning fast regional sorting
CREATE INDEX idx_listings_country_pillar ON listings(country_code, pillar, status);
CREATE INDEX idx_listings_boost_rank ON listings(featured_tier_rank DESC, created_at DESC);
CREATE INDEX idx_listings_geom ON listings USING GIST(location_geom);
`;

const gatewayCodeSnippet = `
// Production Gateway Handlers for PayFast & PayPal (ALL-FIREBASE)
import crypto from 'crypto';

// 1. PAYFAST (South Africa ZAR Instant EFT & Cards)
// Merchant ID: 11071120 | Merchant Key: p6fi9ewdjk1js | Passphrase: abCd15ab92g1233bc1223
export function generatePayFastSignature(
  data: Record<string, string>,
  passPhrase: string = process.env.PAYFAST_PASSPHRASE || 'abCd15ab92g1233bc1223'
) {
  let pfOutput = '';
  for (let key in data) {
    if (data.hasOwnProperty(key) && String(data[key]).trim() !== '' && key !== 'signature') {
      pfOutput += \`\${key}=\${encodeURIComponent(String(data[key]).trim()).replace(/%20/g, '+')}&\`;
    }
  }
  let getString = pfOutput.slice(0, -1);
  if (passPhrase) {
    getString += \`&passphrase=\${encodeURIComponent(passPhrase.trim()).replace(/%20/g, '+')}\`;
  }
  return crypto.createHash('md5').update(getString).digest('hex');
}

// 2. PAYPAL (Global, USD, AED, Diaspora - App: ALL-FIREBASE)
// Client ID: BAAk0DorZSaDyTQbbltBVp4mGPBPrPkVrHSdMGy4BBXgB8jhpzZdlEY9PZ24lsfPZGD6Ki6NPyGqjyGePc
export async function createPayPalOrder(
  clientId: string = process.env.PAYPAL_CLIENT_ID || 'BAAk0DorZSaDyTQbbltBVp4mGPBPrPkVrHSdMGy4BBXgB8jhpzZdlEY9PZ24lsfPZGD6Ki6NPyGqjyGePc',
  clientSecret: string = process.env.PAYPAL_CLIENT_SECRET || 'EKfkUyx3qKyhX3VcZvxHZeGl1TJH0pIORvr2hBMzplRkzwC2B_-JU_fYbZkKDMlxWQRMcFwi2kEYhXpu',
  amount: number,
  currency: string = 'USD'
) {
  const auth = Buffer.from(\`\${clientId}:\${clientSecret}\`).toString('base64');
  const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: { 'Authorization': \`Basic \${auth}\`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  const { access_token } = await tokenRes.json();

  const orderRes = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${access_token}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: currency, value: amount.toFixed(2) } }]
    })
  });
  return await orderRes.json();
}
`;
