/**
 * Pricing calculation utilities
 */

import { BILLING_CONFIG } from "./constants"

/**
 * Calculate yearly price from monthly price with discount
 */
export function calculateYearlyPrice(monthlyPrice: number): number {
  const yearlyPrice = monthlyPrice * BILLING_CONFIG.YEARLY_MULTIPLIER
  const discount = (yearlyPrice * BILLING_CONFIG.YEARLY_DISCOUNT_PERCENT) / 100
  return Math.floor(yearlyPrice - discount)
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(monthlyPrice: number): number {
  const yearlyPrice = monthlyPrice * BILLING_CONFIG.YEARLY_MULTIPLIER
  const discount = (yearlyPrice * BILLING_CONFIG.YEARLY_DISCOUNT_PERCENT) / 100
  return Math.floor(discount)
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = BILLING_CONFIG.DEFAULT_CURRENCY): string {
  return `${BILLING_CONFIG.CURRENCY_SYMBOL}${amount}`
}

/**
 * Get display price based on billing period
 */
export function getDisplayPrice(monthlyPrice: number, billingPeriod: "monthly" | "annually"): number {
  return billingPeriod === "annually" ? calculateYearlyPrice(monthlyPrice) : monthlyPrice
}

/**
 * Calculate monthly equivalent of yearly price
 */
export function getMonthlyEquivalent(yearlyPrice: number): number {
  return Math.ceil(yearlyPrice / BILLING_CONFIG.YEARLY_MULTIPLIER)
}
