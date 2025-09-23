import { Monitor, Smartphone } from "lucide-react"

export function DemoPreviewSection() {
  return (
    <section id="demo" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">Aperçu en temps réel</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Voici un site généré en 30 secondes
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Desktop mockup */}
            <div className="glass rounded-3xl p-8 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-muted/50 rounded-lg h-8 flex items-center px-4">
                  <Monitor className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">monsite.fr</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-background to-muted/20 rounded-2xl aspect-video flex items-center justify-center border border-border/50">
                <div className="text-center">
                  <div className="w-20 h-20 gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Monitor className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Site Exemple</h3>
                  <p className="text-muted-foreground">Interface moderne et responsive</p>
                </div>
              </div>
            </div>

            {/* Mobile mockup */}
            <div className="absolute bottom-0 right-8 w-48">
              <div className="glass rounded-3xl p-4">
                <div className="bg-gradient-to-br from-background to-muted/20 rounded-2xl aspect-[9/16] flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <div className="w-12 h-12 gradient-secondary rounded-xl mx-auto mb-4 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-muted-foreground">Version mobile</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
