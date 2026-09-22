import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Share2, 
  Flag, 
  Zap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Bed, 
  Bath, 
  Maximize2, 
  Car, 
  ExternalLink,
  Send,
  MessageSquare
} from 'lucide-react';
import { Country, Listing, Review } from '../types';
import { formatPrice, convertPrice } from '../utils/currency';
import { submitLeadToFirestore, submitReviewToFirestore } from '../lib/firebase';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  currentCountry: Country;
  sourceCountry: Country;
  onOpenBoostModal: (listing: Listing) => void;
  reviews: Review[];
  onAddReview: (listingId: string, authorName: string, rating: number, comment: string) => void;
  similarListings: Listing[];
  onSelectListing: (listing: Listing) => void;
  onSendMessage: (listing: Listing, messageText: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  currentCountry,
  sourceCountry,
  onOpenBoostModal,
  reviews,
  onAddReview,
  similarListings,
  onSelectListing,
  onSendMessage,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // In-app message state
  const [chatMessage, setChatMessage] = useState('');
  const [chatSent, setChatSent] = useState(false);

  // Review form state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!listing) return null;

  const displayPrice = convertPrice(listing.price, sourceCountry, currentCountry);
  const listingReviews = reviews.filter((r) => r.listingId === listing.id);

  const handleShare = (platform: 'whatsapp' | 'x' | 'facebook' | 'linkedin' | 'copy') => {
    const url = `${window.location.origin}/#listing-${listing.id}`;
    const text = `Check out "${listing.title}" on AfriTrade (${currentCountry.name}): ${url}`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const msg = chatMessage.trim();
    onSendMessage(listing, msg);
    setChatMessage('');
    setChatSent(true);
    setTimeout(() => setChatSent(false), 3000);

    const leadPayload = {
      listingId: listing.id,
      vendorId: listing.vendor.id,
      buyerName: 'Prospective Buyer / Client',
      buyerContact: 'In-Platform Direct Inquiry',
      message: msg,
      channel: 'web_form',
      countryCode: currentCountry.isoCode,
      createdAt: new Date().toISOString(),
    };

    // Save to Cloud Firestore
    try {
      await submitLeadToFirestore({
        listingId: listing.id,
        vendorId: listing.vendor.id,
        senderName: 'Prospective Buyer / Client',
        senderPhone: 'Direct Web Inquiry',
        message: msg,
      });
    } catch (err) {
      console.warn('Firestore lead save skipped:', err);
    }

    // Call backend API /api/leads
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadPayload),
      });
    } catch (err) {
      console.warn('Backend /api/leads call skipped:', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    const author = newReviewAuthor.trim();
    const comment = newReviewComment.trim();
    const rating = newReviewRating;

    onAddReview(listing.id, author, rating, comment);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);

    const reviewPayload: Review = {
      id: `rev_${Date.now()}`,
      listingId: listing.id,
      authorName: author,
      authorLocation: currentCountry.name,
      rating,
      comment,
      verifiedBuyer: true,
      date: new Date().toISOString().split('T')[0],
    };

    // Save to Cloud Firestore
    try {
      await submitReviewToFirestore(reviewPayload);
    } catch (err) {
      console.warn('Firestore review save skipped:', err);
    }

    // Call backend API /api/reviews
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload),
      });
    } catch (err) {
      console.warn('Backend /api/reviews call skipped:', err);
    }
  };

  const openWhatsAppDirect = () => {
    const message = encodeURIComponent(
      `Hi ${listing.vendor.name}, I am contacting you regarding your listing "${listing.title}" on AfriTrade (${currentCountry.subdomain}.afritrade.com). Please provide more information.`
    );
    window.open(`https://wa.me/${listing.vendor.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Sticky Header with Title & Close */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-2.5 py-1 rounded-md bg-amber-500 text-white uppercase tracking-wider text-[10px]">
              {listing.pillar}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-700">{listing.categoryName}</span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">{listing.subcategory}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenBoostModal(listing)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Boost / Rank</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Title & Price Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {listing.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{listing.address || `${listing.city}, ${listing.regionArea}`}</span>
                <span>•</span>
                <span>Posted: {listing.datePosted}</span>
                <span>•</span>
                <span>{listing.views} Views</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-amber-50 border border-amber-200 px-4 py-3 rounded-2xl shrink-0 text-left md:text-right">
              <div className="text-xs text-amber-800 font-semibold uppercase tracking-wider">
                Price ({currentCountry.currencyCode})
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                {formatPrice(displayPrice, currentCountry.currencyCode, currentCountry.currencySymbol)}
              </div>
              {currentCountry.id !== sourceCountry.id && listing.price > 0 && (
                <div className="text-[11px] text-slate-500">
                  Native Price: {listing.currencyCode} {listing.price.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
              <img
                src={listing.images[activeImageIndex] || listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
              {listing.featuredTier !== 'free' && (
                <div className="absolute top-3 left-3 bg-amber-600 text-white font-bold text-xs px-3 py-1 rounded-lg shadow-lg flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Featured Boosted Listing</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-amber-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2-Column Split: Specs + Vendor Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Details & Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pillar Specific Detail Badges */}
              {listing.pillar === 'property' && listing.propertyDetails && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
                    Property Specifications
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400">Bedrooms</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                        <Bed className="w-4 h-4 text-amber-600" />
                        <span>{listing.propertyDetails.bedrooms}</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400">Bathrooms</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                        <Bath className="w-4 h-4 text-amber-600" />
                        <span>{listing.propertyDetails.bathrooms}</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400">Erf / Floor Size</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                        <Maximize2 className="w-4 h-4 text-amber-600" />
                        <span>{listing.propertyDetails.erfSizeM2} m²</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400">Parking</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                        <Car className="w-4 h-4 text-amber-600" />
                        <span>{listing.propertyDetails.parkingSpaces} Bays</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                      Type: <strong>{listing.propertyDetails.propertyType}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                      Pet-Friendly: <strong>{listing.propertyDetails.petFriendly ? 'Yes' : 'No'}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                      Furnished: <strong>{listing.propertyDetails.furnished ? 'Yes' : 'No'}</strong>
                    </span>
                    {listing.propertyDetails.virtualTourUrl && (
                      <a
                        href={listing.propertyDetails.virtualTourUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold flex items-center gap-1 hover:bg-indigo-100"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Virtual Walkthrough</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {listing.pillar === 'service' && listing.serviceDetails && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
                    Trade & Licensing Credentials
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-3">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400">Experience</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {listing.serviceDetails.experienceYears} Years
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400">Service Radius</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {listing.serviceDetails.serviceAreaRadiusKm} km Radius
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400">Availability</div>
                      <div className="text-sm font-bold text-emerald-700 mt-0.5">
                        {listing.serviceDetails.availability}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-xs text-slate-500 font-medium">Official Certifications & Permits:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {listing.serviceDetails.licenses.map((lic, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{lic}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {listing.pillar === 'business' && listing.businessDetails && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Operating Hours</span>
                      </div>
                      <div className="font-semibold text-slate-900 mt-1">{listing.businessDetails.openingHours}</div>
                    </div>
                    {listing.businessDetails.website && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <div className="text-slate-400 flex items-center gap-1">
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Official Website</span>
                        </div>
                        <a
                          href={listing.businessDetails.website}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-amber-600 hover:underline mt-1 block truncate"
                        >
                          {listing.businessDetails.website}
                        </a>
                      </div>
                    )}
                  </div>
                  {listing.businessDetails.branches && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400 mb-1.5">Regional Branches & Hubs:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {listing.businessDetails.branches.map((b, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Full Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Description & Details</h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                  {listing.description}
                </p>
              </div>

              {/* Map Location & Geo-Radius */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Location & GPS Pin</span>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${listing.city}, ${listing.regionArea || listing.region || ''}, ${sourceCountry.name}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-semibold text-slate-800">{listing.city}, {listing.regionArea || listing.region || sourceCountry.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Lat: {(listing.coordinates?.lat ?? listing.location?.lat ?? 0).toFixed(4)}° • Lng: {(listing.coordinates?.lng ?? listing.location?.lng ?? 0).toFixed(4)}° • {sourceCountry.name}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-[11px] shrink-0 self-start sm:self-auto">
                    Verified Geo-Radius
                  </span>
                </div>
              </div>

              {/* Social Sharing & Report Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500 font-medium">Share:</span>
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-semibold"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 font-semibold"
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('x')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                  >
                    X
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                  >
                    {shareSuccess ? 'Link Copied!' : 'Copy Link'}
                  </button>
                </div>

                <button
                  onClick={() => setReportModalOpen(true)}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report Listing</span>
                </button>
              </div>
            </div>

            {/* Right Column: Vendor Profile Card & Direct Contacts */}
            <div className="space-y-5">
              {/* Vendor Box */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={listing.vendor.avatar}
                    alt={listing.vendor.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base">
                      <span>{listing.vendor.name}</span>
                      {listing.vendor.verified && (
                        <span title="KYC Verified">
                          <ShieldCheck className="w-4 h-4 text-sky-500" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-800">{listing.vendor.rating}</span>
                      <span>({listing.vendor.reviewCount} Reviews)</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Member since {listing.vendor.memberSince} • Responds in {listing.vendor.responseRate}
                    </div>
                  </div>
                </div>

                {/* Primary Contact CTAs */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={openWhatsAppDirect}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{showPhone ? listing.vendor.phone : 'Show Phone Number'}</span>
                  </button>
                </div>

                {/* Direct In-App Message Form */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>Send In-Platform Inquiry</span>
                  </div>
                  <form onSubmit={handleSendChat} className="space-y-2">
                    <textarea
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder={`Ask ${listing.vendor.name} for a quote, viewing, or availability...`}
                      rows={2}
                      className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>{chatSent ? 'Inquiry Sent to Vendor!' : 'Send Message'}</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Boost CTA Card */}
              <div className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-200/80">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Are you the listing owner?</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Boost this listing to the #1 spot on category and AI searches with instant PayPal, PayFast or Yoco checkout.
                </p>
                <button
                  onClick={() => onOpenBoostModal(listing)}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                >
                  Boost This Listing Now
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Customer Reviews ({listingReviews.length})
                </h3>
                <p className="text-xs text-slate-500">Verified feedback on this vendor and listing</p>
              </div>
            </div>

            {/* Reviews List */}
            {listingReviews.length > 0 ? (
              <div className="space-y-3">
                {listingReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rev.authorName}</span>
                        <span className="text-slate-400">({rev.authorLocation})</span>
                        {rev.verifiedBuyer && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200">
                            Verified Interaction
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700">{rev.comment}</p>
                    <div className="text-[10px] text-slate-400 mt-1.5">{rev.date}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                No reviews yet. Be the first to leave feedback after transacting with this vendor!
              </div>
            )}

            {/* Leave a Review Form */}
            <form onSubmit={handleSubmitReview} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="font-bold text-slate-800">Leave a Review</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="Your Name (e.g. John K.)"
                  className="p-2 bg-white border border-slate-200 rounded-xl"
                  required
                />
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">Rating:</span>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="p-2 bg-white border border-slate-200 rounded-xl"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                    <option value={2}>2 Stars (Poor)</option>
                    <option value={1}>1 Star (Terrible)</option>
                  </select>
                </div>
              </div>
              <textarea
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Share details about your experience with this vendor..."
                rows={2}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl resize-none"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
              >
                {reviewSubmitted ? 'Review Published!' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Similar Recommendations */}
          {similarListings.length > 0 && (
            <div className="pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3">You Might Also Like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarListings.slice(0, 3).map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => {
                      onSelectListing(sim);
                      setActiveImageIndex(0);
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-slate-50 transition-all cursor-pointer flex gap-3"
                  >
                    <img
                      src={sim.images[0]}
                      alt={sim.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{sim.title}</div>
                      <div className="text-[11px] text-amber-700 font-mono mt-0.5">
                        {formatPrice(convertPrice(sim.price, sourceCountry, currentCountry), currentCountry.currencyCode, currentCountry.currencySymbol)}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{sim.city}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Report Listing Modal Subview */}
        {reportModalOpen && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Report Listing</h3>
              <p className="text-xs text-slate-500">
                Help our moderation team keep the Pan-African marketplace safe. Tell us why this listing is problematic:
              </p>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason (e.g. fraudulent seller, incorrect price, prohibited item, duplicate listing)..."
                rows={3}
                className="w-full p-2.5 text-xs border border-slate-200 rounded-xl"
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setReportSuccess(true);
                    setTimeout(() => {
                      setReportSuccess(false);
                      setReportModalOpen(false);
                    }, 1500);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold"
                >
                  {reportSuccess ? 'Flagged to Admin' : 'Submit Report'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
