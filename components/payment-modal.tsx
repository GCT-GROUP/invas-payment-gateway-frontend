"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PLAN } from "@/lib/constants"
import { UserData } from "@/lib/types"

interface PaymentModalProps {
  plan: PLAN
  billing: string
  onClose: () => void
  onSuccess: (transactionId: string) => void
  userId?: string
  userData?: UserData
}

export default function PaymentModal({ 
  plan, 
  billing,
  onClose, 
  onSuccess,
  userId,
  userData 
}: PaymentModalProps) {
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    company: userData?.company || "",
    address: userData?.address || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill form if userData is provided
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        company: userData.company || "",
        address: userData.address || "",
      })
    }
  }, [userData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Include userId in the payment request if provided
      const paymentData = {
        ...formData,
        planId: plan.id,
        amount: plan.amount,
        userId: userId, // Include userId from URL params
      }

      // Make API call to initiate payment
      const response = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Payment initiation failed")
      }

      // Redirect to payment gateway or handle success
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl
      } else {
        onSuccess(data.transactionId)
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border dark:border-primary rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b dark:border-primary p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Plan Summary */}
          <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold text-accent">
              ₦{typeof plan.amount === 'number' ? plan.amount.toLocaleString() : plan.amount}
            </p>
            <p className="text-sm text-foreground mt-1">Billed {billing}</p>
          </div>

          {/* Show user ID if provided */}
          {/* {userId && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">User ID: {userId}</p>
            </div>
          )} */}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="border-[#0059c6]"
                  disabled={!!userData?.firstName} // Disable if pre-filled
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="border-[#0059c6]"
                  disabled={!!userData?.lastName}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-[#0059c6]"
                disabled={!!userData?.email}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border-[#0059c6]"
                disabled={!!userData?.phone}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="border-[#0059c6]"
                disabled={!!userData?.company}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border-[#0059c6]"
                disabled={!!userData?.address}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-accent hover:bg-accent/90 text-primary"
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}