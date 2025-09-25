import { MessageSquare, Sparkles, Globe } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: MessageSquare,
      title: "Décris ton idée",
      description: "Un formulaire rapide, zéro technique.",
    },
    {
      icon: Sparkles,
      title: "L'IA génère ton site",
      description: "Pages modernes et sections prêtes.",
    },
    {
      icon: Globe,
      title: "Tu publies en 1 clic",
      description: "Connecte ton domaine et publie ton site en 1 clic.",
    },
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-background to-slate-100 dark:from-slate-900 dark:via-background dark:to-slate-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,oklch(0.7_0.15_280_/_0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,oklch(0.65_0.2_320_/_0.08),transparent_50%)]" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">Comment ça marche ?</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Trois étapes simples pour avoir ton site en ligne
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center group relative">
              {/* Card background with subtle effects */}
              <div className="absolute inset-0 bg-white/5 dark:bg-white/5 rounded-3xl group-hover:bg-white/10 dark:group-hover:bg-white/10 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/10 dark:to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8">
                <div className="relative mb-6">
                  <div className="w-20 h-20 gradient-primary rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">{step.title}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
