"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PricingToggle from "@/components/pricing-toggle"
import PricingCard from "@/components/pricing-card"
import PaymentModal from "@/components/payment-modal"
import { fetchPlans } from "@/lib/api-client"
import { Loader } from "lucide-react"
import { getDemoPlans, PLAN } from "@/lib/constants"

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [plans, setPlans] = useState<PLAN[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PLAN | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadPlans()
  }, [])

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
      console.error("invas Error loading plans:", err)
      // Use demo data as fallback
      setPlans(getDemoPlans())
      setError("Using demo plans. Connect to API for live pricing.")
    } finally {
      setLoading(false)
    }
  }

  const getYearlyPrice = (monthlyPrice: number | string): number => {
    // Convert to number if it's a string
    const numericPrice = typeof monthlyPrice === 'string' ? parseFloat(monthlyPrice) : monthlyPrice
    
    // Return 0 if invalid, otherwise calculate yearly with 17% discount
    if (isNaN(numericPrice)) return 0
    return Math.floor(numericPrice * 10) // 17% discount for yearly
  }

  const handleSelectPlan = (plan: PLAN) => {
    const baseAmount = typeof plan.amount === 'string' ? parseFloat(plan.amount) : plan.amount
    const finalAmount = billingPeriod === "yearly" ? getYearlyPrice(plan.amount) : baseAmount
    
    setSelectedPlan({
      ...plan,
      amount: finalAmount,
    })
    setShowPayment(true)
  }

  const handlePaymentSuccess = (transactionId: string) => {
    // Redirect to success page or dashboard
    router.push(`/success?transaction=${transactionId}`)
  }

  return (
    <section id="pricing" className="py-10 md:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-8">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 gap-20 mb-12">
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isPopular={plan.isPopular}
                onSelect={() => handleSelectPlan(plan)}
                billingPeriod={billingPeriod}
                yearlyPrice={getYearlyPrice(plan.amount)}
              />
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 rounded-lg p-8 border border-accent border-l-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Can I change my plan later?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-foreground">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, debit cards, and bank transfers for eligible regions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Contact our sales team to discuss free trial options for enterprise plans.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <PaymentModal plan={selectedPlan} onClose={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />
      )}
    </section>
  )
}
