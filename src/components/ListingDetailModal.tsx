import React, { useState, useEffect } from 'react';
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
  MessageSquare,
  ArrowRightLeft,
  DollarSign,
  Euro,
  Coins,
  TrendingUp,
  Calculator,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Info,
  QrCode,
  Download,
  Smartphone,
  UserCheck,
  Copy,
  Check,
  Bell,
  BellRing,
  TrendingDown,
  Trash2,
  AlertCircle,
  ShoppingBag,
  Tag,
  Gauge,
  Users,
  Wallet,
  Building2
} from 'lucide-react';
import QRCode from 'qrcode';
import { Country, Listing, Review, SavedSearchAlert, UserProfile, Order } from '../types';
import { 
  formatPrice, 
  convertPrice, 
  convertListingPrice, 
  DisplayCurrencyMode,
  GLOBAL_FX_RATES_TO_USD 
} from '../utils/currency';
import {
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
} from 'react-share';
import { submitLeadToFirestore, submitReviewToFirestore, createOrder } from '../lib/firebase';
import { ListingPriceHistoryChart } from './ListingPriceHistoryChart';

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
  onCheckout?: (listing: Listing) => void;
  savedSearches?: SavedSearchAlert[];
  onAddSavedSearch?: (alert: Omit<SavedSearchAlert, 'id' | 'createdAt' | 'matchCount'>) => void;
  onDeleteSavedSearch?: (id: string) => void;
  profile: UserProfile | null;
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
  onCheckout,
  savedSearches = [],
  onAddSavedSearch,
  onDeleteSavedSearch,
  profile,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
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
  const [loading, setLoading] = useState(false);

  // Real-time Currency Converter State
  const [currencyMode, setCurrencyMode] = useState<DisplayCurrencyMode>('LOCAL');
  const [showFxCalculator, setShowFxCalculator] = useState(false);
  const [customCalcAmount, setCustomCalcAmount] = useState<string>('');

  // QR Code Feature State
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrType, setQrType] = useState<'url' | 'vcard' | 'whatsapp'>('url');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrCopied, setQrCopied] = useState(false);

  if (!listing) return null;

  const listingShareUrl = `https://${currentCountry.subdomain}.marketplacehub.company/#listing-${listing.id}`;

  // Generate QR Code dynamically
  useEffect(() => {
    if (!listing) return;
    const generateQR = async () => {
      try {
        let payload = '';
        if (qrType === 'url') {
          payload = listingShareUrl;
        } else if (qrType === 'vcard') {
          payload = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${listing.vendor.name}`,
            `ORG:Market Place Hub (${currentCountry.name})`,
            `TITLE:${listing.title}`,
            `TEL;TYPE=CELL,VOICE:${listing.vendor.phone}`,
            `TEL;TYPE=WHATSAPP:${listing.vendor.whatsapp}`,
            listing.vendor.email ? `EMAIL:${listing.vendor.email}` : '',
            `ADR;TYPE=WORK:;;${listing.address || listing.city};${listing.city};${listing.regionArea || ''};;${currentCountry.name}`,
            `NOTE:Market Place Hub Listing: ${listing.title} | Price: ${currentCountry.currencyCode} ${listing.price.toLocaleString()}`,
            `URL:${listingShareUrl}`,
            'END:VCARD',
          ].filter(Boolean).join('\n');
        } else if (qrType === 'whatsapp') {
          const msg = encodeURIComponent(
            `Hi ${listing.vendor.name}, I am contacting you regarding your listing "${listing.title}" on Market Place Hub (${currentCountry.name}): ${listingShareUrl}`
          );
          payload = `https://wa.me/${listing.vendor.whatsapp}?text=${msg}`;
        }

        const dataUrl = await QRCode.toDataURL(payload, {
          width: 360,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    };

    generateQR();
  }, [listing, qrType, currentCountry, listingShareUrl]);

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QRCode-${listing.slug || 'listing'}-${qrType}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyQrContent = () => {
    let contentToCopy = listingShareUrl;
    if (qrType === 'whatsapp') {
      contentToCopy = `https://wa.me/${listing.vendor.whatsapp}`;
    } else if (qrType === 'vcard') {
      contentToCopy = `${listing.vendor.name}\nPhone: ${listing.vendor.phone}\nWhatsApp: ${listing.vendor.whatsapp}\nListing: ${listing.title}\n${listingShareUrl}`;
    }
    navigator.clipboard.writeText(contentToCopy);
    setQrCopied(true);
    setTimeout(() => setQrCopied(false), 2500);
  };

  // Check if a Price Drop Alert is already active for this listing
  const existingPriceAlert = savedSearches?.find(
    (s) => s.listingId === listing.id || (s.alertType === 'price_drop' && s.query === listing.title)
  );

  // Price Drop Alert State
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);
  const [priceAlertOption, setPriceAlertOption] = useState<'any' | '5pct' | '10pct' | '15pct' | 'custom'>('any');
  const [customTargetPrice, setCustomTargetPrice] = useState<string>('');
  const [alertEmail, setAlertEmail] = useState<string>(() => localStorage.getItem('mph_user_email') || '');
  const [alertEmailEnabled, setAlertEmailEnabled] = useState<boolean>(true);
  const [alertPushEnabled, setAlertPushEnabled] = useState<boolean>(true);
  const [alertFrequency, setAlertFrequency] = useState<'instant' | 'daily'>('instant');
  const [priceAlertSuccessMsg, setPriceAlertSuccessMsg] = useState<string | null>(null);

  // Sync state if existing price alert exists
  useEffect(() => {
    if (existingPriceAlert) {
      if (existingPriceAlert.targetPrice) {
        setCustomTargetPrice(existingPriceAlert.targetPrice.toString());
        setPriceAlertOption('custom');
      } else {
        setPriceAlertOption('any');
      }
      setAlertEmailEnabled(existingPriceAlert.emailEnabled);
      setAlertPushEnabled(existingPriceAlert.pushEnabled);
      setAlertFrequency(existingPriceAlert.frequency === 'daily' ? 'daily' : 'instant');
    }
  }, [existingPriceAlert]);

  const getComputedTargetPrice = (): number | undefined => {
    if (priceAlertOption === '5pct') return Math.round(listing.price * 0.95);
    if (priceAlertOption === '10pct') return Math.round(listing.price * 0.90);
    if (priceAlertOption === '15pct') return Math.round(listing.price * 0.85);
    if (priceAlertOption === 'custom' && customTargetPrice) return Number(customTargetPrice);
    return undefined; // Any price reduction
  };

  const handleSavePriceAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPrice = getComputedTargetPrice();

    if (alertEmail.trim()) {
      localStorage.setItem('mph_user_email', alertEmail.trim());
    }

    if (existingPriceAlert && onDeleteSavedSearch) {
      onDeleteSavedSearch(existingPriceAlert.id);
    }

    if (onAddSavedSearch) {
      onAddSavedSearch({
        name: `Price Alert: ${listing.title}`,
        query: listing.title,
        pillar: listing.pillar,
        category: listing.categoryId,
        city: listing.city,
        countryId: currentCountry.id,
        maxPrice: targetPrice,
        frequency: alertFrequency,
        emailEnabled: alertEmailEnabled,
        pushEnabled: alertPushEnabled,
        alertType: 'price_drop',
        listingId: listing.id,
        initialPrice: listing.price,
        targetPrice: targetPrice,
        listingSlug: listing.slug,
        listingImage: listing.images?.[0] || '',
      });
    }

    setPriceAlertSuccessMsg(
      targetPrice
        ? `Price alert set! You will be notified when the price drops to ${currentCountry.currencyCode} ${targetPrice.toLocaleString()} or lower.`
        : `Price alert set! You will be notified immediately upon any price reduction on this listing.`
    );

    setTimeout(() => {
      setShowPriceAlertModal(false);
      setPriceAlertSuccessMsg(null);
    }, 1800);
  };

  const handleRemovePriceAlert = () => {
    if (existingPriceAlert && onDeleteSavedSearch) {
      onDeleteSavedSearch(existingPriceAlert.id);
      setPriceAlertSuccessMsg('Price alert removed.');
      setTimeout(() => {
        setShowPriceAlertModal(false);
        setPriceAlertSuccessMsg(null);
      }, 1200);
    }
  };

  // Active converted price
  const convertedInfo = convertListingPrice(listing.price, sourceCountry, currentCountry, currencyMode);
  const displayPrice = convertedInfo.amount;
  const listingReviews = reviews.filter((r) => r.listingId === listing.id);

  // Reference rates relative to USD based on current selected country
  const countryRateToUSD = currentCountry.exchangeRateToUSD || 1;
  const eurRateToUSD = GLOBAL_FX_RATES_TO_USD.EUR.rateFromUSD;
  const countryRateToEUR = Number((countryRateToUSD / eurRateToUSD).toFixed(2));

  // Multi-currency calculation breakdown for current listing price or custom input
  const baseListingPriceUSD = listing.price / (sourceCountry.exchangeRateToUSD || 1);
  const activeCalcInputUSD = customCalcAmount !== '' && !isNaN(Number(customCalcAmount)) 
    ? (currencyMode === 'USD' 
        ? Number(customCalcAmount) 
        : currencyMode === 'EUR' 
          ? Number(customCalcAmount) / eurRateToUSD 
          : Number(customCalcAmount) / countryRateToUSD)
    : baseListingPriceUSD;

  const multiCurrencyEstimates = [
    {
      code: currentCountry.currencyCode,
      symbol: currentCountry.currencySymbol,
      name: `${currentCountry.name} (Local)`,
      flag: currentCountry.flag,
      amount: Math.round(activeCalcInputUSD * countryRateToUSD),
      rateText: `1 USD = ${countryRateToUSD.toLocaleString()} ${currentCountry.currencyCode}`,
    },
    {
      code: 'USD',
      symbol: '$',
      name: 'United States Dollar',
      flag: '🇺🇸',
      amount: Number(activeCalcInputUSD.toFixed(2)),
      rateText: 'Base Global Benchmark (1.00)',
    },
    {
      code: 'EUR',
      symbol: '€',
      name: 'Eurozone Euro',
      flag: '🇪🇺',
      amount: Number((activeCalcInputUSD * eurRateToUSD).toFixed(2)),
      rateText: `1 EUR ≈ ${countryRateToEUR.toLocaleString()} ${currentCountry.currencyCode}`,
    },
    {
      code: 'AED',
      symbol: 'AED',
      name: 'UAE Dirham',
      flag: '🇦🇪',
      amount: Number((activeCalcInputUSD * GLOBAL_FX_RATES_TO_USD.AED.rateFromUSD).toFixed(2)),
      rateText: 'Pegged 3.6725 / USD',
    },
    {
      code: 'ZAR',
      symbol: 'R',
      name: 'South African Rand',
      flag: '🇿🇦',
      amount: Math.round(activeCalcInputUSD * GLOBAL_FX_RATES_TO_USD.ZAR.rateFromUSD),
      rateText: `1 USD ≈ ${GLOBAL_FX_RATES_TO_USD.ZAR.rateFromUSD} ZAR`,
    },
    {
      code: 'GBP',
      symbol: '£',
      name: 'British Pound',
      flag: '🇬🇧',
      amount: Number((activeCalcInputUSD * GLOBAL_FX_RATES_TO_USD.GBP.rateFromUSD).toFixed(2)),
      rateText: '1 USD ≈ 0.79 GBP',
    },
  ];

  const handleShare = (platform: 'whatsapp' | 'x' | 'facebook' | 'linkedin' | 'copy') => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : `https://${currentCountry.subdomain}.marketplacehub.company`;
    const url = `${origin}/#listing-${listing.id}`;
    const priceText = `${currentCountry.currencySymbol} ${listing.price.toLocaleString()} ${currentCountry.currencyCode}`;
    const text = `Check out "${listing.title}" (${priceText}) on Market Place Hub (${currentCountry.name}): ${url}`;

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
      `Hi ${listing.vendor.name}, I am contacting you regarding your listing "${listing.title}" on Market Place Hub (${currentCountry.subdomain}.marketplacehub.company). Please provide more information.`
    );
    window.open(`https://wa.me/${listing.vendor.whatsapp}?text=${message}`, '_blank');
  };

  const handlePlaceOrder = async () => {
    if (!profile) {
      alert('Please sign in to place an order.');
      return;
    }

    if (onCheckout) {
      onCheckout(listing);
      return;
    }

    try {
      setLoading(true);
      const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        buyerId: profile.uid,
        buyerName: profile.displayName,
        sellerId: listing.vendor.id,
        sellerName: listing.vendor.name,
        listingId: listing.id,
        listingTitle: listing.title,
        listingImage: listing.images[0] || '',
        amount: listing.price,
        commissionAmount: listing.price * 0.15,
        sellerEarnings: listing.price * 0.85,
        status: 'pending',
        currency: currentCountry.currencyCode,
        paymentType: 'platform',
      };

      await createOrder(orderData);
      alert('Order placed successfully! The seller has been notified.');
      onClose();
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="listing-detail-modal" 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto relative"
      >
        {/* Temporary Link Copied Toast Notification */}
        {shareSuccess && (
          <div 
            id="copy-url-toast"
            role="status" 
            aria-live="polite"
            className="fixed sm:absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/95 text-white text-xs font-bold rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200"
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
            <span>Link copied!</span>
          </div>
        )}

        {/* Sticky Header with Title & Close */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="text-slate-900 border-l-2 border-amber-500 pl-2">
              {listing.pillar}
            </span>
            <span>/</span>
            <span className="text-slate-600">{listing.categoryName}</span>
            <span>/</span>
            <span className="text-slate-600">{listing.subcategory}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Row of Social Media Share Icons inside header */}
            <div id="listing-social-share-row" className="hidden sm:flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              {/* WhatsApp */}
              <WhatsappShareButton
                url={typeof window !== 'undefined' && window.location?.origin ? `${window.location.origin}/#listing-${listing.id}` : `https://${currentCountry.subdomain}.marketplacehub.company/#listing-${listing.id}`}
                title={`${listing.title} (${currentCountry.currencySymbol} ${listing.price.toLocaleString()} ${currentCountry.currencyCode}) - Market Place Hub`}
                separator=" • "
                className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <WhatsappIcon size={26} round />
              </WhatsappShareButton>

              {/* Twitter */}
              <TwitterShareButton
                url={typeof window !== 'undefined' && window.location?.origin ? `${window.location.origin}/#listing-${listing.id}` : `https://${currentCountry.subdomain}.marketplacehub.company/#listing-${listing.id}`}
                title={`${listing.title} (${currentCountry.currencySymbol} ${listing.price.toLocaleString()} ${currentCountry.currencyCode}) - Market Place Hub`}
                hashtags={['MarketPlaceHub', listing.pillar.replace(/\s+/g, '')]}
                className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <TwitterIcon size={26} round />
              </TwitterShareButton>

              {/* Facebook */}
              <FacebookShareButton
                url={typeof window !== 'undefined' && window.location?.origin ? `${window.location.origin}/#listing-${listing.id}` : `https://${currentCountry.subdomain}.marketplacehub.company/#listing-${listing.id}`}
                className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <FacebookIcon size={26} round />
              </FacebookShareButton>

              {/* Email */}
              <EmailShareButton
                url={typeof window !== 'undefined' && window.location?.origin ? `${window.location.origin}/#listing-${listing.id}` : `https://${currentCountry.subdomain}.marketplacehub.company/#listing-${listing.id}`}
                subject={`Check out "${listing.title}" on Market Place Hub`}
                body={`I thought you might be interested in this listing on Market Place Hub (${currentCountry.name}):\n\n${listing.title}\nPrice: ${currentCountry.currencySymbol} ${listing.price.toLocaleString()} ${currentCountry.currencyCode}\n\nView details:`}
                separator="\n\n"
                className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <EmailIcon size={26} round />
              </EmailShareButton>

              {/* Copy URL Button */}
              <button
                id="copy-listing-url-btn"
                type="button"
                onClick={() => handleShare('copy')}
                className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all border shadow-2xs cursor-pointer ${
                  shareSuccess
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 ring-2 ring-emerald-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 active:scale-95'
                }`}
                title="Copy unique listing URL to clipboard"
              >
                {shareSuccess ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>{shareSuccess ? 'Copied!' : 'Copy URL'}</span>
              </button>
            </div>

            {/* Social Media Share Dropdown / Popover */}
            <div className="relative">
              <button
                id="listing-share-header-btn"
                type="button"
                onClick={() => setShowShareMenu((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 border shadow-xs transition-all ${
                  showShareMenu
                    ? 'bg-sky-50 border-sky-300 text-sky-800 ring-2 ring-sky-500/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
                title="Share listing via WhatsApp, Twitter/X, or Facebook"
              >
                <Share2 className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {showShareMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowShareMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">Share Listing</span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[180px] block font-mono">{typeof window !== 'undefined' && window.location?.origin ? `${window.location.origin}/#listing-${listing.id}` : `https://${currentCountry.subdomain}.marketplacehub.company/#listing-${listing.id}`}</span>
                      </div>
                      <span className="text-[10px] bg-sky-50 text-sky-700 font-bold px-1.5 py-0.5 rounded border border-sky-200">
                        react-share
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5">
                      {/* react-share WhatsApp */}
                      <WhatsappShareButton
                        url={typeof window !== 'undefined' && window.location?.origin ? `${window.location.origin}/#listing-${listing.id}` : `https://${currentCountry.subdomain}.marketplacehub.company/#listing-${listing.id}`}
                        title={`${listing.title} (${currentCountry.currencySymbol} ${listing.price.toLocaleString()} ${currentCountry.currencyCode}) - Market Place Hub`}
                        separator=" • "
                        className="w-full! text-left"
                        onClick={() => setShowShareMenu(false)}
                      >
                        <div className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 flex items-center justify-between transition-colors group cursor-pointer border border-transparent hover:border-emerald-200">
                          <div className="flex items-center gap-2.5">
                            <WhatsappIcon size={26} round />
                            <span className="font-bold">WhatsApp</span>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-medium group-hover:underline">Direct Message</span>
                        </div>
                      </WhatsappShareButton>

                      {/* react-share Twitter / X */}
                      <TwitterShareButton
                        url={typeof window !== 'undefined' && window.location?.origin ? `${window.location.origin}/#listing-${listing.id}` : `https://${currentCountry.subdomain}.marketplacehub.company/#listing-${listing.id}`}
                        title={`${listing.title} (${currentCountry.currencySymbol} ${listing.price.toLocaleString()} ${currentCountry.currencyCode}) - Market Place Hub`}
                        hashtags={['MarketPlaceHub', listing.pillar.replace(/\s+/g, '')]}
                        className="w-full! text-left"
                        onClick={() => setShowShareMenu(false)}
                      >
                        <div className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold hover:bg-slate-100 text-slate-800 hover:text-slate-950 flex items-center justify-between transition-colors group cursor-pointer border border-transparent hover:border-slate-300">
                          <div className="flex items-center gap-2.5">
                            <TwitterIcon size={26} round />
                            <span className="font-bold">Twitter / X</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium group-hover:underline">Post Tweet</span>
                        </div>
                      </TwitterShareButton>

                      {/* react-share Facebook */}
                      <FacebookShareButton
                        url={typeof window !== 'undefined' && window.location?.origin ? `${window.location.origin}/#listing-${listing.id}` : `https://${currentCountry.subdomain}.marketplacehub.company/#listing-${listing.id}`}
                        className="w-full! text-left"
                        onClick={() => setShowShareMenu(false)}
                      >
                        <div className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold hover:bg-blue-50 text-slate-800 hover:text-blue-900 flex items-center justify-between transition-colors group cursor-pointer border border-transparent hover:border-blue-200">
                          <div className="flex items-center gap-2.5">
                            <FacebookIcon size={26} round />
                            <span className="font-bold">Facebook</span>
                          </div>
                          <span className="text-[10px] text-blue-600 font-medium group-hover:underline">Share Post</span>
                        </div>
                      </FacebookShareButton>

                      {/* react-share LinkedIn */}
                      <LinkedinShareButton
                        url={typeof window !== 'undefined' && window.location?.origin ? `${window.location.origin}/#listing-${listing.id}` : `https://${currentCountry.subdomain}.marketplacehub.company/#listing-${listing.id}`}
                        title={listing.title}
                        summary={`View ${listing.title} on Market Place Hub.`}
                        source="Market Place Hub"
                        className="w-full! text-left"
                        onClick={() => setShowShareMenu(false)}
                      >
                        <div className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold hover:bg-sky-50 text-slate-800 hover:text-sky-900 flex items-center justify-between transition-colors group cursor-pointer border border-transparent hover:border-sky-200">
                          <div className="flex items-center gap-2.5">
                            <LinkedinIcon size={26} round />
                            <span className="font-bold">LinkedIn</span>
                          </div>
                          <span className="text-[10px] text-sky-600 font-medium group-hover:underline">Share Network</span>
                        </div>
                      </LinkedinShareButton>

                      {/* react-share Telegram */}
                      <TelegramShareButton
                        url={typeof window !== 'undefined' && window.location?.origin ? `${window.location.origin}/#listing-${listing.id}` : `https://${currentCountry.subdomain}.marketplacehub.company/#listing-${listing.id}`}
                        title={`${listing.title} (${currentCountry.currencySymbol} ${listing.price.toLocaleString()} ${currentCountry.currencyCode})`}
                        className="w-full! text-left"
                        onClick={() => setShowShareMenu(false)}
                      >
                        <div className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold hover:bg-cyan-50 text-slate-800 hover:text-cyan-900 flex items-center justify-between transition-colors group cursor-pointer border border-transparent hover:border-cyan-200">
                          <div className="flex items-center gap-2.5">
                            <TelegramIcon size={26} round />
                            <span className="font-bold">Telegram</span>
                          </div>
                          <span className="text-[10px] text-cyan-600 font-medium group-hover:underline">Send Message</span>
                        </div>
                      </TelegramShareButton>

                      {/* Copy Unique Link */}
                      <button
                        type="button"
                        onClick={() => {
                          handleShare('copy');
                          setShowShareMenu(false);
                        }}
                        className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between transition-colors border border-slate-200/80 mt-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          {shareSuccess ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-500" />
                          )}
                          <span className="font-bold">{shareSuccess ? 'Link Copied!' : 'Copy Unique Link'}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">#listing-{listing.id}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setShowPriceAlertModal(true)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 border shadow-xs transition-colors ${
                existingPriceAlert
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
              title={existingPriceAlert ? 'Price drop alert is active' : 'Set a price drop alert for this listing'}
            >
              {existingPriceAlert ? (
                <>
                  <BellRing className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span className="hidden sm:inline">Alert Active</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Price Alert</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-xs transition-colors"
              title="Generate QR Code to scan on mobile"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">QR Code</span>
            </button>

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
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {listing.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1.5">
                <span className="flex items-center gap-1 font-bold text-slate-900 uppercase tracking-tight">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{listing.address || `${listing.city}, ${listing.regionArea}`}</span>
                </span>
                <span>/</span>
                <span className="tabular-nums">Posted: {listing.datePosted}</span>
                <span>/</span>
                <span className="tabular-nums">{listing.views} Views</span>
                <span>/</span>
                <span className="inline-flex items-center gap-1 text-slate-900 font-bold uppercase tracking-widest">
                  <span>{currentCountry.flag}</span>
                  <span>{currentCountry.name}</span>
                </span>
              </div>
            </div>

            {/* Real-time Currency Converter & Price Box */}
            <div className="bg-gradient-to-b from-amber-50/90 to-amber-100/50 border border-amber-200/80 p-3.5 sm:p-4 rounded-2xl shrink-0 w-full lg:w-80 shadow-xs space-y-2.5">
              {/* Currency Selector Toggle Tabs */}
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-1">
                  <ArrowRightLeft className="w-3 h-3 text-amber-700" />
                  <span>Currency</span>
                </span>
                <div className="inline-flex p-0.5 bg-amber-200/50 rounded-lg border border-amber-300/60">
                  <button
                    type="button"
                    onClick={() => setCurrencyMode('LOCAL')}
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-md transition-all ${
                      currencyMode === 'LOCAL'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-amber-900 hover:text-slate-900'
                    }`}
                    title={`View in ${currentCountry.currencyCode} (${currentCountry.name})`}
                  >
                    {currentCountry.currencyCode}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyMode('USD')}
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-md transition-all flex items-center gap-0.5 ${
                      currencyMode === 'USD'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-amber-900 hover:text-slate-900'
                    }`}
                    title="Convert to US Dollars ($)"
                  >
                    <DollarSign className="w-2.5 h-2.5" />
                    <span>USD</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyMode('EUR')}
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-md transition-all flex items-center gap-0.5 ${
                      currencyMode === 'EUR'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-amber-900 hover:text-slate-900'
                    }`}
                    title="Convert to Euros (€)"
                  >
                    <Euro className="w-2.5 h-2.5" />
                    <span>EUR</span>
                  </button>
                </div>
              </div>

              {/* Converted Price Display */}
              <div className="text-left">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums tracking-tighter flex items-baseline gap-1.5">
                  <span>{convertedInfo.formattedText}</span>
                </div>
                
                {/* Real-time FX Subtext & Rate Reference */}
                <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-slate-600">
                  {currencyMode === 'LOCAL' ? (
                    <div className="flex items-center justify-between text-amber-950 font-bold uppercase tracking-tight">
                      <span>Live Rate:</span>
                      <span className="tabular-nums">1 USD / {countryRateToUSD.toLocaleString()} {currentCountry.currencyCode}</span>
                    </div>
                  ) : currencyMode === 'USD' ? (
                    <div className="flex items-center justify-between text-amber-950 font-bold uppercase tracking-tight">
                      <span>Converted:</span>
                      <span className="tabular-nums">Rate {countryRateToUSD.toLocaleString()} / USD</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-amber-950 font-bold uppercase tracking-tight">
                      <span>Converted:</span>
                      <span className="tabular-nums">1 EUR / {countryRateToEUR.toLocaleString()} {currentCountry.currencyCode}</span>
                    </div>
                  )}

                  {currentCountry.id !== sourceCountry.id && listing.price > 0 && (
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-amber-200/50 flex items-center justify-between font-bold uppercase tracking-widest">
                      <span>Origin:</span>
                      <span className="tabular-nums">{listing.currencyCode} {listing.price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* FX Calculator Toggle Button */}
              <button
                type="button"
                onClick={() => setShowFxCalculator(!showFxCalculator)}
                className="w-full pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px] font-bold text-amber-900 hover:text-amber-950 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-amber-700" />
                  <span>FX Calculator & Multi-Currency</span>
                </span>
                {showFxCalculator ? (
                  <ChevronUp className="w-3.5 h-3.5 text-amber-700" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
                )}
              </button>

              {/* Set Price Drop Alert Action */}
              <div className="pt-2 border-t border-amber-200/80">
                {existingPriceAlert ? (
                  <button
                    type="button"
                    onClick={() => setShowPriceAlertModal(true)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center justify-between transition-colors shadow-2xs group"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <BellRing className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
                      <span className="truncate">
                        Alert Active: {existingPriceAlert.targetPrice ? `≤ ${currentCountry.currencyCode} ${existingPriceAlert.targetPrice.toLocaleString()}` : 'Any Price Drop'}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 underline font-semibold shrink-0 ml-1 group-hover:text-emerald-900">
                      Manage
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowPriceAlertModal(true)}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 border border-amber-300/90 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs group"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                    <span>Set Price Alert</span>
                    <span className="text-[10px] text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded-md font-semibold">
                      Notify on Drop
                    </span>
                  </button>
                )}
              </div>

              {/* Transaction Options: Platform vs Private */}
              <div className="pt-3 flex flex-col gap-2">
                {listing.marketplaceDetails?.allowPlatformCheckout && (
                  <>
                    <button
                      id="platform-buy-now-btn"
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                      <span>{loading ? 'Processing...' : 'Buy Now & Pay In-App'}</span>
                    </button>
                    <div className="flex items-center gap-1.5 justify-center py-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">Verified Secure Checkout</span>
                    </div>
                  </>
                )}

                {/* Vertical-Specific Lead Actions */}
                {listing.pillar === 'property' && (
                  <button
                    onClick={() => {
                      alert('Property Viewing Request Sent to Agent');
                    }}
                    className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule a Viewing</span>
                  </button>
                )}

                {listing.pillar === 'service' && (
                  <button
                    onClick={() => {
                      alert('Quote Request Sent to Professional');
                    }}
                    className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Request a Free Quote</span>
                  </button>
                )}

                {listing.pillar === 'motors' && (
                  <button
                    onClick={() => {
                      alert('Finance Application Started');
                    }}
                    className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Apply for Finance</span>
                  </button>
                )}

                {(listing.pillar === 'jobs' || listing.pillar === 'opportunities') && (
                  <button
                    onClick={() => {
                      alert('Application Submitted Successfully');
                    }}
                    className="w-full py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Apply for this Position</span>
                  </button>
                )}

                <button
                  id="private-sale-btn"
                  onClick={() => setShowPhone(true)}
                  className="w-full py-2.5 rounded-2xl bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>Contact Seller (Direct)</span>
                </button>
                <p className="text-[10px] text-slate-400 text-center px-4">
                  In-app payments are secure with 24/7 buyer protection. Private sales are at your own risk.
                </p>
              </div>
            </div>
          </div>

          {/* Expandable Real-Time FX Conversion Tool & Calculator */}
          {showFxCalculator && (
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 space-y-4 shadow-lg animate-in fade-in zoom-in-95 duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Real-Time Cross-Border FX Engine ({currentCountry.name})
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Live currency conversion for trade across African Union (AfCFTA) & UAE corridors
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 text-[11px]">Custom Amount:</span>
                  <div className="relative">
                    <input
                      type="number"
                      value={customCalcAmount}
                      onChange={(e) => setCustomCalcAmount(e.target.value)}
                      placeholder={displayPrice.toString()}
                      className="w-32 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    {customCalcAmount && (
                      <button
                        type="button"
                        onClick={() => setCustomCalcAmount('')}
                        className="absolute right-1.5 top-1.5 text-[10px] text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Multi-Currency Conversion Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {multiCurrencyEstimates.map((item) => (
                  <div
                    key={item.code}
                    className={`p-2.5 rounded-xl border transition-all ${
                      (currencyMode === 'LOCAL' && item.code === currentCountry.currencyCode) ||
                      (currencyMode === 'USD' && item.code === 'USD') ||
                      (currencyMode === 'EUR' && item.code === 'EUR')
                        ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                        : 'bg-slate-800/70 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="flex items-center gap-1 font-bold text-white">
                        <span>{item.flag}</span>
                        <span>{item.code}</span>
                      </span>
                      <span className="text-[10px] text-slate-400">{item.symbol}</span>
                    </div>
                    <div className="text-sm font-bold font-mono text-amber-400">
                      {item.symbol} {item.amount.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate mt-0.5">
                      {item.rateText}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    Official baseline: <strong>1 USD = {countryRateToUSD.toLocaleString()} {currentCountry.currencyCode}</strong> • <strong>1 EUR ≈ €0.92 USD</strong>
                  </span>
                </div>
                <span className="text-slate-500">
                  Select Local, USD, or EUR above to adapt the listing view
                </span>
              </div>
            </div>
          )}

          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
              <img
                src={listing.images[activeImageIndex] || listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Image Navigation Arrows */}
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : listing.images.length - 1));
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev < listing.images.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Expand / Fullscreen Button */}
              <button
                onClick={() => setShowFullScreen(true)}
                className="absolute bottom-3 right-3 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider z-10"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Expand</span>
              </button>

              {listing.featuredTier !== 'free' && (
                <div className="absolute top-3 left-3 bg-amber-600 text-white font-bold text-xs px-3 py-1 rounded-lg shadow-lg flex items-center gap-1.5 z-10">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Featured Boosted Listing</span>
                </div>
              )}

              {/* Image Counter Badge */}
              {listing.images.length > 1 && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-black/40 text-white text-[10px] font-bold rounded-lg backdrop-blur-md z-10">
                  {activeImageIndex + 1} / {listing.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 snap-start ${
                      activeImageIndex === idx ? 'border-amber-600 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
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
                    {listing.propertyDetails.floorPlanUrl && (
                      <a
                        href={listing.propertyDetails.floorPlanUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-semibold flex items-center gap-1 hover:bg-amber-100"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Floor Plan</span>
                      </a>
                    )}
                  </div>
                  {listing.propertyDetails.amenities && listing.propertyDetails.amenities.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Amenities Checklist:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {listing.propertyDetails.amenities.map((amenity, aIdx) => (
                          <span key={aIdx} className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{amenity}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {listing.pillar === 'motors' && listing.motorDetails && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
                    Vehicle Specifications
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400">Mileage</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                        <Gauge className="w-4 h-4 text-amber-600" />
                        <span>{listing.motorDetails.mileage.toLocaleString()} km</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400">Transmission</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                        <Tag className="w-4 h-4 text-amber-600" />
                        <span>{listing.motorDetails.transmission}</span>
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400">Fuel</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {listing.motorDetails.fuel}
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400">Condition</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {listing.motorDetails.condition}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200 text-xs text-slate-700">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200">
                      Make: <strong>{listing.motorDetails.make}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200">
                      Model: <strong>{listing.motorDetails.model}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200">
                      Year: <strong>{listing.motorDetails.year}</strong>
                    </span>
                    {listing.motorDetails.financeAvailable && (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                        Finance Available
                      </span>
                    )}
                  </div>
                </div>
              )}

              {(listing.pillar === 'jobs' || listing.pillar === 'opportunities') && listing.jobDetails && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <h3 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
                    Opportunity Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Hiring Company</span>
                      </div>
                      <div className="font-bold text-slate-900 mt-1">{listing.jobDetails.company}</div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <div className="text-slate-400 flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Salary / Budget</span>
                      </div>
                      <div className="font-bold text-slate-900 mt-1">{listing.jobDetails.salaryRange || 'Market Related'}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-200 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                      Type: <strong>{listing.jobDetails.jobType}</strong>
                    </span>
                    {listing.jobDetails.remote && (
                      <span className="px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-800 font-semibold">
                        Remote Possible
                      </span>
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

              {/* D3-Powered Price History & Market Fluctuations Line Chart */}
              <ListingPriceHistoryChart
                listing={listing}
                currentCountry={currentCountry}
                sourceCountry={sourceCountry}
                currencyMode={currencyMode}
              />

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
                    onClick={() => {
                      setQrType('url');
                      setShowQrModal(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-semibold flex items-center gap-1.5 shadow-2xs"
                    title="Generate QR code for mobile scanning"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-700" />
                    <span>QR Code</span>
                  </button>
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
                  {listing.pillar === 'marketplace' && listing.marketplaceDetails?.allowPlatformCheckout && (
                    <button
                      onClick={() => {
                        // Simulate Marketplace Checkout
                        alert(`Initiating secure checkout for ${listing.title} via platform gateway. 15% commission will be applied.`);
                        // In a real app, this would open a checkout modal or redirect
                      }}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 transition-all active:scale-98"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Secure Buy Now</span>
                    </button>
                  )}

                  {listing.pillar === 'marketplace' && !listing.marketplaceDetails?.allowPlatformCheckout && (
                    <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center mb-1">
                      Private Sale • Contact Below
                    </div>
                  )}

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

                  {/* QR Code Quick Scan for Vendor Contact & vCard */}
                  <button
                    onClick={() => {
                      setQrType('vcard');
                      setShowQrModal(true);
                    }}
                    className="w-full py-2 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-amber-900 font-semibold text-xs border border-amber-200 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-700" />
                    <span>Scan QR / Save Contact to Mobile</span>
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

        {/* QR Code Sharing & Contact Sync Modal Subview */}
        {showQrModal && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-30 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      Scan QR Code
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Instantly share or save to mobile
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QR Mode Selector */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setQrType('url')}
                  className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                    qrType === 'url'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Listing</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQrType('vcard')}
                  className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                    qrType === 'vcard'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>vCard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQrType('whatsapp')}
                  className={`py-1.5 px-2 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                    qrType === 'whatsapp'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative p-3 bg-white rounded-2xl border-2 border-slate-800/80 shadow-md">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Listing QR Code"
                      className="w-52 h-52 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-52 h-52 flex items-center justify-center text-xs text-slate-400">
                      Generating QR Code...
                    </div>
                  )}

                  {/* Corner Accent Visuals */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-600 rounded-tl-sm" />
                  <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-600 rounded-tr-sm" />
                  <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-600 rounded-bl-sm" />
                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-600 rounded-br-sm" />
                </div>

                {/* Target Explanation Badge */}
                <div className="mt-3 text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                    <span>{currentCountry.flag}</span>
                    <span className="truncate max-w-[200px]">{listing.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-xs leading-tight">
                    {qrType === 'url' && 'Point your smartphone camera to open this listing instantly on mobile.'}
                    {qrType === 'vcard' && `Scan to add ${listing.vendor.name}'s verified contact to your phone address book.`}
                    {qrType === 'whatsapp' && `Scan to open a direct WhatsApp chat with ${listing.vendor.name}.`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyQrContent}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                >
                  {qrCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>{qrType === 'url' ? 'Copy Link' : qrType === 'vcard' ? 'Copy Contact' : 'Copy Chat'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Price Drop Alert Modal Subview */}
        {showPriceAlertModal && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-30 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700">
                    <BellRing className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {existingPriceAlert ? 'Manage Price Drop Alert' : 'Set Price Drop Alert'}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Get instant alerts when the seller lowers the price
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPriceAlertModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Success Notification Banner */}
              {priceAlertSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{priceAlertSuccessMsg}</span>
                </div>
              )}

              {/* Listing Context Summary Card */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{listing.title}</h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <span>{currentCountry.flag}</span>
                    <span className="truncate">{listing.city}, {currentCountry.name}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-900 mt-1">
                    Current Price: <span className="text-amber-800 font-extrabold">{currentCountry.currencyCode} {listing.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSavePriceAlert} className="space-y-4">
                {/* Trigger Condition Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    When should we alert you?
                  </label>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPriceAlertOption('any')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        priceAlertOption === 'any'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500/30'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                        <span>Any Price Drop</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                        Notify on any discount by seller
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPriceAlertOption('5pct')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        priceAlertOption === '5pct'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500/30'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>5% Drop</span>
                        <span className="text-[10px] font-mono text-emerald-600 font-extrabold">
                          {currentCountry.currencyCode} {Math.round(listing.price * 0.95).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                        Save ~{currentCountry.currencyCode} {Math.round(listing.price * 0.05).toLocaleString()}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPriceAlertOption('10pct')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        priceAlertOption === '10pct'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500/30'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>10% Drop</span>
                        <span className="text-[10px] font-mono text-emerald-600 font-extrabold">
                          {currentCountry.currencyCode} {Math.round(listing.price * 0.90).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                        Save ~{currentCountry.currencyCode} {Math.round(listing.price * 0.10).toLocaleString()}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPriceAlertOption('custom')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        priceAlertOption === 'custom'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500/30'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                        <span>Custom Target</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                        Specify exact maximum price
                      </p>
                    </button>
                  </div>

                  {/* Custom Target Price Input Field */}
                  {priceAlertOption === 'custom' && (
                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1.5 animate-in fade-in">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        Target Price Threshold ({currentCountry.currencyCode}) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">
                          {currentCountry.currencyCode}
                        </span>
                        <input
                          type="number"
                          required
                          value={customTargetPrice}
                          onChange={(e) => setCustomTargetPrice(e.target.value)}
                          placeholder={Math.round(listing.price * 0.9).toString()}
                          max={listing.price}
                          className="w-full pl-14 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Alert fires whenever the listing is discounted to or below this amount.
                      </p>
                    </div>
                  )}
                </div>

                {/* Delivery Channels */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                  <label className="block font-bold text-slate-800">
                    Notification Channels & Delivery
                  </label>

                  {/* Email Toggle */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alertEmailEnabled}
                        onChange={(e) => setAlertEmailEnabled(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <span className="font-semibold text-slate-800 text-xs">
                        Email Notifications
                      </span>
                    </label>

                    {alertEmailEnabled && (
                      <input
                        type="email"
                        value={alertEmail}
                        onChange={(e) => setAlertEmail(e.target.value)}
                        placeholder="your-email@example.com"
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    )}
                  </div>

                  {/* Push Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={alertPushEnabled}
                      onChange={(e) => setAlertPushEnabled(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span className="font-semibold text-slate-800 text-xs">
                      Browser / Device Push Notifications
                    </span>
                  </label>

                  {/* Frequency */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Alert Timing:</span>
                    <select
                      value={alertFrequency}
                      onChange={(e) => setAlertFrequency(e.target.value as any)}
                      className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                    >
                      <option value="instant">Instant Real-Time (Immediate)</option>
                      <option value="daily">Daily Morning Digest (08:00)</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {existingPriceAlert ? (
                    <button
                      type="button"
                      onClick={handleRemovePriceAlert}
                      className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Alert</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPriceAlertModal(false)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span>{existingPriceAlert ? 'Update Alert' : 'Save Price Alert'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

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

        {/* Full Screen Image Viewer Overlay */}
        {showFullScreen && (
          <div 
            className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-300"
            onClick={() => setShowFullScreen(false)}
          >
            {/* Close Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowFullScreen(false);
              }}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-[110]"
              title="Close Fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main Fullscreen Image */}
            <div 
              className="relative max-w-7xl w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={listing.images[activeImageIndex] || listing.images[0]}
                alt={listing.title}
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
              />

              {/* Fullscreen Navigation Arrows */}
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : listing.images.length - 1));
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/15 text-white rounded-full backdrop-blur-sm transition-all border border-white/10"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev < listing.images.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/5 hover:bg-white/15 text-white rounded-full backdrop-blur-sm transition-all border border-white/10"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>

            {/* Fullscreen Thumbnails & Info */}
            {listing.images.length > 1 && (
              <div 
                className="absolute bottom-10 flex flex-col items-center gap-4 z-[110]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 overflow-x-auto p-2 bg-black/30 rounded-2xl backdrop-blur-md border border-white/5 max-w-[90vw] scrollbar-none">
                  {listing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-amber-500 scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-80'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="px-4 py-1.5 bg-amber-500 text-slate-950 text-xs font-black rounded-full shadow-lg font-mono tracking-widest">
                  {activeImageIndex + 1} / {listing.images.length}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
