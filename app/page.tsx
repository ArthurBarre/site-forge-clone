import { Header } from "@/components/home/header"
import { HeroSection } from "@/components/home/hero-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { FeaturesSection } from "@/components/home/features-section"
import { PricingSection } from "@/components/home/pricing-section"
import { FAQSection } from "@/components/home/faq-section"
import { CTASection } from "@/components/home/cta-section"
import { Footer } from "@/components/home/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="space-y-20">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
