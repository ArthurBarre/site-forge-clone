import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  WebPreviewBody,
} from '@/components/ai-elements/web-preview'
import { RefreshCw, Monitor, Maximize, Minimize, ExternalLink, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeploymentModal } from '@/components/deploy/deployment-modal'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

// Adapter pour traduire les statuts de déploiement
const getDeploymentStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    'deployed': 'Déployé',
    'undeployed': 'Retiré',
    'draft': 'Brouillon',
    'failed': 'Échec',
    'building': 'Construction',
    'ready': 'Prêt'
  }
  return statusMap[status] || status
}

// Adapter pour les couleurs de statut
const getDeploymentStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'deployed': 'text-green-700 dark:text-green-300',
    'undeployed': 'text-gray-600 dark:text-gray-400',
    'draft': 'text-yellow-700 dark:text-yellow-300',
    'failed': 'text-red-700 dark:text-red-300',
    'building': 'text-blue-700 dark:text-blue-300',
    'ready': 'text-green-700 dark:text-green-300'
  }
  return colorMap[status] || 'text-gray-700 dark:text-gray-300'
}

// Adapter pour les couleurs de point de statut
const getDeploymentStatusDotColor = (status: string) => {
  const dotColorMap: Record<string, string> = {
    'deployed': 'bg-green-500',
    'undeployed': 'bg-gray-400',
    'draft': 'bg-yellow-500',
    'failed': 'bg-red-500',
    'building': 'bg-blue-500 animate-pulse',
    'ready': 'bg-green-500'
  }
  return dotColorMap[status] || 'bg-gray-500'
}

interface Chat {
  id: string
  demo?: string
  url?: string
  deployUrl?: string
  deploymentStatus?: string
  lastDeployedAt?: string
}

interface PreviewPanelProps {
  currentChat: Chat | null
  isFullscreen: boolean
  setIsFullscreen: (fullscreen: boolean) => void
  refreshKey: number
  setRefreshKey: (key: number | ((prev: number) => number)) => void
  projectId?: string
  chatId?: string
  name?: string
  latestVersionId?: string
  onDeploymentSuccess?: () => void
  onUndeploy?: () => void
}

export function PreviewPanel({
  currentChat,
  isFullscreen,
  setIsFullscreen,
  refreshKey,
  setRefreshKey,
  projectId,
  chatId,
  name,
  latestVersionId,
  onDeploymentSuccess,
  onUndeploy,
}: PreviewPanelProps) {
  return (
    <div
      className={cn(
        'flex flex-col h-full transition-all duration-300',
        isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-black' : 'flex-1',
      )}
    >
      <WebPreview
        defaultUrl={currentChat?.demo || ''}
        onUrlChange={(url) => {
          // Optional: Handle URL changes if needed
          console.log('Preview URL changed:', url)
        }}
      >
        <WebPreviewNavigation className="justify-between">
          <div className="flex items-center gap-2">
            <WebPreviewNavigationButton
              className="cursor-pointer"
              onClick={() => {
                // Force refresh the iframe by updating the refresh key
                setRefreshKey((prev) => prev + 1)
              }}
              tooltip="Refresh preview"
              disabled={!currentChat?.demo}
            >
              <RefreshCw className="h-4 w-4" />
            </WebPreviewNavigationButton>
            {/* Deploy/Visit Buttons */}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Deployment Status */}
            {currentChat?.deploymentStatus && (
              <div className="flex flex-row items-center justify-center px-3 py-1 rounded shadow-sm border border-muted">
                {currentChat.lastDeployedAt && (
                  <div className="text-[11px] text-muted-foreground mr-3">
                    Déployé le&nbsp;
                    <span className="font-medium">
                      {new Date(currentChat.lastDeployedAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    &nbsp;à&nbsp;
                    <span className="font-medium">
                      {new Date(currentChat.lastDeployedAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
                <span className={`text-xs font-semibold ${getDeploymentStatusColor(currentChat.deploymentStatus)} flex items-center gap-2`}>
                  <span className={`inline-block w-2 h-2 rounded-full ${getDeploymentStatusDotColor(currentChat.deploymentStatus)} mr-1`} />
                  {getDeploymentStatusLabel(currentChat.deploymentStatus)}
                </span>
              </div>
            )}
            {currentChat?.deployUrl ? (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => window.open(currentChat.deployUrl, '_blank')}
                  className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                  size="sm"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  Visiter
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={onUndeploy}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Retirer du web
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {currentChat?.demo ? (
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded border border-yellow-200 dark:border-yellow-800">
                      Brouillon
                    </div>
                    <Button
                      onClick={() => window.open(currentChat.demo, '_blank')}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Voir le brouillon
                    </Button>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    Aucun déploiement
                  </div>
                )}
                <DeploymentModal 
                  projectId={projectId || ''} 
                  chatId={chatId} 
                  name={name} 
                  latestVersionId={latestVersionId}
                  onDeploymentSuccess={onDeploymentSuccess}
                />
              </div>
            )}
            
            <WebPreviewNavigationButton
              className="cursor-pointer"
              onClick={() => setIsFullscreen(!isFullscreen)}
              tooltip={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              disabled={!currentChat?.demo}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </WebPreviewNavigationButton>
          </div>
        </WebPreviewNavigation>
        {currentChat?.demo ? (
          <WebPreviewBody key={refreshKey} src={currentChat.demo} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-black">
            <img
              src="/loader-preview.gif"
              alt="Loading preview..."
              className="w-100 h-100"
            />
          </div>
        )}
      </WebPreview>
    </div>
  )
}
