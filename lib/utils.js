import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Currency utility functions
export const currencyOptions = [
  { value: 'NGN', label: 'Nigerian Naira (₦)', symbol: '₦' },
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' }
];

export function getCurrencySymbol(currency) {
  const currencyOption = currencyOptions.find(option => option.value === currency);
  return currencyOption ? currencyOption.symbol : '₦';
}

export function formatCurrency(amount, currency = 'NGN') {
  const symbol = getCurrencySymbol(currency);
  const numericAmount = parseFloat(amount);
  
  if (isNaN(numericAmount)) return `${symbol}0`;
  
  return `${symbol}${numericAmount.toLocaleString()}`;
}
