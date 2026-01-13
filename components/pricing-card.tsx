"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Plan {
  id: string
  name: string
  amount: number
  duration: number
  currency: string
  features: Record<string, string> | string[]
  description?: string
}

interface PricingCardProps {
  plan: Plan
  isPopular?: boolean
  onSelect: () => void
  billingPeriod: "monthly" | "yearly"
  yearlyPrice?: number
}

export default function PricingCard({ plan, isPopular, onSelect, billingPeriod, yearlyPrice }: PricingCardProps) {
  const featureList = Array.isArray(plan.features) ? plan.features : Object.keys(plan.features)

  const displayPrice = billingPeriod === "yearly" && yearlyPrice ? yearlyPrice : plan.amount

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 hover:border-accent ${isPopular ? "border-accent bg-card shadow-2xl scale-105" : "border-border bg-card hover:shadow-lg"
        }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-accent text-primary px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
        </div>
      )}

      <div className="p-8">
        {/* Plan Name */}
        <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline">
            {/* <span className="text-5xl font-bold text-accent">₦{displayPrice.toLocaleString()}</span> */}
            <span className="text-5xl font-bold gradient-text">₦{displayPrice.toLocaleString()}</span>
            <span className="text-muted-foreground ml-2">/{billingPeriod === "yearly" ? "year" : "month"}</span>
          </div>
          {billingPeriod === "yearly" && <p className="text-sm text-accent mt-2">17% savings with yearly billing</p>}
        </div>

        {/* CTA Button */}
        <Button
          onClick={onSelect}
          className={`w-full mb-8 ${isPopular
              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
              : "bg-accent hover:bg-accent/90 text-primary"
            }`}
        >
          Select Plan
        </Button>

        {/* Features List */}
        <div className="space-y-4">
          {plan.description && (
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="gradient-text font-semibold">{plan.description}</span>
            </div>
            // <p className="text-accent/90 font-medium">{plan.description}</p>
            // <span className="text-accent font-semibold">{plan.description}</span>
          )}
          {featureList.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
