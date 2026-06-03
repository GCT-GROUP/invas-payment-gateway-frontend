"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PricingToggle from "@/components/pricing-toggle"
import PricingCard from "@/components/pricing-card"
import PaymentModal from "@/components/payment-modal"
import { fetchPlans } from "@/lib/api-client"
import { Loader } from "lucide-react"
import { getDemoPlans, PLAN } from "@/lib/constants"
import { UserData, PcGlobalPaymentDetails } from "@/lib/types"

interface PricingPageProps {
  userData?: UserData
  paymentDetails?: PcGlobalPaymentDetails
  disabled?: boolean
}

export default function PricingPage({ userData, paymentDetails, disabled }: Readonly<PricingPageProps>) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly")
  const [plans, setPlans] = useState<PLAN[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PLAN | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const router = useRouter()

  // Load plans first
  useEffect(() => {
    loadPlans()
  }, [])

  // Auto-select plan and open modal after plans are loaded
  // useEffect(() => {
  //   // Only proceed if plans are loaded and we have a planId
  //   if (!loading && plans.length > 0 && userData?.planId && userData.planId !== "") {
  //     const plan = getPlanById(userData.planId)
  //     setBillingPeriod(userData.billingCycle as "monthly" | "annually")
  //     if (plan) {
  //       // Auto-select the plan and open modal
  //       handleSelectPlan(plan)
  //     }
  //   }
  // }, [loading, plans, userData?.planId])
  useEffect(() => {
    if (!loading && plans.length > 0 && paymentDetails?.metadata?.plan && paymentDetails?.metadata?.cycle) {
      const plan = plans.find(p => p.name === paymentDetails.metadata.plan)
      // const plan = getPlanById(userData.planId)
      const cycle = paymentDetails.metadata.cycle === "yearly" ? "annually" : paymentDetails.metadata.cycle as "monthly" | "annually"
      console.log("CYSCLEEEE ::  ",cycle)
      setBillingPeriod(cycle)
      if (plan) {
        handleSelectPlan(plan)
      }
    }
  }, [loading, plans, paymentDetails?.metadata?.plan, paymentDetails?.metadata?.cycle])

  // const getPlanById = (id: string): PLAN | null => {
  //   const plan = plans.find(plan => plan.id === id)
  //   if (!plan) {
  //     console.log(`Plan with ID ${id} not found`)
  //     return null
  //   }
  //   return plan
  // }

  const loadPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchPlans()

      if (data && data.length > 0) {
        setPlans(data)
      } else {
        // Fallback to demo data if API returns empty
        setPlans(getDemoPlans())
      }
    } catch (err) {
      console.error("Error loading plans:", err)
      // Use demo data as fallback
      setPlans(getDemoPlans())
      setError("Using demo plans. Connect to API for live pricing.")
    } finally {
      setLoading(false)
    }
  }

  const getYearlyPrice = (monthlyPrice: number | string): number => {
    // Convert to number if it's a string
    const numericPrice = typeof monthlyPrice === 'string' ? Number.parseFloat(monthlyPrice) : monthlyPrice
    
    // Return 0 if invalid, otherwise calculate yearly with 17% discount
    if (Number.isNaN(numericPrice)) return 0
    return Math.floor(numericPrice * 10) // 17% discount for yearly
  }

  const handleSelectPlan = (plan: PLAN) => {
    const baseAmount = typeof plan.amount === 'string' ? Number.parseFloat(plan.amount) : plan.amount
    const finalAmount = billingPeriod === "annually" ? getYearlyPrice(plan.amount) : baseAmount
    
    setSelectedPlan({
      ...plan,
      amount: finalAmount,
    })
    setShowPayment(true)
  }

  const handlePaymentSuccess = (transactionId: string) => {
    // Redirect to success page or dashboard
    router.push(`/confirm?transaction=${transactionId}`)
  }
  console.log("PLAN:: ", selectedPlan)

  return (
    <section id="pricing" className="py-10 md:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1350px] mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-14 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-foreground">Plans & Pricing</h1>
          <p className="text-lg text-muted-foreground mb-8">Choose the perfect plan for your business needs</p>

          {/* Billing Toggle */}
          <PricingToggle billingPeriod={billingPeriod} onToggle={setBillingPeriod} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-8 h-8 animate-spin text-accent" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-accent/10 border border-accent/20 text-foreground p-4 rounded-lg text-center mb-8">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 lg:gap-8 gap-20 mb-12">
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isPopular={plan.isPopular}
                onSelect={() => handleSelectPlan(plan)}
                billingPeriod={billingPeriod}
                yearlyPrice={getYearlyPrice(plan.amount)}
                disabled={disabled}
                // isSelected={userData?.planId === plan.id}
              />
            ))}
          </div>
        )}
      </div>
      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <PaymentModal 
          plan={selectedPlan} 
          onClose={() => setShowPayment(false)} 
          onSuccess={handlePaymentSuccess} 
          billing={billingPeriod}
          userData={userData}
          paymentDetails={paymentDetails}
        />
      )}
    </section>
  )
}