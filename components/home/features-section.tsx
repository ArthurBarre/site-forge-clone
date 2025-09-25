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
    <section id="fonctionnalites" className="py-20 px-4 relative overflow-hidden">
      {/* Background gradients - plus subtils que la section précédente */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-slate-50/30 to-background dark:via-slate-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,oklch(0.6_0.18_200_/_0.06),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,oklch(0.7_0.15_280_/_0.04),transparent_60%)]" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">Tout ce dont tu as besoin</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Une solution complète pour créer et gérer ton site web
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              {/* Card background with subtle effects */}
              <div className="absolute inset-0 bg-white/3 dark:bg-white/3 rounded-2xl group-hover:bg-white/8 dark:group-hover:bg-white/8 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/5 dark:to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 border border-white/10 dark:border-white/10 rounded-2xl group-hover:border-white/20 dark:group-hover:border-white/20 transition-colors duration-300" />
              
              <div className="relative p-8">
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md group-hover:shadow-lg">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
