/**
 * Type definitions for inVAS Payment Gateway API
 */

// Plan related types
export interface Plan {
  id: string
  externalPlanId: string
  name: string
  amount: number
  currency: string
  duration: number
  features: Record<string, string> | string[]
  isActive: boolean
  description?: string
}

export interface PricingTier {
  id: string
  name: string
  price: number
  yearlyPrice?: number
  description?: string
  isPopular?: boolean
  features: string[]
}

// Payment related types
export interface PaymentInitiateRequest {
  userId: string
  planId: string
  metadata?: Record<string, any>
}

export interface PaymentInitiateResponse {
  success: boolean
  data: {
    transactionId: string
    paymentUrl?: string
    status: string
  }
  message: string
}

export interface PaymentVerifyResponse {
  success: boolean
  data: {
    transactionId: string
    status: string
    amount: number
    planId: string
  }
  message: string
}

// User/Customer types
export interface Customer {
  id: string
  email: string
  fullName: string
  userId?: string
}

export interface PaymentDetails {
  email: string
  fullName: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

// API Error types
export interface APIError {
  code: string
  message: string
  details?: Record<string, any>
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: APIError
}

// Subscription types
export interface Subscription {
  id: string
  userId: string
  planId: string
  status: "active" | "canceled" | "pending" | "failed"
  currentPeriodStart: string
  currentPeriodEnd: string
  canceledAt?: string
  createdAt: string
}

export interface BillingPeriod {
  type: "monthly" | "yearly"
  duration: number
  discount?: number
}
