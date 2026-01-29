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

// export async function createLotusCustomer(customerData: CustomerData): Promise<CustomerVerifyResponse>{
//   try {
//     const response = await fetch(`${API_CONFIG.LOTUS_BASE_URL}/customer`, {
//       method: "POST",
//       headers: {
//         "x-api-key": API_CONFIG.LOTUS_API_KEY || "",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(customerData),
//     })

//     if (!response.ok) {
//       throw new Error("Failed to create Customer on Lotus")
//     }
//     const lotusResponse = await response.json()
//     const invasResponse = await fetch(`${API_CONFIG.BASE_URL}/customers`, {
//       method: "POST",
//       headers: {
//         "X-API-Key": API_CONFIG.API_KEY || "",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         externalCustomerId: lotusResponse.data.reference,
//         externalUserId: customerData.externalUserId,
//         name: customerData.name ? customerData.name : `${customerData.firstName} ${customerData.lastName}`,
//         firstName: customerData.firstName,
//         lastName: customerData.lastName,
//         company: customerData.company,
//         email: customerData.email,
//         phone: customerData.phone,
//         companyName: customerData.companyName,
//         address: customerData.address,
//       }),
//     })

//     return await invasResponse.json()
//   } catch (error) {
//     console.error("invas Error creating Customer on Lotus:", error)
//     throw error
//   }
// }

// export async function fetchCustomer(userId: string, metadata: CustomerData): Promise<CustomerVerifyResponse>{
//   try {
//     const response = await fetch(`${API_CONFIG.BASE_URL}/customers/user/${userId}`, {
//       method: "GET",
//       headers: {
//         "X-API-Key": API_CONFIG.API_KEY || "",
//         "Content-Type": "application/json",
//       },
//     })

//     if (!response.ok) {
//       console.log("Failed to fetch customer", response.json())
//       const lotusResponse = await createLotusCustomer(metadata)
//       if(lotusResponse.success){
//         return lotusResponse
//       }
//       // throw new Error("Failed to fetch customer")
//     }

//     const data = await response.json()
//     return data || []

//   } catch (error) {
//     console.error("invas Error fetching customer:", error)
//     throw error
//   }
// }

export async function postFetchCustomer(userId: string, metadata?: CustomerData): Promise<CustomerVerifyResponse> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/customers`, {
      method: "POST",
      headers: {
        "X-API-Key": API_CONFIG.API_KEY || "",
        "Content-Type": "application/json",
      },
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


/**
 * Creates a customer in Lotus first, then creates a corresponding customer in your system
 * using the Lotus reference number as the external customer ID
 */
export async function createLotusCustomer(
  customerData: CustomerData
): Promise<CustomerVerifyResponse> {
  try {
    console.log("Customer Full data", {
      customerData
    })
    // Step 1: Create customer in Lotus
    const lotusResponse = await fetch(`${API_CONFIG.LOTUS_BASE_URL}/customer`, {
      method: "POST",
      headers: {
        "x-api-key": API_CONFIG.LOTUS_API_KEY || "",

        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address_one: customerData.address,
        category: "payment",
        city: customerData.city || "VI",
        country: customerData.country || "Nigeria",
        email: customerData.email,
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        phone: customerData.phone,
        state: customerData.state || "Lagos",
        zip_code: customerData.zipCode || "100001",
      }),
    })

    if (!lotusResponse.ok) {
      const errorData = await lotusResponse.json().catch(() => ({}))
      throw new Error(
        `Failed to create customer in Lotus: ${lotusResponse.status} - ${
          errorData.message || lotusResponse.statusText
        }`
      )
    }

    const lotusData = await lotusResponse.json()
    
    if (!lotusData?.data?.reference) {
      throw new Error("Lotus response missing reference number")
    }

    console.log("Customer created in Lotus:", {
      reference: lotusData.data.reference,
      email: customerData.email,
    })

    // Step 2: Create customer in your system with Lotus reference
    const invasResponse = await fetch(`${API_CONFIG.BASE_URL}/customers`, {
      method: "POST",
      headers: {
        "X-API-Key": API_CONFIG.API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        externalCustomerId: lotusData.data.reference,
        externalUserId: customerData.id,
        name: customerData.name || `${customerData.firstName} ${customerData.lastName}`,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        company: customerData.company,
        email: customerData.email,
        phone: customerData.phone,
        companyName: customerData.company,
        address: customerData.address,
        currentPlanId: customerData.planId,
        metadata: customerData
      }),
    })

    if (!invasResponse.ok) {
      const errorData = await invasResponse.json().catch(() => ({}))
      console.error("Failed to create customer in system:", {
        status: invasResponse.status,
        error: errorData,
        lotusReference: lotusData.data.reference,
      })
      
      // Customer was created in Lotus but failed in our system
      // You might want to handle this case specially
      throw new Error(
        `Customer created in Lotus (ref: ${lotusData.data.reference}) but failed to create in system: ${
          errorData.message || invasResponse.statusText
        }`
      )
    }

    const invasData = await invasResponse.json()
    
    console.log("Customer created successfully:", {
      lotusReference: lotusData.data.reference,
      customerId: invasData.data?.id,
    })

    return invasData

  } catch (error) {
    console.error("Error in createLotusCustomer:", error)
    throw error
  }
}

/**
 * Fetches a customer by userId. If not found, creates a new customer in both
 * Lotus and your system using the provided metadata
 */
export async function fetchCustomer(
  userId: string,
  metadata?: CustomerData
): Promise<CustomerVerifyResponse> {
  try {
    // Step 1: Try to fetch existing customer
    console.log(`Fetching customer for userId: ${userId}`)
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/customers/user/${userId}`, {
      method: "GET",
      headers: {
        "X-API-Key": API_CONFIG.API_KEY || "",
        "Content-Type": "application/json",
      },
    })

    // Step 2: If customer exists, return it
    if (response.ok) {
      const data = await response.json()
      console.log("Customer found:", { userId, customerId: data.data?.id })
      return data
    }

    // Step 3: If customer not found (404), create new customer
    if (response.status === 404) {
      console.log("Customer not found, creating new customer...")
      
      if (!metadata) {
        throw new Error(
          "Customer not found and no metadata provided to create new customer"
        )
      }

      // Validate required fields for customer creation
      if (!metadata.email) {
        throw new Error("Email is required to create a new customer")
      }

      if (!metadata.firstName || !metadata.lastName) {
        throw new Error("First name and last name are required to create a new customer")
      }

      // Create customer in Lotus and then in your system
      const newCustomer = await createLotusCustomer(metadata)
      
      console.log("New customer created successfully:", {
        userId,
        customerId: newCustomer.data?.id,
      })

      return newCustomer
    }

    // Step 4: Handle other error responses
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      `Failed to fetch customer: ${response.status} - ${
        errorData.message || response.statusText
      }`
    )

  } catch (error) {
    console.error("Error in fetchCustomer:", error)
    throw error
  }
}

/**
 * Higher-level function that handles the entire fetch-or-create flow
 * with better error messages and fallback handling
 */
export async function getOrCreateCustomer(
  userId: string,
  customerData: CustomerData
): Promise<CustomerVerifyResponse> {
  try {
    return await fetchCustomer(userId, customerData)
  } catch (error) {
    // Log the full error for debugging
    console.error("Failed to get or create customer:", {
      userId,
      email: customerData.email,
      error: error instanceof Error ? error.message : error,
    })

    // Return a user-friendly error response
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to process customer",
      // data: ,
    }
  }
}