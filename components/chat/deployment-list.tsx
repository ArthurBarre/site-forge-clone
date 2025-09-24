'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Globe, Calendar, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Deployment {
  id: string
  domain: string
  url: string
  status: 'deployed' | 'failed' | 'pending'
  deployedAt: string
  chatId: string
}

interface DeploymentListProps {
  chatId: string
  onDeploy?: () => void
}

export function DeploymentList({ chatId, onDeploy }: DeploymentListProps) {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDeployments()
  }, [chatId])

  const loadDeployments = async () => {
    try {
      const response = await fetch(`/api/deployments/${chatId}`)
      if (response.ok) {
        const data = await response.json()
        setDeployments(Array.isArray(data) ? data : [data])
      }
    } catch (error) {
      console.error('Error loading deployments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDeployment = async (deploymentId: string) => {
    try {
      const response = await fetch(`/api/deployments/${deploymentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDeployments(prev => prev.filter(d => d.id !== deploymentId))
      }
    } catch (error) {
      console.error('Error deleting deployment:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'Déployé'
      case 'failed':
        return 'Échec'
      case 'pending':
        return 'En cours'
      default:
        return 'Inconnu'
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Chargement des déploiements...
      </div>
    )
  }

  if (deployments.length === 0) {
    return (
      <div className="p-6 text-center">
        <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucun déploiement</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Déployez votre site pour le rendre accessible au public
        </p>
        <Button onClick={onDeploy} className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Déployer maintenant
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Déploiements</h3>
        <Button onClick={onDeploy} size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Nouveau déploiement
        </Button>
      </div>

      <div className="space-y-3">
        {deployments.map((deployment) => (
          <div
            key={deployment.id}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{deployment.domain}</span>
                </div>
                <Badge className={cn("text-xs", getStatusColor(deployment.status))}>
                  {getStatusText(deployment.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(deployment.url, '_blank')}
                  disabled={deployment.status !== 'deployed'}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteDeployment(deployment.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(deployment.deployedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>URL:</span>
                <a
                  href={deployment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {deployment.url}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
