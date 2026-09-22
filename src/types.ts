export type UserRole = 'buyer' | 'seller' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  phoneNumber?: string;
  sellerRating?: number;
  commissionRate?: number; // e.g. 0.05 for 5%
  lastLogin: string;
  memberSince: string;
}

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  currency: string;
  commissionAmount: number;
  sellerEarnings: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
  paymentType: 'platform' | 'private';
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceStats {
  totalSales: number;
  totalCommission: number;
  totalOrders: number;
  totalUsers: number;
  totalListings: number;
  salesByDay: { date: string; amount: number }[];
}

export type PillarType = 'marketplace' | 'business' | 'service' | 'property' | 'motors' | 'jobs' | 'opportunities' | 'business_services' | 'advertising';

export interface MotorDetails {
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'Gas';
  transmission: 'Automatic' | 'Manual';
  bodyType: string;
  engineSize?: string;
  condition: 'New' | 'Used' | 'Classic';
  vin?: string;
  registrationNumber?: string;
  serviceHistory: boolean;
  dealerId?: string;
  financeAvailable: boolean;
  tradeInAvailable: boolean;
}

export interface JobDetails {
  company: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  salaryRange?: string;
  requirements: string[];
  benefits: string[];
  applicationUrl?: string;
  remote: boolean;
}

export interface Country {
  id: string;
  name: string;
  isoCode: string;
  subdomain: string;
  currencyCode: string;
  currencySymbol: string;
  flag: string;
  region: 'SADC' | 'East Africa' | 'West Africa' | 'North Africa' | 'Central Africa' | 'UAE';
  defaultLanguage: string;
  active: boolean;
  exchangeRateToUSD: number; // 1 USD = X Local Currency
  exchangeRateToZAR: number; // 1 ZAR = X Local Currency
  taxRate?: number; // e.g. 0.15 for 15%
}

export interface Category {
  id: string;
  name: string;
  pillar: PillarType;
  iconName: string;
  subcategories: string[];
  active?: boolean;
}

export interface ListingVendor {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  avatar: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  responseRate: string;
  memberSince: string;
}

export interface Listing {
  id: string;
  title: string;
  slug: string;
  pillar: PillarType;
  countryCode: string;
  city: string;
  regionArea: string;
  region?: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
  categoryId: string;
  categoryName: string;
  subcategory: string;
  price: number; // in listing's native currency
  currencyCode: string;
  description: string;
  images: string[];
  featuredTier: 'free' | 'bump' | 'week' | 'month' | 'three_months';
  featuredExpiry?: string;
  featuredDaysLeft?: number;
  verifiedVendor: boolean;
  vendor: ListingVendor;
  datePosted: string;
  status: 'active' | 'pending' | 'paused' | 'sold';
  views: number;
  saves: number;
  leadsCount: number;
  // Pillar specific attributes
  propertyDetails?: {
    bedrooms?: number;
    bathrooms?: number;
    erfSizeM2?: number;
    parkingSpaces?: number;
    petFriendly?: boolean;
    furnished?: boolean;
    amenities?: string[];
    propertyType: 'House' | 'Apartment' | 'Townhouse' | 'Commercial' | 'Plot' | 'Farm' | 'Development';
    listingType: 'sale' | 'rent';
    virtualTourUrl?: string;
    floorPlanUrl?: string;
  };
  marketplaceDetails?: {
    condition: 'Brand New' | 'Like New' | 'Used - Good' | 'Refurbished';
    negotiable: boolean;
    warranty: boolean;
    brand?: string;
    allowPlatformCheckout?: boolean;
  };
  serviceDetails?: {
    experienceYears: number;
    serviceAreaRadiusKm: number;
    startingRate: number;
    availability: 'Immediate' | 'Same Day' | 'Next Day' | 'By Appointment';
    licenses: string[];
    quoteEnabled: boolean;
  };
  businessDetails?: {
    openingHours: string;
    website?: string;
    foundedYear?: number;
    employeeCount?: string;
    branches?: string[];
    industry?: string;
  };
  motorDetails?: MotorDetails;
  jobDetails?: JobDetails;
  priceHistory?: PriceHistoryPoint[];
}

export interface PriceHistoryPoint {
  date: string; // ISO string e.g. "2026-06-15"
  price: number;
  note?: string; // e.g. "Initial Listing", "Price Reduced (-8%)"
  event?: 'initial' | 'drop' | 'increase' | 'promo';
}

export interface BoostPlan {
  id: 'free' | 'bump' | 'week' | 'month' | 'three_months';
  title: string;
  durationDays: number;
  priceUSD: number;
  priceZAR: number;
  priceAED: number;
  badgeLabel: string;
  badgeColor: string;
  benefits: string[];
  priorityScore: number;
  isQuickBump?: boolean;
}

export type PaymentGateway = 'paypal' | 'payfast' | 'yoco';

export interface Transaction {
  id: string;
  listingId: string;
  listingTitle: string;
  vendorId: string;
  gateway: PaymentGateway;
  amount: number;
  currency: string;
  planId: string;
  planTitle: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  invoiceNumber: string;
  reference: string;
}

export interface Review {
  id: string;
  listingId: string;
  authorName: string;
  authorLocation: string;
  rating: number;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'buyer' | 'vendor' | 'ai';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface MessageThread {
  id: string;
  listingId: string;
  listingTitle: string;
  vendorId: string;
  buyerName: string;
  buyerEmail: string;
  buyerWhatsapp: string;
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
  messages: ChatMessage[];
}

export interface AISearchState {
  isSearching: boolean;
  query: string;
  model: 'gemini-3.8-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';
  thinkingEnabled: boolean;
  searchGrounding: boolean;
  results: {
    matchedListingIds: string[];
    summary: string;
    parsedFilters?: {
      pillar?: PillarType;
      category?: string;
      city?: string;
      maxPrice?: number;
      minPrice?: number;
      countryCode?: string;
    };
    groundingSources?: { title: string; url: string }[];
  } | null;
}

export interface SavedSearchAlert {
  id: string;
  userId?: string;
  name: string;
  query: string;
  pillar: PillarType | 'all';
  category?: string;
  city?: string;
  countryId: string;
  maxPrice?: number;
  frequency: 'instant' | 'daily' | 'weekly';
  emailEnabled: boolean;
  pushEnabled: boolean;
  matchCount: number;
  createdAt: string;
  lastNotifiedAt?: string;
  // Specific Price Drop Tracking fields
  alertType?: 'search' | 'price_drop';
  listingId?: string;
  initialPrice?: number;
  targetPrice?: number;
  listingSlug?: string;
  listingImage?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  instantLeadAlerts: boolean;
  dailyDigest: boolean;
  priceDropAlerts: boolean;
  weeklyMarketReports: boolean;
  securityAlerts: boolean;
}

export interface ReferralProfile {
  code: string;
  referralLink: string;
  totalReferred: number;
  activeVendors: number;
  earnedBoostCredits: number; // e.g. R 450 ZAR
  currency: string;
}

export interface Lead {
  id: string;
  listingId: string;
  sellerId: string;
  buyerId?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
  type: 'quote' | 'viewing' | 'callback' | 'finance' | 'general';
  createdAt: string;
}

export interface CommissionRule {
  id: string;
  countryId?: string;
  pillar: PillarType | 'all';
  categoryId?: string;
  categoryName?: string;
  sellerType?: 'individual' | 'business' | 'all';
  ruleType?: 'percentage' | 'fixed' | 'hybrid';
  percentage?: number; // 0.08 for 8%
  fixedFee?: number;
  minFee?: number;
  maxFee?: number;
  isActive?: boolean;
  active?: boolean; // legacy support
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  pillar: PillarType | 'all';
  priceMonthly: number;
  currency: string;
  listingLimit: number;
  features: string[];
  reducedCommission?: number;
}

export interface LedgerEntry {
  id: string;
  transactionId?: string;
  relatedId?: string;
  userId?: string;
  type: 'sale' | 'payout' | 'refund' | 'boost' | 'subscription' | 'ad_revenue' | 'boost_sale' | 'commission';
  amount?: number;
  credit?: number;
  debit?: number;
  balance?: number;
  currency?: string;
  commission?: number;
  tax?: number;
  netAmount?: number;
  description?: string;
  status?: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface AdCampaign {
  id: string;
  advertiserId: string;
  name: string;
  type: 'banner' | 'sponsored_listing' | 'sponsored_business';
  placement: 'homepage' | 'category' | 'search';
  targetCountry?: string;
  targetPillar?: PillarType;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  status: 'active' | 'paused' | 'completed' | 'draft';
  imageUrl?: string;
  linkUrl: string;
}
