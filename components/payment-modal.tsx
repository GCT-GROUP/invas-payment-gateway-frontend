"use client"

import type React from "react"
import { useState } from "react"
import { X, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { initiatePayment } from "@/lib/api-client"

interface Plan {
  id: string
  externalPlanId: string
  name: string
  amount: number
  currency: string
}

interface PaymentModalProps {
  plan: Plan
  onClose: () => void
  onSuccess: (transactionId: string) => void
}

export default function PaymentModal({ plan, onClose, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    userId: "user_" + Date.now(),
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await initiatePayment(formData.userId, plan.externalPlanId || plan.id, {
        source: "web",
        planName: plan.name,
        amount: plan.amount,
        email: formData.email,
        fullName: formData.fullName,
      })

      if (!response.success || !response.data?.transactionId) {
        throw new Error(response.message || "Payment initiation failed. Please try again.")
      }

      const transactionId = response.data.transactionId
      console.log("invas Payment initiated with transaction ID:", transactionId)

      // Call success callback
      onSuccess(transactionId)
    } catch (err) {
      console.error("invas Payment error:", err)
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Complete Payment</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Plan Summary */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">{plan.name} Plan</span>
              <span className="font-bold text-lg text-accent">
                {plan.amount.toLocaleString()} {plan.currency}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Billed monthly</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="4242 4242 4242 4242"
                // maxLength="19"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  // maxLength="5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  // maxLength="4"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 text-primary h-12">
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₦${plan.amount}`
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your payment information is secure and encrypted
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
