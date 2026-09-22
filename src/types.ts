export type PillarType = 'marketplace' | 'business' | 'service' | 'property';

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
}

export interface Category {
  id: string;
  name: string;
  pillar: PillarType;
  iconName: string;
  subcategories: string[];
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
  featuredTier: 'free' | 'week' | 'month' | 'three_months';
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
    propertyType: 'House' | 'Apartment' | 'Townhouse' | 'Commercial' | 'Plot' | 'Farm' | 'Development';
    listingType: 'sale' | 'rent';
    virtualTourUrl?: string;
  };
  marketplaceDetails?: {
    condition: 'Brand New' | 'Like New' | 'Used - Good' | 'Refurbished';
    negotiable: boolean;
    warranty: boolean;
    brand?: string;
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
  };
}

export interface BoostPlan {
  id: 'free' | 'week' | 'month' | 'three_months';
  title: string;
  durationDays: number;
  priceUSD: number;
  priceZAR: number;
  priceAED: number;
  badgeLabel: string;
  badgeColor: string;
  benefits: string[];
  priorityScore: number;
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
  model: 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';
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
