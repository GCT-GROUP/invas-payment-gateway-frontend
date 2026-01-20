"use client"

import Header from "@/components/header"
import PricingPage from "@/components/pricing-page"
import Footer from "@/components/footer"
import Faqs from "@/components/faqs"

export default function Home() {

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />
      <PricingPage disabled={true} />
      <Faqs />
      <Footer />
    </main>
  )
}