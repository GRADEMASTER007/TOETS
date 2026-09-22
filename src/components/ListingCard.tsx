import React from 'react';
import { MapPin, Star, ShieldCheck, Heart, MessageCircle, Sparkles, Bed, Bath, Maximize2, Tag, Gauge, Calendar, Zap, Briefcase } from 'lucide-react';
import { Country, Listing } from '../types';
import { formatPrice, convertPrice } from '../utils/currency';

interface ListingCardProps {
  listing: Listing;
  currentCountry: Country;
  sourceCountry: Country;
  onSelect: (listing: Listing) => void;
  isSaved: boolean;
  onToggleSave: (listingId: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  currentCountry,
  sourceCountry,
  onSelect,
  isSaved,
  onToggleSave,
}) => {
  // Convert price if current country differs from listing's native country
  const displayPrice = convertPrice(listing.price, sourceCountry, currentCountry);

  const getBoostBadge = () => {
    switch (listing.featuredTier) {
      case 'three_months':
        return (
          <span className="px-2.5 py-1 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>VIP Spotlight</span>
          </span>
        );
      case 'month':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] tracking-wide uppercase shadow-sm">
            Featured 30D
          </span>
        );
      case 'week':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] tracking-wide uppercase shadow-sm">
            Featured
          </span>
        );
      default:
        return null;
    }
  };

  const openWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hi ${listing.vendor.name}, I am interested in your listing "${listing.title}" on Market Place Hub (${currentCountry.subdomain}.marketplacehub.company). Is it still available?`
    );
    window.open(`https://wa.me/${listing.vendor.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelect(listing)}
      className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer relative"
    >
      {/* Image Thumbnail Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured Ribbon Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {getBoostBadge()}
          <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold uppercase tracking-wider">
            {listing.pillar}
          </span>
        </div>

        {/* Save / Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(listing.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
            isSaved
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
          title={isSaved ? 'Remove from favorites' : 'Save listing'}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white shadow-lg">
          <div className="font-extrabold text-sm sm:text-base tabular-nums">
            {formatPrice(displayPrice, currentCountry.currencyCode, currentCountry.currencySymbol)}
          </div>
          {currentCountry.id !== sourceCountry.id && listing.price > 0 && (
            <div className="text-[10px] text-slate-300 tabular-nums">
              Orig: {listing.currencyCode} {listing.price.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Location */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold text-slate-900 uppercase tracking-wider">
              {listing.categoryName}
            </span>
            <div className="flex items-center gap-1 text-slate-500 text-[11px] truncate max-w-[130px]">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{listing.city}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
            {listing.title}
          </h3>

          {/* Pillar-Specific Key Specs Preview */}
          {listing.pillar === 'property' && listing.propertyDetails && (
            <div className="flex items-center gap-3 text-xs text-slate-600 py-1.5 border-y border-slate-100 my-2">
              {listing.propertyDetails.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-slate-400" />
                  <span>{listing.propertyDetails.bedrooms} Beds</span>
                </div>
              )}
              {listing.propertyDetails.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span>{listing.propertyDetails.bathrooms} Baths</span>
                </div>
              )}
              {listing.propertyDetails.erfSizeM2 && (
                <div className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{listing.propertyDetails.erfSizeM2} m²</span>
                </div>
              )}
            </div>
          )}

          {listing.pillar === 'service' && listing.serviceDetails && (
            <div className="flex items-center justify-between text-xs text-slate-600 py-1.5 border-y border-slate-100 my-2">
              <span>{listing.serviceDetails.experienceYears} Years Exp</span>
              <span className="text-emerald-700 font-bold uppercase tracking-tight">
                {listing.serviceDetails.availability}
              </span>
            </div>
          )}

          {listing.pillar === 'marketplace' && listing.marketplaceDetails && (
            <div className="flex items-center justify-between text-xs text-slate-600 py-1.5 border-y border-slate-100 my-2">
              <span className="font-medium">Condition: {listing.marketplaceDetails.condition}</span>
              {listing.marketplaceDetails.negotiable && (
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px]">Negotiable</span>
              )}
            </div>
          )}

          {listing.pillar === 'motors' && listing.motorDetails && (
            <div className="flex items-center gap-3 text-xs text-slate-600 py-1.5 border-y border-slate-100 my-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{listing.motorDetails.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                <span>{listing.motorDetails.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>{listing.motorDetails.transmission}</span>
              </div>
            </div>
          )}

          {(listing.pillar === 'jobs' || listing.pillar === 'opportunities') && listing.jobDetails && (
            <div className="flex items-center justify-between text-xs text-slate-600 py-1.5 border-y border-slate-100 my-2">
              <div className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{listing.jobDetails.jobType}</span>
              </div>
              {listing.jobDetails.remote && (
                <span className="text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded text-[10px]">Remote</span>
              )}
            </div>
          )}

          {/* Brief Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {listing.description}
          </p>
        </div>

        {/* Vendor & Quick Actions Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={listing.vendor.avatar}
              alt={listing.vendor.name}
              className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 truncate">
                <span className="truncate">{listing.vendor.name}</span>
                {listing.vendor.verified && (
                  <span title="KYC Verified">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{listing.vendor.rating}</span>
                <span className="text-slate-400">({listing.vendor.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Connect */}
          <button
            onClick={openWhatsApp}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white transition-all border border-emerald-200"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
