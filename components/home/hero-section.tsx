'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Clock, Zap } from "lucide-react"
import { redirect } from "next/navigation"
import { Globe } from "@/components/ui/globe"
import { BoxReveal } from "@/components/ui/box-reveal"
import { NumberTicker } from "@/components/ui/number-ticker"

export function HeroSection() {
  return (
    <section className="pt-20 md:pt-32 pb-12 md:pb-20 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.7_0.15_280_/_0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(0.65_0.2_320_/_0.2),transparent_50%)]" />

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <BoxReveal boxColor="oklch(0.7 0.15 280)" duration={0.6} delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-balance mb-4 md:mb-6">
              <span className="text-foreground">Ton site web professionnel</span>
              <span className="gradient-primary bg-clip-text mt-2 block">en 30 minutes ⚡</span>
            </h1>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.65 0.2 320)" duration={0.6} delay={0.3}>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground text-balance mb-6 md:mb-8 leading-relaxed px-2">
              Décris ton projet, SiteForge crée un site complet et prêt à publier.
              <br className="hidden sm:block" />
              <span className="text-primary font-semibold block sm:inline mt-2 sm:mt-0">+ Réserve ton nom de domaine directement chez nous !</span>
            </p>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.6 0.18 200)" duration={0.5} delay={0.5}>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 mb-8 md:mb-10 text-sm px-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-center">
                  Site prêt en <strong className="text-primary">30 minutes</strong>
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-center">
                  <strong className="text-primary">Sans engagement</strong> - Crée quand tu veux
                </span>
              </div>
            </div>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.7 0.15 280)" duration={0.6} delay={0.7}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 md:mb-8 px-4">
              <Button onClick={() => redirect("/app")} size="lg" className="gradient-primary text-white border-0 hover:opacity-90 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 cursor-pointer w-full sm:w-auto">
                Créer mon site maintenant
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button variant="outline" size="lg" className="glass-light text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-transparent w-full sm:w-auto">
                <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Voir la démo vidéo
              </Button>
            </div>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.65 0.2 320)" duration={0.5} delay={0.9}>
            <div className="text-center mb-12 md:mb-16">
              <p className="text-base md:text-lg text-muted-foreground mb-2 px-4">
                Déjà <span className="text-primary font-semibold">
                  <NumberTicker 
                    value={127} 
                    className="text-xl md:text-2xl font-bold text-primary"
                  />
                </span> sites créés avec SiteForge
              </p>
              <p className="text-xs md:text-sm text-muted-foreground px-4">
                Essaye toi aussi gratuitement ! 
              </p>
            </div>
          </BoxReveal>
        </div>
      </div>
      
      {/* Globe Section */}
      <div className="relative max-w-4xl mx-auto mt-6 md:mt-8 px-4">
        <div className="relative z-10">
          <Globe />
        </div>
      </div>
    </section>
  )
}
