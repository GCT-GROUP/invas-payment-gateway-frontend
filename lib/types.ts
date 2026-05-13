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

export interface UserData {
  id?: string
  externalUserId?: string
  externalCustomerId?: string
  CUserId: string
  paystackId: string
  lotusId: string
  email?: string
  name?: string
  firstName?: string
  lastName?: string
  phone?: string
  companyName?: string
  address?: string
  city: string
  state: string
  country: string
  zipCode: string
  currentPlan: string
  metadata: string
  createdAt: string
  updatedAt: string
  company?: string
  planId?: string
  billingCycle?: string
}

export interface PcGlobalPaymentDetails {
  payment_link_id: number,
  token: string,
  amount: string,
  currency: string,
  reference: string,
  business: {
    uuid: string,
    name: string
  },
  user:{
    id: string,
    email: string,
    name: string,
    phone_number?: string,
    company?: string,
    address?: string,
    city?: string,
    state?: string,
    zipCode?: string,
    country: string,
    planId?: string
  }
  status: string,
  expires_at: string,
  is_valid: boolean,
  metadata: {
    plan: string,
    cycle: string,
    user_id: number
  }
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

export interface CustomerData {
  id?: string
  externalUserId?: string
  externalCustomerId?: string
  PCUserId?: string
  lotusId?: string
  paystackId?: string
  name?: string
  billingCycle?: string
  firstName?: string
  lastName?: string
  company?: string
  email?: string
  phone?: string
  address?: string
  companyName?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  planId?: string
  metadata?: string
  createdAt?: string
  updatedAt?: string
}

// Payment related types
export interface PaymentInitiateRequest {
  userId: string
  planId: string
  metadata?: Record<string, any>
}
export interface ConfirmPaymentApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}


export interface PaymentInitiateResponse {
  success: boolean
  message: string
  data: {
    transactionId: string
    checkoutUrl: string
    currency: string
    paymentReference: string
    status: string
    amount: number
  }
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

// export interface PaymentInitiateResponse {
//   success: boolean
//   data: {
//     transactionId: string
//     paymentUrl?: string
//     status: string
//   }
//   message: string
// }

// export interface PaymentVerifyResponse {
//   success: boolean
//   data: {
//     transactionId: string
//     status: string
//     amount: number
//     planId: string
//   }
//   message: string
// }

export interface CustomerVerifyResponse {
  success: boolean
  data?: {
    id: string
    externalUserId: string
    externalCustomerId: string
    PCUserId: string
    lotusId: string
    paystackId: string
    name: string
    firstName: string
    lastName: string
    company: string
    email: string
    phone: string
    address: string
    companyName: string
    currentPlanId: string
    metadata: string
    createdAt: string
    updatedAt: string
  }
  message: string
}

export interface ValidateTokenResponse {
  success: boolean,
  message: string,
  token: string,
  data: {
    customer: { 
      id: string
      externalUserId?: string
      externalCustomerId?: string
      CUserId: string
      paystackId: string
      lotusId: string
      email?: string
      name?: string
      firstName?: string
      lastName?: string
      phone?: string
      companyName?: string
      address?: string
      city: string
      state: string
      country: string
      zipCode: string
      currentPlan: string
      metadata: string
      createdAt: string
      updatedAt: string
      company?: string
      planId?: string
      billingCycle?: string
    }
    paymentLinkData: PcGlobalPaymentDetails
    // payment: {
    //   payment_link_id: number,
    //   token: string,
    //   amount: string,
    //   currency: string,
    //   reference: string,
    //   business: {
    //     uuid: string,
    //     name: string
    //   },
    //   user?:{
    //     id: string,
    //     email: string,
    //     name: string,
    //     phone: string,
    //     company: string,
    //     address: string,
    //     city: string,
    //     state: string,
    //     zipCode: string,
    //     country: string,
    //     planId?: string
    //   }
    //   status: string,
    //   expires_at: string,
    //   is_valid: boolean,
    //   metadata: {
    //     plan: string,
    //     cycle: string,
    //     user_id: number
    //   }
    // }
  }
}

// User/Customer types
export interface Customer {
  id: string
  email: string
  fullName: string
  userId?: string
}

export interface PaymentDetails {
  transactionId: string
  status: string
  amount: number
  planId: string
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
  type: "monthly" | "annually"
  duration: number
  discount?: number
}
