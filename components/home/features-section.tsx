import { Zap, Palette, Edit3, Globe, Shield, CreditCard } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: "Ultra rapide",
      description: "De l'idée au site en minutes.",
    },
    {
      icon: Palette,
      title: "Design élégant",
      description: "Sections modernes et responsives.",
    },
    {
      icon: Edit3,
      title: "Édite facilement",
      description: "Modifie chaque section par phrase simple.",
    },
    {
      icon: Globe,
      title: "Nom de domaine",
      description: "Réserve ton .fr ou .com directement chez nous en 1 clic.",
    },
    {
      icon: Shield,
      title: "SSL inclus",
      description: "Sécurisé et pro sans effort.",
    },
    {
      icon: CreditCard,
      title: "Sans engagement",
      description: "Crée, modifie ou supprime tes sites quand tu veux.",
    },
  ]

  return (
    <section id="fonctionnalites" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">Tout ce dont tu as besoin</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Une solution complète pour créer et gérer ton site web
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="glass-light rounded-2xl p-8 hover:scale-105 transition-all duration-300 group">
              <div className="w-14 h-14 gradient-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
