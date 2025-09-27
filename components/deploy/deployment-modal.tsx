'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Loader2, Rocket, X } from 'lucide-react'
import { toast } from 'sonner'

interface DeploymentModalProps {
  projectId: string
  chatId?: string
  name?: string
  latestVersionId?: string
  onDeploymentSuccess?: () => void
}

interface DeploymentData {
  deployment: any
  deploymentData: any
  logs: any
  vercelProjectId?: string
  vercelProjectName?: string
  message?: string
}

export function DeploymentModal({ projectId, chatId, name, latestVersionId, onDeploymentSuccess }: DeploymentModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deploymentData, setDeploymentData] = useState<DeploymentData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [projectName, setProjectName] = useState(name || '')

  const handleDeploy = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Starting deployment for project:', projectId)
      
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, chatId, name: projectName, latestVersionId }),
      })

      const data = await response.json()
      console.log('Deployment response:', data)

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to create deployment')
      }

              setDeploymentData(data)
              
              // Show success toast and close modal
              toast.success("Déploiement réussi ! 🚀", {
                description: "Votre site a été déployé avec succès sur Vercel.",
                duration: 5000,
              })
              
              // Trigger refresh of chat data
              if (onDeploymentSuccess) {
                onDeploymentSuccess()
              }
              
              // Close modal after successful deployment
              setIsOpen(false)
    } catch (err) {
      console.error('Deployment error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const formatLogs = (logs: any) => {
    if (!logs) return 'No logs available'
    if (typeof logs === 'string') return logs
    if (Array.isArray(logs)) return logs.join('\n')
    return JSON.stringify(logs, null, 2)
  }

  return (
    <>
      <Button
        onClick={handleDeploy}
        disabled={isLoading}
        className="gradient-primary text-white border-0 hover:opacity-90 cursor-pointer"
        size="sm"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Déploiement en cours...
          </>
        ) : (
          <>
            <Rocket className="mr-2 h-4 w-4" />
            Déployer
          </>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Déploiement
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Project Name Input */}
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Nom du projet Vercel
              </label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="mon-projet-awesome"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Le nom sera automatiquement nettoyé et un timestamp sera ajouté
              </p>
            </div>
            {deploymentData && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  <strong>Deployment ID:</strong> {deploymentData.deployment?.id}
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Status:</strong> {deploymentData.deploymentData?.status || 'Unknown'}
                </div>
                {deploymentData.vercelProjectId && (
                  <div className="text-sm text-green-600 dark:text-green-400">
                    <strong>Vercel Project:</strong> {deploymentData.vercelProjectName || deploymentData.vercelProjectId}
                  </div>
                )}
                {deploymentData.message && (
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Info:</strong> {deploymentData.message}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <div className="flex items-center gap-2 text-destructive">
                  <X className="h-4 w-4" />
                  <span className="font-medium">Erreur de déploiement</span>
                </div>
                <p className="text-sm text-destructive mt-1">{error}</p>
              </div>
            )}

            <div className="border rounded-md">
              <div className="bg-muted px-4 py-2 border-b">
                <h3 className="font-medium">Logs</h3>
              </div>
              <ScrollArea className="h-96">
                <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                  {deploymentData ? formatLogs(deploymentData.logs) : 'Aucun log disponible'}
                </pre>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
