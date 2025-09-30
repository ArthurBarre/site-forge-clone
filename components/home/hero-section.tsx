'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Clock, Zap } from "lucide-react"
import { redirect } from "next/navigation"
import { BoxReveal } from "@/components/ui/box-reveal"
import { NumberTicker } from "@/components/ui/number-ticker"

export function HeroSection() {
  return (
    <section className="min-h-[100vh] flex flex-col justify-center px-4 py-12 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.7_0.15_280_/_0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(0.65_0.2_320_/_0.2),transparent_50%)]" />

      <div className="container mx-auto text-center relative z-10 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
          <BoxReveal boxColor="oklch(0.7 0.15 280)" duration={0.6} delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-balance">
              <span className="text-foreground">Ton site web professionnel</span>
              <span className="gradient-primary bg-clip-text mt-2 block">en 30 minutes ⚡</span>
            </h1>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.65 0.2 320)" duration={0.6} delay={0.3}>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground text-balance leading-relaxed px-2">
              Décris ton projet, SiteForge crée un site complet et prêt à publier.
              <br className="hidden sm:block" />
              <span className="text-primary font-semibold block sm:inline mt-2 sm:mt-0">+ Réserve ton nom de domaine directement chez nous !</span>
            </p>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.6 0.18 200)" duration={0.5} delay={0.5}>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 text-sm md:text-base lg:text-lg px-4">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
                <span className="text-center">
                  Site prêt en <strong className="text-primary">30 minutes</strong>
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
                <span className="text-center">
                  <strong className="text-primary">Sans engagement</strong> - Crée quand tu veux
                </span>
              </div>
            </div>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.7 0.15 280)" duration={0.6} delay={0.7}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-center px-4">
              <Button onClick={() => redirect("/app")} size="lg" className="gradient-primary text-white border-0 hover:opacity-90 text-base sm:text-lg md:text-xl lg:text-2xl px-8 sm:px-10 md:px-12 lg:px-14 py-4 sm:py-5 md:py-6 lg:py-7 cursor-pointer w-full sm:w-auto">
                Créer mon site maintenant
                <ArrowRight className="ml-3 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
              </Button>
              <Button
                className="cursor-pointer w-full sm:w-auto"
                variant="glass-white"
                size="lg"
              >
                <Play className="mr-3 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
                Voir la démo vidéo
              </Button>
            </div>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.65 0.2 320)" duration={0.5} delay={0.9}>
            <div className="text-center">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-2 px-4">
                Déjà <span className="text-primary font-semibold">
                  <NumberTicker 
                    value={127} 
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-primary"
                  />
                </span> sites créés avec SiteForge
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground px-4">
                Essaye toi aussi gratuitement ! 
              </p>
            </div>
          </BoxReveal>
        </div>
      </div>
  
    </section>
  )
}
