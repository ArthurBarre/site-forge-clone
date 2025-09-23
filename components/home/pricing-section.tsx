import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "pour toujours",
      features: ["1 site web", "Sous-domaine offert", "Édition limitée", "Support communautaire"],
      cta: "Commencer gratuitement",
      popular: false,
    },
    {
      name: "Par Site",
      price: "20€",
      period: "par site créé",
      features: [
        "1 site web complet",
        "Nom de domaine réservable",
        "Éditions illimitées",
        "Support prioritaire",
        "Analytics incluses",
        "Sans engagement",
      ],
      cta: "Créer un site",
      popular: true,
    },
    {
      name: "Sites Illimités",
      price: "200€",
      period: "par an",
      features: [
        "Sites illimités",
        "Noms de domaine réservables",
        "Éditions illimitées",
        "Support prioritaire",
        "Analytics avancées",
        "Outils avancés",
        "Sans engagement - résilie quand tu veux",
      ],
      cta: "Choisir Illimité",
      popular: false,
    },
  ]

  return (
    <section id="tarifs" className="py-16 md:py-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-4 md:mb-6">Tarifs simples et transparents</h2>
          <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto px-4">
            Paye seulement ce que tu utilises. Aucun engagement, résilie quand tu veux !
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto px-4 md:px-0">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass-light rounded-3xl p-6 md:p-8 relative ${plan.popular ? "ring-2 ring-primary scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="gradient-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Le plus populaire
                  </div>
                </div>
              )}

              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl md:text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2 text-sm md:text-base">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-foreground text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full text-sm md:text-base ${plan.popular ? "gradient-primary text-white border-0" : "glass-light"}`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
