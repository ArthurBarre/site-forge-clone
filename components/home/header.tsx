'use client'

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50 bg-background">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
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
          <Link
            href="/login"
            className="cursor-pointer text-white hover:text-primary hover:underline"
          >
            Se connecter
          </Link>
          <Button
            size="sm"
            className="gradient-primary text-white border-0 hover:opacity-80 cursor-pointer"
            onClick={() => {
              window.location.href = "/register"
            }}
          >
            Essayer gratuitement
          </Button>
        </div>
      </div>
    </header>
  )
}
