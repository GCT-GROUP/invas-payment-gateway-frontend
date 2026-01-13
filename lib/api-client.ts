const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export interface Plan {
  id: string
  externalPlanId: string
  name: string
  amount: number
  currency: string
  duration: number
  features: Record<string, string>
  isActive: boolean
  description?: string
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

export async function fetchPlans(): Promise<Plan[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/plans`, {
      method: "GET",
      headers: {
        "X-API-Key": API_KEY || "",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch plans")
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("invas Error fetching plans:", error)
    return []
  }
}

export async function initiatePayment(
  userId: string,
  planId: string,
  metadata?: Record<string, any>,
): Promise<PaymentInitiateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/initiate`, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        planId,
        metadata: metadata || { source: "web" },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to initiate payment")
    }

    return await response.json()
  } catch (error) {
    console.error("invas Error initiating payment:", error)
    throw error
  }
}

export async function verifyPayment(transactionId: string): Promise<PaymentVerifyResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/verify/${transactionId}`, {
      method: "GET",
      headers: {
        "X-API-Key": API_KEY || "",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to verify payment")
    }

    return await response.json()
  } catch (error) {
    console.error("invas Error verifying payment:", error)
    throw error
  }
}
