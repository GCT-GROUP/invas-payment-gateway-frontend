import Header from "@/components/header"
import PricingPage from "@/components/pricing-page"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />
      <PricingPage />
      <Footer />
    </main>
  )
}
