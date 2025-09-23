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
      description: "Avec ton domaine et SSL auto.",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">Comment ça marche ?</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Trois étapes simples pour avoir ton site en ligne
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 gradient-primary rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
