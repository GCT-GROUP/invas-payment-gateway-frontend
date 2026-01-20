import { API_CONFIG } from "./constants"
import { Plan, 
  PaymentInitiateResponse, 
  PaymentVerifyResponse, 
  CustomerVerifyResponse, 
  ValidateTokenResponse 
} from "./types"

export async function validateToken(token:string): Promise<ValidateTokenResponse>{
  try {
    const response = await fetch(`${API_CONFIG.PC_BASE_URL}/validate/${token}`, {
      method: "GET",
      headers: {
        "X-API-Key": API_CONFIG.PC_API_KEY || "",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to validate token")
    }

    return await response.json()
  } catch (error) {
    console.error("invas Error validating token:", error)
    throw error
  }
}

export async function fetchCustomer(userId: string): Promise<CustomerVerifyResponse>{
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/customers/user/${userId}`, {
      method: "GET",
      headers: {
        "X-API-Key": API_CONFIG.API_KEY || "",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch customer")
    }

    const data = await response.json()
    return data || []

  } catch (error) {
    console.error("invas Error fetching customer:", error)
    throw error
  }
}

export async function fetchPlans(): Promise<Plan[]> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/plans`, {
      method: "GET",
      headers: {
        "X-API-Key": API_CONFIG.API_KEY || "",
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
    const response = await fetch(`${API_CONFIG.BASE_URL}/payments/initiate`, {
      method: "POST",
      headers: {
        "X-API-Key": API_CONFIG.API_KEY || "",
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
    const response = await fetch(`${API_CONFIG.BASE_URL}/payments/verify/${transactionId}`, {
      method: "GET",
      headers: {
        "X-API-Key": API_CONFIG.API_KEY || "",
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
