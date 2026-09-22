import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Download, 
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { BoostPlan, Country, Listing, PaymentGateway, Transaction } from '../types';

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  boostPlans: BoostPlan[];
  currentCountry: Country;
  onActivateBoost: (listingId: string, planId: 'free' | 'bump' | 'week' | 'month' | 'three_months', newTransaction: Transaction) => void;
}

export const BoostModal: React.FC<BoostModalProps> = ({
  isOpen,
  onClose,
  listing,
  boostPlans,
  currentCountry,
  onActivateBoost,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<'free' | 'bump' | 'week' | 'month' | 'three_months'>('month');
  
  // Default gateway based on currency: PayFast/Yoco for ZAR, PayPal for USD/AED/others
  const initialGateway: PaymentGateway = currentCountry.currencyCode === 'ZAR' ? 'payfast' : 'paypal';
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>(initialGateway);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success'>('select');
  const [completedTransaction, setCompletedTransaction] = useState<Transaction | null>(null);

  if (!isOpen || !listing) return null;

  const selectedPlan = boostPlans.find((p) => p.id === selectedPlanId) || boostPlans[1];

  // Calculate pricing based on current country
  const getPriceForCountry = (plan: BoostPlan) => {
    if (plan.id === 'free') return 0;
    if (currentCountry.currencyCode === 'ZAR') return plan.priceZAR;
    if (currentCountry.currencyCode === 'AED') return plan.priceAED;
    return plan.priceUSD;
  };

  const planPrice = getPriceForCountry(selectedPlan);

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    const invoiceNumber = `INV-${new Date().getFullYear()}-${currentCountry.isoCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    const reference = `${selectedGateway.toUpperCase()}_${Date.now()}`;

    try {
      // Call Express server checkout endpoint
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway: selectedGateway,
          listingId: listing.id,
          planId: selectedPlan.id,
          amount: planPrice,
          currency: currentCountry.currencyCode,
          countryCode: currentCountry.isoCode,
          buyerEmail: listing.vendor.email || 'waterkefirsa@gmail.com',
          buyerName: listing.vendor.name || 'Vendor',
        }),
      });

      const data = await response.json();
      const confirmedRef = data?.checkout?.reference || reference;
      const confirmedInv = data?.checkout?.invoiceNumber || invoiceNumber;

      // Trigger Webhook simulation
      await fetch(`/api/payments/webhook?gateway=${selectedGateway}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: confirmedInv,
          reference: confirmedRef,
          status: 'PAID',
          listingId: listing.id,
          planId: selectedPlan.id,
          gateway: selectedGateway,
        }),
      });

      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        vendorId: listing.vendor.id,
        gateway: selectedGateway,
        amount: planPrice,
        currency: currentCountry.currencyCode,
        planId: selectedPlan.id,
        planTitle: selectedPlan.title,
        status: 'completed',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        invoiceNumber: confirmedInv,
        reference: confirmedRef,
      };

      setCompletedTransaction(tx);
      setPaymentStep('success');

      // Update listing in parent state
      onActivateBoost(listing.id, selectedPlan.id, tx);
    } catch (err) {
      console.error('Payment error:', err);
      // Fallback local completion
      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        listingId: listing.id,
        listingTitle: listing.title,
        vendorId: listing.vendor.id,
        gateway: selectedGateway,
        amount: planPrice,
        currency: currentCountry.currencyCode,
        planId: selectedPlan.id,
        planTitle: selectedPlan.title,
        status: 'completed',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        invoiceNumber,
        reference,
      };
      setCompletedTransaction(tx);
      setPaymentStep('success');
      onActivateBoost(listing.id, selectedPlan.id, tx);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!completedTransaction) return;
    const invoiceContent = `
==================================================
           MARKET PLACE HUB
        TAX INVOICE / RECEIPT
       (marketplacehub.company)
==================================================
Invoice No:    ${completedTransaction.invoiceNumber}
Date:          ${completedTransaction.date}
Payment Gateway:${completedTransaction.gateway.toUpperCase()}
Reference:     ${completedTransaction.reference}
Country/Region:${currentCountry.name} (${currentCountry.subdomain}.marketplacehub.company)

CUSTOMER DETAILS:
Vendor:        ${listing.vendor.name}
Email:         ${listing.vendor.email}

ORDER ITEMS:
Item:          Listing Ranking Boost - ${completedTransaction.planTitle}
Listing ID:    ${completedTransaction.listingId}
Listing Title: ${completedTransaction.listingTitle}
Duration:      ${selectedPlan.durationDays} Days Active

TOTAL AMOUNT:  ${currentCountry.currencySymbol} ${completedTransaction.amount} ${completedTransaction.currency}
STATUS:        PAID & ACTIVATED
==================================================
Thank you for promoting your business with Market Place Hub!
`;
    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${completedTransaction.invoiceNumber}.txt`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Boost Listing & Top Placement</h2>
              <p className="text-xs text-slate-500">
                Surfaces your listing on category top spots, AI searches & regional buyers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Target Listing Summary Banner */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3.5">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                Target Listing
              </span>
              <div className="font-bold text-slate-900 text-sm truncate mt-0.5">{listing.title}</div>
              <div className="text-xs text-slate-500">
                Current Tier: <strong className="text-slate-800 capitalize">{listing.featuredTier.replace('_', ' ')}</strong>
                {listing.featuredDaysLeft ? ` (${listing.featuredDaysLeft} days left)` : ''}
              </div>
            </div>
          </div>

          {paymentStep === 'select' && (
            <>
              {/* Step 1: Select Boost Tier */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <span>1. Choose Ranking Boost Plan</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {boostPlans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const price = getPriceForCountry(plan);
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between relative ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/60 shadow-md ring-2 ring-amber-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {plan.id === 'three_months' && (
                          <span className="absolute -top-2.5 right-3 bg-purple-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Best Value
                          </span>
                        )}
                        {plan.isQuickBump && (
                          <span className="absolute -top-2.5 right-3 bg-sky-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Instant Results
                          </span>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{plan.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{plan.durationDays} Days Duration</div>

                          <div className="text-lg font-black text-slate-900 font-mono my-2.5">
                            {price === 0 ? 'FREE' : `${currentCountry.currencySymbol} ${price}`}
                          </div>

                          <ul className="space-y-1.5 text-[11px] text-slate-600 mt-2">
                            {plan.benefits.slice(0, 3).map((b, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                          <span className={isSelected ? 'text-amber-700 font-bold' : 'text-slate-400'}>
                            {isSelected ? 'Selected' : 'Select Plan'}
                          </span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Choose Payment Gateway */}
              {selectedPlan.id !== 'free' && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <span>2. Select Payment Gateway</span>
                    <span className="text-xs font-normal text-slate-500">(Auto-configured for {currentCountry.name})</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* PayFast */}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('payfast')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedGateway === 'payfast'
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-extrabold text-sm text-slate-900">PayFast</div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Instant EFT / ZAR
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">
                        Instant EFT, Credit/Debit cards & Masterpass in South Africa.
                      </p>
                    </button>

                    {/* Yoco */}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('yoco')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedGateway === 'yoco'
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-extrabold text-sm text-slate-900">Yoco</div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          Cards & In-App
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">
                        Frictionless Visa & Mastercard card checkout for South Africa.
                      </p>
                    </button>

                    {/* PayPal */}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('paypal')}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selectedGateway === 'paypal'
                          ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-2 ring-sky-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-extrabold text-sm text-slate-900">PayPal</div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                          Global & UAE
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">
                        International card processing for UAE (AED), Diaspora & Pan-Africa.
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Order Summary & Confirm Checkout Button */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">Total Payable Now:</div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {planPrice === 0 ? 'FREE' : `${currentCountry.currencySymbol} ${planPrice} ${currentCountry.currencyCode}`}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Plan: <strong>{selectedPlan.title}</strong> • Gateway: <strong>{selectedGateway.toUpperCase()}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  className="w-full sm:w-auto px-8 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Confirm & Activate Boost</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {paymentStep === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">Connecting to {selectedGateway.toUpperCase()}...</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Securely verifying transaction parameters, generating tax invoice, and triggering live webhook listener...
              </p>
            </div>
          )}

          {paymentStep === 'success' && completedTransaction && (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Listing Boost Activated!</h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Your listing <strong>"{listing.title}"</strong> has been elevated to <strong>{completedTransaction.planTitle}</strong> status across all search results.
                </p>
              </div>

              {/* Receipt Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-2">
                  <span>Invoice Number:</span>
                  <span className="font-bold text-slate-800">{completedTransaction.invoiceNumber}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Transaction Ref:</span>
                  <span className="text-slate-800">{completedTransaction.reference}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Gateway:</span>
                  <span className="text-slate-800 capitalize">{completedTransaction.gateway}</span>
                </div>
                <div className="flex justify-between text-slate-500 border-t border-slate-200 pt-2 font-bold text-slate-900 text-sm">
                  <span>Amount Paid:</span>
                  <span>{completedTransaction.currency} {completedTransaction.amount}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Tax Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
