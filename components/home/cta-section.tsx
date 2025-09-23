import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.8_0.1_60_/_0.3),transparent_70%)]" />

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-8 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white text-balance mb-6">
            Ton site en ligne dans 30 minutes 🚀
          </h2>

          <p className="text-xl text-white/80 text-balance mb-10 leading-relaxed max-w-2xl mx-auto">
            Rejoins des milliers d'entrepreneurs qui ont déjà créé leur site avec l'IA
          </p>

          <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 font-bold">
            Créer mon site gratuit
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-white/60 mt-6 text-sm">Aucune carte bancaire requise • Site en ligne en 30 minutes</p>
        </div>
      </div>
    </section>
  )
}
