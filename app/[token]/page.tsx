"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/header"
import PricingPage from "@/components/pricing-page"
import Footer from "@/components/footer"
import Faqs from "@/components/faqs"
import { validateToken } from "@/lib/api-client"
import { UserData, PcGlobalPaymentDetails } from "@/lib/types"

export default function TokenPage() {
    const params = useParams()
    const token = params.token as string

    const [userData, setUserData] = useState<UserData | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [paymentDetails, setPaymentDetails] = useState<PcGlobalPaymentDetails | undefined>(undefined)

    useEffect(() => {
        if (token) {
            loadTokenData()
        }
    }, [token])

    const loadTokenData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Validate and decode the token
            const response = await validateToken(token)

            if (response.success && response.data) {
                setUserData(response.data.customer)
                setPaymentDetails(response.data.paymentLinkData)
            } else {
                setError(response.message || "Invalid or expired token")
            }
        } catch (err) {
            console.error("Error loading token data:", err)
            setError("An error occurred while validating your token")
        } finally {
            setLoading(false)
        }
    }

    // Show loading state
    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-background to-muted">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center">
                    <p className="text-lg">Loading...</p>
                </div>
                <Footer />
            </main>
        )
    }

    // Show error state - doesn't allow plan selection
    if (error || !userData) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-background to-muted">
                <Header />
                <div className="container mx-auto px-4 py-20 text-center mt-[11rem]">
                    <div className="max-w-lg mx-auto bg-destructive/10 border border-destructive rounded-lg p-8">
                        <h1 className="text-2xl font-bold text-destructive mb-4">Invalid Token</h1>
                        <p className="text-muted-foreground text-lg">
                            The token you provided is invalid or has expired.
                            <br />
                            <span className="font-semibold text-primary">Please request a new link.</span>
                            {/* <br/> */}
                            {/* {error && <span className="text-destructive"> {error}</span>} */}
                        </p>
                    </div>
                </div>
                <Faqs />
                <Footer />
            </main>
        )
    }

    // Valid token - show pricing page
    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted">
            <Header />
                <PricingPage userData={userData} paymentDetails={paymentDetails} />
            <Faqs />
            <Footer />
        </main>
    )
}