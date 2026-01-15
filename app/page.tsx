"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/header"
import PricingPage from "@/components/pricing-page"
import Footer from "@/components/footer"
import { fetchCustomer } from "@/lib/api-client"

interface UserData {
  firstName?: string
  lastName?: string
  company?: string
  email?: string
  address?: string
  phone?: string
}

export default function Home() {
  const searchParams = useSearchParams()
  const [userData, setUserData] = useState<UserData | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  
  // Extract user ID from URL parameters
  const userId = searchParams.get("userId") || searchParams.get("user_id") || undefined

  // Extract user data from URL parameters
  const urlUserData: UserData = {
    firstName: searchParams.get("first_name") || undefined,
    lastName: searchParams.get("last_name") || undefined,
    company: searchParams.get("company") || undefined,
    email: searchParams.get("email") || undefined,
    address: searchParams.get("address") || undefined,
    phone: searchParams.get("phone") || undefined,
  }

  // Check if URL has any user data
  const hasUrlUserData = Object.values(urlUserData).some(value => value !== undefined)

  // Load customer data when userId is available
  useEffect(() => {
    if (userId) {
      loadCustomer()
    } else if (hasUrlUserData) {
      // If no userId but URL has user data, use URL data directly
      setUserData(urlUserData)
      console.log("Using URL user data:", urlUserData)
    }
  }, [userId, hasUrlUserData])

  const loadCustomer = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      const response = await fetchCustomer(userId)
      console.log("API Response 12:", response)

      if (response.success && response.data) {
        // Map API response to userData format
        const apiData: UserData = {
          firstName: response.data.name?.split(' ')[0] || response.data.firstName,
          lastName: response.data.name?.split(' ').slice(1).join(' ') || response.data.lastName,
          company: response.data.companyName || response.data.company,
          email: response.data.email,
          address: response.data.address,
          phone: response.data.phone,
        }
        console.log("API Response Data:", apiData)
        
        // Merge URL data with API data, API data takes precedence
        const mergedData: UserData = {
          firstName: apiData.firstName || urlUserData.firstName,
          lastName: apiData.lastName || urlUserData.lastName,
          company: apiData.company || urlUserData.company,
          email: apiData.email || urlUserData.email,
          address: apiData.address || urlUserData.address,
          phone: apiData.phone || urlUserData.phone,
        }
        
        setUserData(mergedData)
        console.log("User Data loaded (merged):", mergedData)
      } else {
        // If API fails but we have URL data, use URL data
        if (hasUrlUserData) {
          setUserData(urlUserData)
          console.log("API failed, using URL user data:", urlUserData)
        }
        console.warn("Failed to load customer data:", response.message)
      }
    } catch (error) {
      console.error("Error loading customer:", error)
      // If API call fails but we have URL data, use URL data as fallback
      if (hasUrlUserData) {
        setUserData(urlUserData)
        console.log("Error occurred, falling back to URL user data:", urlUserData)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />
      <PricingPage userId={userId} userData={userData}/>
      {/* // loading={loading} */}
      <Footer />
    </main>
  )
}