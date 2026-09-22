import { Country } from '../types';

// Benchmark FX conversion relative to USD
export const GLOBAL_FX_RATES_TO_USD: Record<string, { rateFromUSD: number; symbol: string; name: string }> = {
  USD: { rateFromUSD: 1.0, symbol: '$', name: 'US Dollar' },
  EUR: { rateFromUSD: 0.92, symbol: '€', name: 'Euro' },
  GBP: { rateFromUSD: 0.79, symbol: '£', name: 'British Pound' },
  AED: { rateFromUSD: 3.6725, symbol: 'AED', name: 'UAE Dirham' },
  ZAR: { rateFromUSD: 18.25, symbol: 'R', name: 'South African Rand' },
};

export function formatPrice(
  amount: number,
  currencyCode: string,
  currencySymbol: string,
  forceDecimals = false
): string {
  if (amount === 0) return 'Free / Contact for Pricing';

  const hasDecimals = forceDecimals || (amount > 0 && amount < 100 && !Number.isInteger(amount));
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  }).format(amount);

  return `${currencySymbol} ${formatted} ${currencyCode}`;
}

export function convertPrice(
  sourceAmount: number,
  sourceCountry: Country,
  targetCountry: Country
): number {
  if (sourceCountry.id === targetCountry.id) return sourceAmount;

  // Convert source to USD first, then to target
  const amountInUSD = sourceAmount / (sourceCountry.exchangeRateToUSD || 1);
  const targetAmount = amountInUSD * (targetCountry.exchangeRateToUSD || 1);

  return Math.round(targetAmount);
}

export type DisplayCurrencyMode = 'LOCAL' | 'USD' | 'EUR';

export interface ConvertedCurrencyResult {
  amount: number;
  currencyCode: string;
  currencySymbol: string;
  currencyName: string;
  rateVsUSD: number;
  formattedText: string;
}

/**
 * Calculates real-time conversion for listing price into Local, USD, or EUR
 */
export function convertListingPrice(
  listingPrice: number,
  sourceCountry: Country,
  currentCountry: Country,
  targetMode: DisplayCurrencyMode
): ConvertedCurrencyResult {
  // First calculate price in USD
  const sourceRateToUSD = sourceCountry.exchangeRateToUSD || 1;
  const priceInUSD = listingPrice / sourceRateToUSD;

  if (targetMode === 'USD') {
    const usdAmount = Number(priceInUSD.toFixed(2));
    return {
      amount: usdAmount,
      currencyCode: 'USD',
      currencySymbol: '$',
      currencyName: 'US Dollar',
      rateVsUSD: 1.0,
      formattedText: formatPrice(usdAmount, 'USD', '$', usdAmount < 1000 && !Number.isInteger(usdAmount)),
    };
  }

  if (targetMode === 'EUR') {
    const eurRate = GLOBAL_FX_RATES_TO_USD.EUR.rateFromUSD;
    const eurAmount = Number((priceInUSD * eurRate).toFixed(2));
    return {
      amount: eurAmount,
      currencyCode: 'EUR',
      currencySymbol: '€',
      currencyName: 'Euro',
      rateVsUSD: eurRate,
      formattedText: formatPrice(eurAmount, 'EUR', '€', eurAmount < 1000 && !Number.isInteger(eurAmount)),
    };
  }

  // Local currency based on selected country
  const currentRateToUSD = currentCountry.exchangeRateToUSD || 1;
  const localAmount = Math.round(priceInUSD * currentRateToUSD);
  return {
    amount: localAmount,
    currencyCode: currentCountry.currencyCode,
    currencySymbol: currentCountry.currencySymbol,
    currencyName: `${currentCountry.name} Currency`,
    rateVsUSD: currentRateToUSD,
    formattedText: formatPrice(localAmount, currentCountry.currencyCode, currentCountry.currencySymbol),
  };
}

