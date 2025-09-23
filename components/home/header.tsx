'use client'

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">SiteForge</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#fonctionnalites" className="text-muted-foreground hover:text-foreground transition-colors">
            Fonctionnalités
          </a>
          <a href="#tarifs" className="text-muted-foreground hover:text-foreground transition-colors">
            Tarifs
          </a>
          <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
            Démo
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              window.location.href = "/auth/login"
            }}
          >
            Se connecter
          </Button>
          <Button
            size="sm"
            className="gradient-primary text-white border-0 hover:opacity-90"
            onClick={() => {
              window.location.href = "/auth/register"
            }}
          >
            Essayer gratuitement
          </Button>
        </div>
      </div>
    </header>
  )
}
