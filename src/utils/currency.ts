import { Country } from '../types';

export function formatPrice(
  amount: number,
  currencyCode: string,
  currencySymbol: string
): string {
  if (amount === 0) return 'Free / Contact for Pricing';

  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
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
