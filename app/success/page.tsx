"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, AlertCircle, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { verifyPayment } from "@/lib/api-client"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PaymentDetails } from "@/lib/types"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const transactionId = searchParams.get("transaction")
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!transactionId) {
        setError("No transaction ID provided")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await verifyPayment(transactionId)

        if (response.success && response.data) {
          setPaymentDetails(response.data)
        } else {
          setError(response.message || "Failed to verify payment")
        }
      } catch (err) {
        console.error("invas Verification error:", err)
        if (transactionId) {
          setPaymentDetails({
            transactionId,
            status: "pending_verification",
            amount: 0,
            planId: "",
          })
        } else {
          setError("Unable to verify payment")
        }
      } finally {
        setLoading(false)
      }
    }

    verifyTransaction()
  }, [transactionId])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-8 h-8 animate-spin text-accent" />
            <p className="text-muted-foreground">Verifying your payment...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-card rounded-2xl border border-border shadow-2xl p-8 text-center">
          {error ? (
            <>
              <AlertCircle className="w-20 h-20 text-destructive mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-2">Payment Failed</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="space-y-3">
                <Button onClick={() => router.back()} className="w-full bg-accent hover:bg-accent/90 text-primary">
                  Try Again
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Pricing
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <CheckCircle className="w-20 h-20 text-accent mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your purchase. Your subscription is now active.
              </p>

              {transactionId && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                  <p className="font-mono text-sm text-foreground break-all">{transactionId}</p>
                </div>
              )}

              {paymentDetails && paymentDetails.status !== "pending_verification" && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-muted-foreground mb-2">Payment Details</p>
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Amount:</span> ₦{paymentDetails.amount}
                    </p>
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Status:</span>{" "}
                      <span className="capitalize text-accent">{paymentDetails.status}</span>
                    </p>
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground mb-6">
                A confirmation email has been sent to your registered email address.
              </p>

              <div className="space-y-3">
                <Button className="w-full bg-accent hover:bg-accent/90 text-primary">Go to Dashboard</Button>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
