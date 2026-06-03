"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PLAN } from "@/lib/constants"
import { UserData, PcGlobalPaymentDetails } from "@/lib/types"
import { initiatePayment } from "@/lib/api-client"

interface PaymentModalProps {
  plan: PLAN
  billing: string
  onClose: () => void
  onSuccess: (transactionId: string) => void
  userData?: UserData
  paymentDetails?: PcGlobalPaymentDetails 
}

export default function PaymentModal({ 
  plan, 
  billing,
  onClose, 
  onSuccess,
  userData,
  paymentDetails
}: Readonly<PaymentModalProps>) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    populateFormData()
  }, [userData])

  const populateFormData = () => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || paymentDetails?.user.phone_number || "",
        company: userData.companyName || userData.company || paymentDetails?.business.name || "",
        address: userData.address || "",
        // paymentMethod: PAYMENT_METHOD.CARD,
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  console.log("cHECKING pLAN ", plan )
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const paymentData = {
        ...formData,
        billing_cycle: billing, 
        planId: plan.id,
        amount: plan.amount,
        userId: userData?.paystackId
      }

      const response = await initiatePayment(userData?.paystackId || undefined, paymentData.planId || undefined, paymentData)

      if (response.success && response.data) {
        const { checkoutUrl, transactionId } = response.data
        
        // Open checkout in new tab
        window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
        
        // Redirect current page to confirmation to call success callback
        onSuccess(transactionId)
      } else {
        setError(response.message || "Payment initiation failed")
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
          <Button onClick={onClose} variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors hover:bg-transparent hover:border hover:border-[#0F3633]">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6">
          {/* Plan Summary */}
          <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold text-accent">
              {/* ₦{typeof plan.amount === 'number' ? plan.amount.toLocaleString() : plan.amount} */}
              ₦{Number(plan?.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })}
              {/* ₦{Number(paymentDetails?.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })} */}
              {/* ₦{calculateBilledAmount().toLocaleString()} */}
              {billing === "annually" && " (17% discount)"}
            </p>
            <p className="text-sm text-foreground mt-1">Billed {billing} {billing === "annually" && " (17% discount)"}</p>
          </div>

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
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="border-[#0059c6]" disabled={!!userData?.firstName}/>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="border-[#0059c6]" disabled={!!userData?.lastName}/>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="border-[#0059c6]" disabled={!!userData?.email}/>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="border-[#0059c6]" disabled={!!userData?.phone}/>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input id="company" name="company" value={formData.company} onChange={handleChange} className="border-[#0059c6]" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Address (Optional)</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} className="border-[#0059c6]"/>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 hover:border hover:border-red-600 hover:bg-transparent hover:text-red-600" disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-[#08D000] to-[#0F3633] hover:from-[#0F3633] hover:to-[#0F3633] text-white" disabled={loading}>
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}