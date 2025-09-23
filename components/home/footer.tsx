import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="bg-muted/20 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">SiteIA</span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              La plateforme qui révolutionne la création de sites web. Créez votre présence en ligne en quelques minutes
              avec l'intelligence artificielle.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Produit</h3>
            <ul className="space-y-3">
              <li>
                <a href="#fonctionnalites" className="text-muted-foreground hover:text-foreground transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#tarifs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Démo
                </a>
              </li>
              <li>
                <a href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/aide" className="text-muted-foreground hover:text-foreground transition-colors">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="/status" className="text-muted-foreground hover:text-foreground transition-colors">
                  Statut
                </a>
              </li>
              <li>
                <a href="/communaute" className="text-muted-foreground hover:text-foreground transition-colors">
                  Communauté
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">© 2025 SiteIA. Tous droits réservés.</p>
          <div className="flex gap-6 text-sm">
            <a href="/mentions-legales" className="text-muted-foreground hover:text-foreground transition-colors">
              Mentions légales
            </a>
            <a href="/cgu" className="text-muted-foreground hover:text-foreground transition-colors">
              CGU
            </a>
            <a href="/confidentialite" className="text-muted-foreground hover:text-foreground transition-colors">
              Confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
