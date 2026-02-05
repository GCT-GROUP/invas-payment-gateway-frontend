"use client"

import { Button } from "@/components/ui/button"

interface PricingToggleProps {
  billingPeriod: "monthly" | "annually"
  onToggle: (period: "monthly" | "annually") => void
}

export default function PricingToggle({ billingPeriod, onToggle }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
      <Button
        variant={billingPeriod === "monthly" ? "default" : "outline"}
        onClick={() => onToggle("monthly")}
        className={billingPeriod === "monthly" ? "bg-primary text-primary-foreground" : "border border-primary dark:border-primary dark:hover:text-[#0059c6]"}
      >
        Monthly
      </Button>
      <span className="text-sm font-medium text-accent">|</span>
      <Button
        variant={billingPeriod === "annually" ? "default" : "outline"}
        onClick={() => onToggle("annually")}
        className={billingPeriod === "annually" ? "bg-primary text-primary-foreground" : "border border-primary dark:border-primary dark:hover:text-[#0059c6]"}
      >
        Yearly
        <span className="ml-2 text-xs bg-accent text-primary px-2 py-0.5 rounded border border-primary">Save 17%</span>
      </Button>
    </div>
  )
}
