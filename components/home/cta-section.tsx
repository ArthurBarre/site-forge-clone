import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket } from "lucide-react"
import { GridBeams } from "@/components/ui/grid-beams"

export function CTASection() {
  return (
    <section className="relative overflow-hidden">
      <GridBeams
      className="py-20 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-balance mb-6">
              Ton site en ligne dans <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">30 minutes</span> 🚀
            </h2>

            <p className="text-xl md:text-2xl text-white/90 text-balance mb-10 leading-relaxed max-w-3xl mx-auto">
              Rejoins des milliers d'entrepreneurs qui ont déjà créé leur site avec l'IA
            </p>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-10 py-6 font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Créer mon site gratuit
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <p className="text-white/70 mt-6 text-sm md:text-base">Aucune carte bancaire requise • Site en ligne en 30 minutes</p>
          </div>
        </div>
      </GridBeams>
    </section>
  )
}
