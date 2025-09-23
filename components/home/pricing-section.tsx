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
      popular: false,
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
      popular: true,
    },
  ]

  return (
    <section id="tarifs" className="py-20 px-4 bg-muted/20">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">Tarifs simples et transparents</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Paye seulement ce que tu utilises. Aucun engagement, résilie quand tu veux !
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass-light rounded-3xl p-8 relative ${plan.popular ? "ring-2 ring-primary scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="gradient-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                    Le plus populaire
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="w-5 h-5 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.popular ? "gradient-primary text-white border-0" : "glass-light"}`}
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
