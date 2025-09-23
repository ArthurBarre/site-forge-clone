import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Clock, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.7_0.15_280_/_0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(0.65_0.2_320_/_0.2),transparent_50%)]" />

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6">
            <span className="text-foreground">Ton site web professionnel</span>
            <span className="gradient-primary bg-clip-text mt-2">en 30 minutes ⚡</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-balance mb-8 leading-relaxed">
            Décris ton projet, SiteForge crée un site complet et prêt à publier.
            <br />
            <span className="text-primary font-semibold">+ Réserve ton nom de domaine directement chez nous !</span>
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>
                Site prêt en <strong className="text-primary">30 minutes</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span>
                <strong className="text-primary">Sans engagement</strong> - Crée quand tu veux
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="gradient-primary text-white border-0 hover:opacity-90 text-lg px-8 py-6">
              Créer mon site maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="glass-light text-lg px-8 py-6 bg-transparent">
              <Play className="mr-2 w-5 h-5" />
              Voir la démo vidéo
            </Button>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-4 border border-border/50">
              <div className="bg-black rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                {/* Video placeholder - replace with actual video */}
                <video
                  className="w-full h-full object-cover rounded-lg"
                  poster="/siteforge-product-demo-video-thumbnail.jpg"
                  controls
                  preload="metadata"
                >
                  <source src="/demo-video.mp4" type="video/mp4" />
                  {/* Fallback for browsers that don't support video */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                    <div className="text-center">
                      <div className="w-16 h-16 gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-white font-semibold">Vidéo de présentation SiteForge</p>
                      <p className="text-white/80 text-sm">Découvre comment créer ton site en 30 minutes</p>
                    </div>
                  </div>
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
