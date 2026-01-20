/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  API_KEY: process.env.NEXT_PUBLIC_API_KEY || "demo-key",

  // PC GLOBAL 
  PC_BASE_URL: process.env.NEXT_PUBLIC_PC_API_URL || "http://localhost:3000/api",
  PC_API_KEY: process.env.NEXT_PUBLIC_PC_API_KEY || "demo-key",

  TIMEOUT: 30000, // 30 seconds
}
export const SUPPORT_EMAIL = "support@invas.me"

// Endpoints
export const ENDPOINTS = {
  HEALTH: "/health",
  PLANS: "/plans",
  PAYMENTS: {
    INITIATE: "/payments/initiate",
    VERIFY: "/payments/verify",
  },
  WEBHOOKS: {
    PAYMENT: "/webhooks/payment",
    RETRY: "/webhooks/retry",
  },
}

// Billing Configuration
export const BILLING_CONFIG = {
  YEARLY_DISCOUNT_PERCENT: 17,
  YEARLY_MULTIPLIER: 10,
  CURRENCY_SYMBOL: "₦",
  DEFAULT_CURRENCY: "NGN",
}

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELED: "canceled",
  REFUNDED: "refunded",
} as const

// Plan Configuration
export const PLAN_CONFIG = {
  STARTER: "plan_starter",
  GROWTH: "plan_growth",
  PREMIUM: "plan_premium",
}

// UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 5000,
  MODAL_Z_INDEX: 50,
}

// Error Messages
export const ERROR_MESSAGES = {
  API_UNAVAILABLE: "Unable to connect to the API. Using demo data.",
  PAYMENT_FAILED: "Payment processing failed. Please try again.",
  PAYMENT_VERIFIED: "Payment verified successfully.",
  INVALID_FORM: "Please check all required fields.",
  NETWORK_ERROR: "Network connection error. Please check your internet.",
  UNAUTHORIZED: "Unauthorized. Please check your API key.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error. Please try again later.",
}

// Success Messages
export const SUCCESS_MESSAGES = {
  PAYMENT_INITIATED: "Payment initiated successfully.",
  PAYMENT_COMPLETED: "Payment completed successfully.",
  PLAN_SELECTED: "Plan selected. Proceeding to payment.",
}

// Demo Plans (fallback)
export const DEMO_PLANS = [
  {
    id: "plan_starter",
    externalPlanId: "plan_starter",
    name: "Starter Pack",
    amount: 45000,
    duration: 30,
    currency: "NGN",
    features: {
      "Launching Campaigns": "✓",
      "1,000 ChatBot Sessions Monthly": "✓",
      "Live Analytics & Statistics": "✓",
      "1 Team Member": "✓",
      "Chatbot Factory": "✓",
      "Phone Books": "✓",
      "5 GB Cloud Storage": "✓",
    },
    isActive: true,
  },
  {
    id: "plan_growth",
    externalPlanId: "plan_growth",
    name: "Growth Pack",
    amount: 90000,
    duration: 30,
    currency: "NGN",
    description: "Everything in Starter Plan",
    features: {
      "Leads Management": "✓",
      "5,000 ChatBot Sessions": "✓",
      "Product Catalogue": "✓",
      "5 Team Members": "✓",
      "Message Scheduling": "✓",
      "Send Template API": "✓",
      "10 GB Cloud Storage": "✓",
    },
    isActive: true,
  },
  {
    id: "plan_premium",
    externalPlanId: "plan_premium",
    name: "Premium Pack",
    amount: 240000,
    duration: 30,
    currency: "NGN",
    description: "Everything in Growth Plan",
    features: {
      "Flow Automation": "✓",
      "10,000 ChatBot Sessions": "✓",
      "Order Management": "✓",
      "10 Team Members": "✓",
      "Dedicated Support": "✓",
      "BlueTick Verification": "✓",
      "15 GB Cloud Storage": "✓",
    },
    isActive: true,
  },
]

export interface PLAN {
  id: string
  externalPlanId: string
  name: string
  amount: number
  duration: number
  currency: string
  features: Record<string, string> | string[]
  isActive?: boolean
  description?: string
  isPopular?: boolean
}

export const getDemoPlans = (): PLAN[] => [
  {
    id: "plan_starter",
    externalPlanId: "plan_starter",
    name: "Starter",
    amount: 45000,
    duration: 30,
    currency: "NGN",
    features: {
      "Launching Campaigns": "✓",
      "1,000 ChatBot Sessions Monthly": "✓",
      "Live Analytics & Statistics": "✓",
      "1 Team Member": "✓",
      "Chatbot Factory": "✓",
      "Phone Books": "✓",
      "5 GB Cloud Storage": "✓",
    },
    isActive: true,
  },
  {
    id: "plan_growth",
    externalPlanId: "plan_growth",
    name: "Growth Plan",
    amount: 90000,
    duration: 30,
    currency: "NGN",
    description: "Everything in Starter Pack",
    features: {
      "Leads Management": "✓",
      "5,000 ChatBot Sessions": "✓",
      "Product Catalogue": "✓",
      "5 Team Members": "✓",
      "Message Scheduling": "✓",
      "Send Template API": "✓",
      "10 GB Cloud Storage": "✓",
    },
    isActive: true,
    isPopular: true,
  },
  {
    id: "plan_premium",
    externalPlanId: "plan_premium",
    name: "Premium Pack",
    amount: 240000,
    duration: 30,
    currency: "NGN",
    description: "Everything in Growth Pack",
    features: {
      "Flow Automation": "✓",
      "10,000 ChatBot Sessions": "✓",
      "Order Management": "✓",
      "10 Team Members": "✓",
      "Dedicated Support": "✓",
      "BlueTick Verification": "✓",
      "15 GB Cloud Storage": "✓",
    },
    isActive: true,
  },
]

export const singlePlan = getDemoPlans()[0]