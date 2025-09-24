'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DeploymentStatusProps {
  chatId: string
  domain?: string
  status?: 'deploying' | 'success' | 'error' | 'idle'
  onRetry?: () => void
}

export function DeploymentStatus({ 
  chatId, 
  domain, 
  status = 'idle',
  onRetry 
}: DeploymentStatusProps) {
  const [deploymentInfo, setDeploymentInfo] = useState<{
    domain: string
    url: string
    status: string
    deployedAt: string
  } | null>(null)

  useEffect(() => {
    // Charger les informations de déploiement depuis l'API
    const loadDeploymentInfo = async () => {
      try {
        const response = await fetch(`/api/deployments/${chatId}`)
        if (response.ok) {
          const data = await response.json()
          setDeploymentInfo(data)
        }
      } catch (error) {
        console.error('Error loading deployment info:', error)
      }
    }

    if (chatId && status === 'success') {
      loadDeploymentInfo()
    }
  }, [chatId, status])

  if (status === 'idle' || !domain) {
    return null
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'deploying':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'deploying':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'deploying':
        return 'Déploiement en cours...'
      case 'success':
        return 'Déployé avec succès'
      case 'error':
        return 'Erreur de déploiement'
      default:
        return 'En attente'
    }
  }

  return (
    <div className="p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium">Statut du déploiement</span>
        </div>
        <Badge className={cn("text-xs", getStatusColor())}>
          {getStatusText()}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Domaine :</span>
          <span className="font-mono text-sm">{domain}</span>
        </div>

        {status === 'success' && deploymentInfo && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">URL :</span>
              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                https://{domain}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Déployé le :</span>
              <span className="text-sm">
                {new Date(deploymentInfo.deployedAt).toLocaleString('fr-FR')}
              </span>
            </div>
          </>
        )}

        {status === 'error' && (
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="w-full"
            >
              Réessayer le déploiement
            </Button>
          </div>
        )}

        {status === 'deploying' && (
          <div className="mt-3">
            <div className="text-xs text-muted-foreground">
              Le déploiement peut prendre quelques minutes. Vous serez notifié une fois terminé.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
