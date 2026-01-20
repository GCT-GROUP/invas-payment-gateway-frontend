"use client"
import { Check, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PLAN } from "@/lib/constants"

interface PricingCardProps {
  plan: PLAN
  isPopular?: boolean
  onSelect: () => void
  billingPeriod: "monthly" | "yearly"
  yearlyPrice?: number
  disabled?: boolean
  isSelected?: boolean
}

export default function PricingCard({ 
  plan, 
  isPopular, 
  onSelect, 
  billingPeriod, 
  yearlyPrice,
  disabled,
  isSelected = false
}: PricingCardProps) {
  const featureList = Array.isArray(plan.features) ? plan.features : Object.keys(plan.features)

  const rawPrice = billingPeriod === "yearly" && yearlyPrice ? yearlyPrice : plan.amount
  const numericPrice = typeof rawPrice === 'string' ? parseFloat(rawPrice) : rawPrice
  const displayPrice = isNaN(numericPrice) ? 0 : numericPrice
  // const displayPrice = billingPeriod === "yearly" && yearlyPrice ? yearlyPrice : plan.amount
  
  return (
    <div
      className={`relative rounded-xl sm:rounded-2xl border transition-all duration-300 hover:border-accent w-full ${
        isPopular 
          ? "border-accent bg-card shadow-xl sm:shadow-2xl sm:scale-105" 
          : "border-[#0059c6]/40 bg-card hover:shadow-lg"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="bg-accent text-primary px-3 py-1 sm:px-4 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
            Most Popular
          </span>
        </div>
      )}

      <div className="p-4 sm:p-6 md:p-8">
        {/* Plan Name */}
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">
          {plan.name}
        </h3>

        {/* Price */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-baseline flex-wrap gap-1">
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
              ₦{displayPrice.toLocaleString()}
            </span>
            <span className="text-sm sm:text-base text-muted-foreground">
              /{billingPeriod === "yearly" ? "year" : "month"}
            </span>
          </div>
          {billingPeriod === "yearly" && (
            <p className="text-xs sm:text-sm text-accent mt-1 sm:mt-2">
              17% savings with yearly billing
            </p>
          )}
        </div>

        {/* CTA Button */}
        <Button
          onClick={onSelect}
          className={`w-full mb-6 sm:mb-8 h-10 sm:h-11 text-sm sm:text-base ${
            isPopular
              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
              : "bg-accent hover:bg-accent/90 text-primary"
          }`}
          disabled={disabled}
        >
          Select Plan
        </Button>

        {/* Features List */}
        <div className="space-y-3 sm:space-y-4">
          {plan.description && (
            <div className="flex items-center justify-center text-center underline underline-offset-4 decoration-accent pb-2">
              <span className="gradient-text font-semibold text-sm sm:text-base">
                {plan.description}
              </span>
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 ml-1" />
            </div>
          )}
          
          {featureList.map((feature, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base text-foreground leading-relaxed">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}