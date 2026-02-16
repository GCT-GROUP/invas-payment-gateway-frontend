import { API_CONFIG } from "./constants"
import { Plan, 
  CustomerData,
  PaymentInitiateResponse, 
  PaymentVerifyResponse, 
  CustomerVerifyResponse, 
  ValidateTokenResponse,
  ConfirmPaymentApiResponse
} from "./types"

export async function validateToken(token:string): Promise<ValidateTokenResponse>{
  try {
    const response = await fetch(`${API_CONFIG.PC_BASE_URL}/customers/validate/${token}`, {
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

export async function postFetchCustomer(metadata?: CustomerData): Promise<CustomerVerifyResponse> {
  try {
    console.log("metadata", metadata);
    const response = await fetch(`${API_CONFIG.BASE_URL}/customers`, {
      method: "POST",
      headers: {
        "X-API-Key": API_CONFIG.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        billingCycle: metadata?.billingCycle,
        email: metadata?.email,
        name: `${metadata?.firstName} ${metadata?.lastName}`,
        firstName: metadata?.firstName,
        PCUserId: metadata?.id,
        lastName: metadata?.lastName,
        phone: metadata?.phone,
        currentPlanId: metadata?.planId,
      }),
    })

    if (!response.ok) {
      console.log("Failed to fetch customer", response.json())
      // throw new Error("Failed to fetch customer")
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
    return data.data.plans || []
  } catch (error) {
    console.error("invas Error fetching plans:", error)
    return []
  }
}

export async function initiatePayment(
  userId?: string,
  planId?: string,
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
        externalUserId: userId,
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

/**
 * Fetch transaction status by transaction ID
 * @param transactionId - The transaction ID to check
 * @returns Promise with transaction data
 */
export async function getTransactionStatus(transactionId: string): Promise<ConfirmPaymentApiResponse> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/payments/verify/${transactionId}`, {
      method: 'GET',
      headers: {
        'X-API-Key': API_CONFIG.API_KEY || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      data: data,
    }
  } catch (error: any) {
    console.error('Error fetching transaction status:', error)
    return {
      success: false,
      message: error.message || 'Failed to fetch transaction status',
    }
  }
}
