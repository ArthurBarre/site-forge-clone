import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  const faqs = [
    {
      question: "Comment fonctionnent les prix ?",
      answer:
        "C'est simple : 20€ pour créer un site complet, ou 200€ par an pour des sites illimités. Aucun engagement, tu peux arrêter quand tu veux et garder tes sites en ligne.",
    },
    {
      question: "Puis-je réserver mon nom de domaine chez vous ?",
      answer:
        "Oui ! Tu peux réserver ton .fr, .com ou autre extension directement sur SiteForge. Plus besoin de jongler entre plusieurs plateformes, tout se fait en un endroit.",
    },
    {
      question: "Puis-je modifier chaque section ?",
      answer:
        "Absolument ! Tu peux modifier chaque section de ton site en décrivant simplement ce que tu veux changer. L'IA comprend tes instructions et met à jour le contenu instantanément.",
    },
    {
      question: "Y a-t-il un essai gratuit ?",
      answer:
        "Oui ! Le plan gratuit te permet de créer un site complet avec un sous-domaine. Tu peux tester toutes les fonctionnalités avant de passer à un plan payant.",
    },
    {
      question: "Puis-je résilier quand je veux ?",
      answer:
        "Bien sûr ! Aucun engagement. Tu peux créer des sites quand tu veux, les supprimer quand tu veux. Avec le plan annuel, tu peux résilier à tout moment.",
    },
    {
      question: "Mes sites sont-ils optimisés pour mobile ?",
      answer:
        "Tous les sites générés sont automatiquement responsives et optimisés pour mobile, tablette et desktop. L'IA s'assure que ton site fonctionne parfaitement sur tous les appareils.",
    },
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background gradients - même que features */}
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
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">Questions fréquentes</h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Tout ce que tu dois savoir sur SiteForge
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="glass-light rounded-2xl px-6 border-0">
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
