"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, XCircle, Clock, Loader2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { verifyPayment } from "@/lib/api-client"
import { PAYMENT_STATUS, SUPPORT_EMAIL } from "@/lib/constants"
import Link from "next/link"


interface PaymentDetails {
  transactionId: string
  status: string
  amount: number
  plan?: string
  planId: string
  billing?: string
  paymentMethod?: string
  createdAt?: string
  updatedAt?: string
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const transactionId = searchParams.get("transaction")

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!transactionId) {
      setError("No transaction ID provided")
      setLoading(false)
      return
    }

    // Only verify once on mount
    verifyTransaction()
  }, [transactionId])

  const verifyTransaction = async () => {
    if (!transactionId) return

    try {
      setIsRefreshing(true)
      const response = await verifyPayment(transactionId)

      if (response.success && response.data) {
        console.log("Payment details:", response.data)
        setPaymentDetails(response.data)
        setError(null)
      } else {
        setError(response.message || "Failed to verify payment")
      }
    } catch (err: any) {
      console.error("Verification error:", err)
      setError(err.message || "Unable to verify payment")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleManualRefresh = () => {
    verifyTransaction()
  }

  const getStatusIcon = () => {
    if (!paymentDetails) return null

    switch (paymentDetails.status) {
      case PAYMENT_STATUS.SUCCESS:
        return <CheckCircle2 className="w-20 h-20 text-green-500" />
      case PAYMENT_STATUS.FAILED:
        return <XCircle className="w-20 h-20 text-red-500" />
      case PAYMENT_STATUS.PENDING:
      case PAYMENT_STATUS.PROCESSING:
        return <Clock className="w-20 h-20 text-yellow-500 animate-pulse" />
      default:
        return null
    }
  }

  const getStatusMessage = () => {
    if (!paymentDetails) return ""

    switch (paymentDetails.status) {
      case PAYMENT_STATUS.SUCCESS:
        return "Payment Successful!"
      case PAYMENT_STATUS.FAILED:
        return "Payment Failed"
      case PAYMENT_STATUS.PENDING:
        return "Payment Pending"
      case PAYMENT_STATUS.PROCESSING:
        return "Processing Payment..."
      default:
        return "Unknown Status"
    }
  }

  const getStatusDescription = () => {
    if (!paymentDetails) return ""

    switch (paymentDetails.status) {
      case PAYMENT_STATUS.SUCCESS:
        return "Thank you for your purchase. Your subscription is now active and a confirmation email has been sent to your registered email address."
      case PAYMENT_STATUS.FAILED:
        return "Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists."
      case PAYMENT_STATUS.PENDING:
        return "Your payment is pending confirmation. Please click 'Refresh Status' to check for updates."
      case PAYMENT_STATUS.PROCESSING:
        return "We're processing your payment. Please click 'Refresh Status' in a moment to check the updated status."
      default:
        return ""
    }
  }

  // Loading state
  if (loading && !paymentDetails) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <Loader2 className="w-16 h-16 animate-spin text-accent mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Verifying your payment...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Error state (no payment details)
  if (error && !paymentDetails) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-card border border-destructive rounded-2xl shadow-2xl p-8 text-center">
            <XCircle className="w-20 h-20 text-destructive mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Error</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push("/")} className="w-full bg-accent hover:bg-accent/90 text-primary">
                <Home className="w-4 h-4 mr-2" /> Back to Pricing
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Main payment status display
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-card border dark:border-primary rounded-2xl shadow-2xl p-8">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>

          {/* Status Title */}
          <h1 className="text-3xl font-bold text-center text-foreground mb-4">
            {getStatusMessage()}
          </h1>

          {/* Status Description */}
          <p className="text-center text-muted-foreground mb-8">
            {getStatusDescription()}
          </p>

          {/* Transaction ID */}
          {transactionId && (
            <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transaction ID</span>
                <span className="text-sm font-mono font-semibold text-foreground">
                  {transactionId.length > 20 ? `${transactionId.slice(0, 20)}...` : transactionId}
                </span>
              </div>
            </div>
          )}

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-6 space-y-3">
              <p className="text-sm font-semibold text-foreground mb-3">Payment Details</p>
              
              {paymentDetails.plan && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="text-sm font-semibold text-foreground">
                    {paymentDetails.plan}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-semibold text-accent">
                  ₦{paymentDetails.amount.toLocaleString()}
                </span>
              </div>

              {paymentDetails.billing && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Billing</span>
                  <span className="text-sm font-semibold text-foreground capitalize">
                    {paymentDetails.billing}
                  </span>
                </div>
              )}

              {/* {paymentDetails.paymentMethod && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="text-sm font-semibold text-foreground capitalize">
                    {paymentDetails.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
              )} */}

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`text-sm font-semibold capitalize ${paymentDetails.status === PAYMENT_STATUS.SUCCESS ? "text-green-500" : "text-red-500"}`}>
                  {paymentDetails.status}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {paymentDetails?.status === PAYMENT_STATUS.SUCCESS && (
              <>
                <Button onClick={() => globalThis.location.href = "https://invas.me"}className="w-full bg-accent hover:bg-accent/90 text-primary">
                  Go to Dashboard
                </Button>
                <Button  onClick={() => router.push("https://invas.me/")}  variant="outline" className="w-full">
                  Back to Home
                </Button>
              </>
            )}

            {paymentDetails?.status === PAYMENT_STATUS.FAILED && (
              <>
                <Button onClick={() => router.push("/#pricing")} className="w-full bg-accent hover:bg-accent/90 text-primary">
                  Try Again
                </Button>
                <Link href={`mailto:${SUPPORT_EMAIL}`}>
                  <Button onClick={() => router.push("/support")}  variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </Link>

              </>
            )}

            {(paymentDetails?.status === PAYMENT_STATUS.PENDING || paymentDetails?.status === PAYMENT_STATUS.PROCESSING) && (
              <>
                <Button  onClick={handleManualRefresh}  className="w-full bg-accent hover:bg-accent/90 text-primary" disabled={isRefreshing}>
                  {isRefreshing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Refresh Status"
                  )}
                </Button>
                <Button  onClick={() => router.push("https://invas.me/")}  variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </>
            )}
          </div>

          {/* Manual refresh hint for pending/processing */}
          {(paymentDetails?.status === PAYMENT_STATUS.PENDING || paymentDetails?.status === PAYMENT_STATUS.PROCESSING) && (
            <p className="text-xs text-center text-muted-foreground mt-4">
              Click "Refresh Status" to check for updates
            </p>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}