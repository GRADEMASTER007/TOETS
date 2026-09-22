import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Zap, 
  Building2, 
  ShoppingBag, 
  Wrench, 
  Home, 
  MapPin, 
  Camera, 
  Sparkles,
  Phone,
  MessageCircle,
  Mail
} from 'lucide-react';
import { BoostPlan, Category, Country, Listing, PillarType } from '../types';

interface PostListingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  currentCountry: Country;
  boostPlans: BoostPlan[];
  onListingCreated: (newListing: Listing) => void;
}

export const PostListingWizard: React.FC<PostListingWizardProps> = ({
  isOpen,
  onClose,
  categories,
  currentCountry,
  boostPlans,
  onListingCreated,
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [pillar, setPillar] = useState<PillarType>('marketplace');
  const [categoryId, setCategoryId] = useState<string>('');
  const [subcategory, setSubcategory] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [city, setCity] = useState('');
  const [regionArea, setRegionArea] = useState('');
  const [address, setAddress] = useState('');

  // Pillar specific fields
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [erfSize, setErfSize] = useState<number>(250);
  const [parkingSpaces, setParkingSpaces] = useState<number>(2);
  const [propertyType, setPropertyType] = useState<'House' | 'Apartment' | 'Commercial' | 'Plot'>('House');
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');

  const [condition, setCondition] = useState<'Brand New' | 'Like New' | 'Used - Good' | 'Refurbished'>('Brand New');
  const [negotiable, setNegotiable] = useState(true);

  const [experienceYears, setExperienceYears] = useState(5);
  const [serviceRadius, setServiceRadius] = useState(30);
  const [availability, setAvailability] = useState<'Immediate' | 'Same Day' | 'Next Day'>('Immediate');

  const [openingHours, setOpeningHours] = useState('Mon - Sat: 08:00 - 18:00');
  const [website, setWebsite] = useState('');

  // Images
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Contact
  const [vendorName, setVendorName] = useState('My Business / Agency');
  const [vendorPhone, setVendorPhone] = useState('+27 82 000 0000');
  const [vendorWhatsapp, setVendorWhatsapp] = useState('27820000000');
  const [vendorEmail, setVendorEmail] = useState('contact@mybusiness.co.za');

  // Selected boost
  const [selectedBoost, setSelectedBoost] = useState<'free' | 'week' | 'month' | 'three_months'>('week');

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.pillar === pillar);
  const selectedCategoryObj = categories.find((c) => c.id === categoryId) || filteredCategories[0];

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();

    const newListing: Listing = {
      id: `list-${Date.now()}`,
      title: title || `${pillar.toUpperCase()} Listing in ${city || currentCountry.name}`,
      slug: (title || 'new-listing').toLowerCase().replace(/\s+/g, '-'),
      pillar,
      countryCode: currentCountry.isoCode,
      city: city || 'Cape Town',
      regionArea: regionArea || currentCountry.name,
      address: address || `${city}, ${currentCountry.name}`,
      coordinates: { lat: -26.0, lng: 28.0 },
      categoryId: selectedCategoryObj?.id || 'm-vehicles',
      categoryName: selectedCategoryObj?.name || 'General',
      subcategory: subcategory || selectedCategoryObj?.subcategories[0] || 'General',
      price: Number(price) || 0,
      currencyCode: currentCountry.currencyCode,
      description: description || 'Quality offering listed on AfriTrade & UAE Portal.',
      images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80'],
      featuredTier: selectedBoost,
      featuredDaysLeft: selectedBoost === 'three_months' ? 90 : selectedBoost === 'month' ? 30 : selectedBoost === 'week' ? 7 : 0,
      verifiedVendor: true,
      vendor: {
        id: `v-${Date.now()}`,
        name: vendorName,
        phone: vendorPhone,
        whatsapp: vendorWhatsapp,
        email: vendorEmail,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        verified: true,
        rating: 5.0,
        reviewCount: 1,
        responseRate: '15 mins',
        memberSince: '2026',
      },
      datePosted: new Date().toISOString().split('T')[0],
      status: 'active',
      views: 1,
      saves: 0,
      leadsCount: 0,
    };

    // Attach pillar specific details
    if (pillar === 'property') {
      newListing.propertyDetails = {
        bedrooms,
        bathrooms,
        erfSizeM2: erfSize,
        parkingSpaces,
        petFriendly: true,
        furnished: false,
        propertyType,
        listingType,
      };
    } else if (pillar === 'service') {
      newListing.serviceDetails = {
        experienceYears,
        serviceAreaRadiusKm: serviceRadius,
        startingRate: Number(price) || 500,
        availability,
        licenses: ['Accredited Business License'],
        quoteEnabled: true,
      };
    } else if (pillar === 'marketplace') {
      newListing.marketplaceDetails = {
        condition,
        negotiable,
        warranty: true,
      };
    } else if (pillar === 'business') {
      newListing.businessDetails = {
        openingHours,
        website,
        foundedYear: 2020,
      };
    }

    onListingCreated(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Wizard Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base">{currentCountry.flag}</span>
              <h2 className="text-lg font-bold text-slate-900">Post a New Listing</h2>
              <span className="text-xs font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                {currentCountry.subdomain}.afritrade.com
              </span>
            </div>
            <p className="text-xs text-slate-500">Step {step} of 5: Create and publish your offering</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-5 bg-slate-100 h-1.5">
          <div className={`h-full ${step >= 1 ? 'bg-amber-600' : 'bg-transparent'}`} />
          <div className={`h-full ${step >= 2 ? 'bg-amber-600' : 'bg-transparent'}`} />
          <div className={`h-full ${step >= 3 ? 'bg-amber-600' : 'bg-transparent'}`} />
          <div className={`h-full ${step >= 4 ? 'bg-amber-600' : 'bg-transparent'}`} />
          <div className={`h-full ${step >= 5 ? 'bg-amber-600' : 'bg-transparent'}`} />
        </div>

        {/* Wizard Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* STEP 1: Select Section & Category */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Select Section
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, desc: 'Buy & Sell Goods' },
                    { id: 'business', label: 'Business Directory', icon: Building2, desc: 'Companies & Brands' },
                    { id: 'service', label: 'Services & Trades', icon: Wrench, desc: 'Tradespeople & Pros' },
                    { id: 'property', label: 'Property Portal', icon: Home, desc: 'Real Estate & Land' },
                  ].map((p) => {
                    const Icon = p.icon;
                    const isSelected = pillar === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setPillar(p.id as PillarType);
                          setCategoryId('');
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 shadow-xs ring-2 ring-amber-500/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-amber-600' : 'text-slate-500'}`} />
                        <div className="font-bold text-sm text-slate-900">{p.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{p.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Category</label>
                  <select
                    value={categoryId || filteredCategories[0]?.id}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    {filteredCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Subcategory</label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  >
                    {(selectedCategoryObj?.subcategories || []).map((sub, i) => (
                      <option key={i} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Basic Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Listing Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 4 Bedroom Modern House in Sandton with Pool or Emergency Plumber"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: Pillar Specific Fields */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                {pillar.toUpperCase()} Specifications & Location
              </h3>

              {/* Property Fields */}
              {pillar === 'property' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Listing Type</label>
                    <select
                      value={listingType}
                      onChange={(e) => setListingType(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="sale">For Sale</option>
                      <option value="rent">To Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Erf Size (m²)</label>
                    <input
                      type="number"
                      value={erfSize}
                      onChange={(e) => setErfSize(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Service Fields */}
              {pillar === 'service' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Years of Experience</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Service Area Radius (km)</label>
                    <input
                      type="number"
                      value={serviceRadius}
                      onChange={(e) => setServiceRadius(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Availability</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Immediate">Immediate / 24-7</option>
                      <option value="Same Day">Same Day</option>
                      <option value="Next Day">Next Day</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Marketplace Fields */}
              {pillar === 'marketplace' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Condition</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Like New">Like New</option>
                      <option value="Used - Good">Used - Good</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="neg"
                      checked={negotiable}
                      onChange={(e) => setNegotiable(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <label htmlFor="neg" className="font-semibold text-slate-700">
                      Price is Negotiable
                    </label>
                  </div>
                </div>
              )}

              {/* Business Fields */}
              {pillar === 'business' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Operating Hours</label>
                    <input
                      type="text"
                      value={openingHours}
                      onChange={(e) => setOpeningHours(e.target.value)}
                      placeholder="e.g. Daily: 08:00 - 20:00"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Website URL</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* Location Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / Town</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Johannesburg or Dubai"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Area / Suburb</label>
                  <input
                    type="text"
                    value={regionArea}
                    onChange={(e) => setRegionArea(e.target.value)}
                    placeholder="e.g. Sandton or Deira"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 100 Main Road"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide comprehensive details about your listing..."
                  rows={4}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 3: Photos & Pricing */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Pricing & Image Assets</h3>

              {/* Price input */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200">
                <label className="text-xs font-bold text-amber-900 block mb-1">
                  Price in Local Currency ({currentCountry.currencyCode})
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-base text-slate-700">
                    {currentCountry.currencySymbol}
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 15000"
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-base font-bold font-mono focus:outline-none"
                    required
                  />
                  <span className="text-xs text-slate-500 font-semibold uppercase">{currentCountry.currencyCode}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Buyers in other countries will automatically see this converted to their local currency.
                </div>
              </div>

              {/* Image Links / Upload Simulator */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Photo Gallery URLs</label>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL or paste asset link..."
                    className="flex-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
                  >
                    Add Image
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {imageUrls.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrls(imageUrls.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Contact & Verification */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Vendor Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company / Display Name</label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">WhatsApp Number (with country code)</label>
                  <input
                    type="text"
                    value={vendorWhatsapp}
                    onChange={(e) => setVendorWhatsapp(e.target.value)}
                    placeholder="e.g. 27821234567"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Public Phone Number</label>
                  <input
                    type="text"
                    value={vendorPhone}
                    onChange={(e) => setVendorPhone(e.target.value)}
                    placeholder="+27 11 000 0000"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={vendorEmail}
                    onChange={(e) => setVendorEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Select Boost Plan */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Choose Placement & Boost Ranking</h3>
              </div>
              <p className="text-xs text-slate-500">
                Boosted listings receive up to 8x more inquiries, priority in AI searches, and featured badges.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {boostPlans.map((bp) => {
                  const isSel = selectedBoost === bp.id;
                  const price =
                    currentCountry.currencyCode === 'ZAR'
                      ? bp.priceZAR
                      : currentCountry.currencyCode === 'AED'
                        ? bp.priceAED
                        : bp.priceUSD;

                  return (
                    <button
                      key={bp.id}
                      type="button"
                      onClick={() => setSelectedBoost(bp.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSel
                          ? 'border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{bp.title}</div>
                      <div className="text-base font-black text-slate-900 font-mono my-2">
                        {price === 0 ? 'FREE' : `${currentCountry.currencySymbol} ${price}`}
                      </div>
                      <div className="text-[11px] text-slate-500">{bp.benefits[0]}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Publish Listing</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
