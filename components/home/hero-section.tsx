'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Clock, Zap } from "lucide-react"
import { redirect } from "next/navigation"
import { Globe } from "@/components/ui/globe"
import { BoxReveal } from "@/components/ui/box-reveal"
import { NumberTicker } from "@/components/ui/number-ticker"

export function HeroSection() {
  return (
    <section className="h-[100vh] flex flex-col justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.7_0.15_280_/_0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(0.65_0.2_320_/_0.2),transparent_50%)]" />

      <div className="container mx-auto text-center relative z-10 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto mt-20">
          <BoxReveal boxColor="oklch(0.7 0.15 280)" duration={0.6} delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-balance mb-3 md:mb-4 lg:mb-6">
              <span className="text-foreground">Ton site web professionnel</span>
              <span className="gradient-primary bg-clip-text mt-1 block">en 30 minutes ⚡</span>
            </h1>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.65 0.2 320)" duration={0.6} delay={0.3}>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground text-balance mb-4 md:mb-5 lg:mb-6 leading-relaxed px-2">
              Décris ton projet, SiteForge crée un site complet et prêt à publier.
              <br className="hidden sm:block" />
              <span className="text-primary font-semibold block sm:inline mt-1 sm:mt-0">+ Réserve ton nom de domaine directement chez nous !</span>
            </p>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.6 0.18 200)" duration={0.5} delay={0.5}>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-5 md:mb-6 lg:mb-8 text-sm lg:text-base px-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0" />
                <span className="text-center">
                  Site prêt en <strong className="text-primary">30 minutes</strong>
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0" />
                <span className="text-center">
                  <strong className="text-primary">Sans engagement</strong> - Crée quand tu veux
                </span>
              </div>
            </div>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.7 0.15 280)" duration={0.6} delay={0.7}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center items-center mb-4 md:mb-5 lg:mb-6 px-4">
              <Button onClick={() => redirect("/app")} size="lg" className="gradient-primary text-white border-0 hover:opacity-90 text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 cursor-pointer w-full sm:w-auto">
                Créer mon site maintenant
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </Button>
              <Button variant="outline" size="lg" className="glass-light text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-transparent w-full sm:w-auto">
                <Play className="mr-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                Voir la démo vidéo
              </Button>
            </div>
          </BoxReveal>

          <BoxReveal boxColor="oklch(0.65 0.2 320)" duration={0.5} delay={0.9}>
            <div className="text-center mb-3 md:mb-4 lg:mb-6">
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-1 px-4">
                Déjà <span className="text-primary font-semibold">
                  <NumberTicker 
                    value={127} 
                    className="text-lg md:text-xl lg:text-2xl font-bold text-primary"
                  />
                </span> sites créés avec SiteForge
              </p>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground px-4">
                Essaye toi aussi gratuitement ! 
              </p>
            </div>
          </BoxReveal>
        </div>
        <div className="absolute bottom-[40px] right-[-50px] z-100 w-auto h-auto">
          <Globe 
            className="w-[220px] h-[40vw] max-h-[340px] sm:w-[200px] sm:h-[36vw] md:w-[240px] md:h-[32vw] lg:w-[300px] lg:h-[28vw] xl:w-[340px] xl:h-[24vw] mx-auto opacity-60 blur-[1px]"
          />
        </div>
      </div>
  
    </section>
  )
}
