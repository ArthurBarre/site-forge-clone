'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Loader2, Check, X, ExternalLink, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DeploymentStatus } from '@/components/chat/deployment-status'
import { PaymentModal } from '@/components/chat/payment-modal'

interface DeployModalProps {
  currentChat: {
    id: string
    demo?: string
    url?: string
  } | null
  onDeploy?: (domain: string) => void
}

interface DomainCheckResult {
  domain: string
  available: boolean
  price?: string
  tld: string
}

export function DeployModal({ currentChat, onDeploy }: DeployModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<DomainCheckResult[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle')
  const [showPayment, setShowPayment] = useState(false)
  const [domainPrice, setDomainPrice] = useState<number>(0)
  const [domainCurrency, setDomainCurrency] = useState<string>('USD')

  const popularTlds = ['.com', '.fr', '.net', '.org', '.io', '.co', '.app', '.dev']

  const searchDomains = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch('/api/domains/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error('Failed to search domains')
      }

      const data = await response.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error('Error searching domains:', error)
      // Fallback: simulation locale
      const results: DomainCheckResult[] = []
      popularTlds.forEach(tld => {
        const domain = `${query}${tld}`
        const isAvailable = Math.random() > 0.3
        results.push({
          domain,
          available: isAvailable,
          price: isAvailable ? `$${Math.floor(Math.random() * 50) + 10}/an` : undefined,
          tld
        })
      })
      setSearchResults(results)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchDomains(searchQuery)
  }

  const handleDeploy = async (customerInfo?: any) => {
    if (!selectedDomain || !currentChat) return

    setIsDeploying(true)
    setDeployStatus('deploying')

    try {
      // Appeler l'API de déploiement avec les informations du client
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: selectedDomain,
          chatId: currentChat.id,
          demoUrl: currentChat.demo,
          customerInfo,
          paymentMethod: 'stripe' // Par défaut
        }),
      })

      if (response.ok) {
        setDeployStatus('success')
        onDeploy?.(selectedDomain)
        setTimeout(() => {
          setIsOpen(false)
          setDeployStatus('idle')
        }, 2000)
      } else {
        setDeployStatus('error')
      }
    } catch (error) {
      console.error('Deployment error:', error)
      setDeployStatus('error')
    } finally {
      setIsDeploying(false)
    }
  }

  const handleDomainSelect = (domain: string, price: string, currency: string) => {
    setSelectedDomain(domain)
    setDomainPrice(parseFloat(price.replace(/[^\d.]/g, '')))
    setDomainCurrency(currency)
  }

  const resetModal = () => {
    setSearchQuery('')
    setSearchResults([])
    setSelectedDomain(null)
    setDeployStatus('idle')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) resetModal()
    }}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center gap-2"
          disabled={!currentChat?.demo}
        >
          <Globe className="h-4 w-4" />
          Déployer
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Déployer votre site
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Section */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Rechercher un nom de domaine
              </label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="mon-site-web"
                  className="flex-1"
                />
                <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Rechercher'
                  )}
                </Button>
              </form>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Domaines disponibles :</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.domain}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors text-black",
                        result.available
                          ? "border-green-200 bg-green-50 hover:bg-green-100"
                          : "border-red-200 bg-red-50",
                        selectedDomain === result.domain && "ring-2 ring-primary"
                      )}
                      onClick={() => result.available && handleDomainSelect(result.domain, result.price || '0', 'USD')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {result.available ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium">{result.domain}</span>
                        </div>
                        <Badge variant={result.available ? "default" : "destructive"}>
                          {result.available ? "Disponible" : "Indisponible"}
                        </Badge>
                      </div>
                      {result.available && result.price && (
                        <span className="text-sm text-muted-foreground">
                          {result.price}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selected Domain */}
          {selectedDomain && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Domaine sélectionné :</p>
                  <p className="font-medium">{selectedDomain}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDomain(null)}
                >
                  Changer
                </Button>
              </div>
            </div>
          )}

          {/* Deploy Button */}
          {selectedDomain && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Domaine sélectionné :</span>
                  <span className="font-mono">{selectedDomain}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Prix :</span>
                  <span className="font-medium">{domainCurrency} {domainPrice.toFixed(2)}/an</span>
                </div>
              </div>
              
              <Button
                onClick={() => setShowPayment(true)}
                disabled={isDeploying}
                className="w-full"
                size="lg"
              >
                <Globe className="h-4 w-4 mr-2" />
                Acheter et déployer {selectedDomain}
              </Button>

              {/* Status Messages */}
              {deployStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <Check className="h-4 w-4" />
                    <span className="font-medium">Déploiement réussi !</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Votre site est maintenant disponible sur {selectedDomain}
                  </p>
                </div>
              )}

              {deployStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <X className="h-4 w-4" />
                    <span className="font-medium">Erreur de déploiement</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Une erreur s'est produite lors du déploiement. Veuillez réessayer.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Deployment Status */}
          {deployStatus !== 'idle' && currentChat && (
            <DeploymentStatus
              chatId={currentChat.id}
              domain={selectedDomain || undefined}
              status={deployStatus}
              onRetry={() => {
                setDeployStatus('idle')
                setSelectedDomain(null)
              }}
            />
          )}

          {/* Info Section */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Informations importantes :</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Le déploiement peut prendre quelques minutes</li>
              <li>• Votre site sera accessible via le nom de domaine choisi</li>
              <li>• Vous pourrez gérer votre domaine depuis votre tableau de bord</li>
            </ul>
          </div>
        </div>
      </DialogContent>
      
      {/* Payment Modal */}
      <PaymentModal
        domain={selectedDomain || ''}
        price={domainPrice}
        currency={domainCurrency}
        onPayment={handleDeploy}
        isOpen={showPayment}
        onOpenChange={setShowPayment}
      />
    </Dialog>
  )
}
