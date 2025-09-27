'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  MessageSquare,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Users,
  Lock,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Chat {
  id: string
  name?: string
  privacy?: 'public' | 'private' | 'team' | 'team-edit' | 'unlisted'
  createdAt: string
  url?: string
}

// Helper function to get display name for a chat
const getChatDisplayName = (chat: Chat): string => {
  return chat.name || `Conversation ${chat.id.slice(0, 8)}...`
}

// Helper function to get privacy icon
const getPrivacyIcon = (privacy: string) => {
  switch (privacy) {
    case 'public':
      return <Eye className="h-4 w-4" />
    case 'private':
      return <EyeOff className="h-4 w-4" />
    case 'team':
    case 'team-edit':
      return <Users className="h-4 w-4" />
    case 'unlisted':
      return <Lock className="h-4 w-4" />
    default:
      return <EyeOff className="h-4 w-4" />
  }
}

// Helper function to get privacy display name
const getPrivacyDisplayName = (privacy: string) => {
  switch (privacy) {
    case 'public':
      return 'Public'
    case 'private':
      return 'Privé'
    case 'team':
      return 'Équipe'
    case 'team-edit':
      return 'Équipe (modification)'
    case 'unlisted':
      return 'Non listé'
    default:
      return 'Privé'
  }
}

export function ChatSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false)
  const [renameChatName, setRenameChatName] = useState('')
  const [selectedVisibility, setSelectedVisibility] = useState<
    'public' | 'private' | 'team' | 'team-edit' | 'unlisted'
  >('private')
  const [isRenamingChat, setIsRenamingChat] = useState(false)
  const [isDeletingChat, setIsDeletingChat] = useState(false)
  const [isDuplicatingChat, setIsDuplicatingChat] = useState(false)
  const [isChangingVisibility, setIsChangingVisibility] = useState(false)

  // Get current chat ID if on a chat page
  const currentChatId = pathname?.startsWith('/chats/')
    ? pathname.split('/')[2]
    : null

  // Fetch user's chats
  useEffect(() => {
    if (!session?.user?.id) return

    const fetchChats = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/chats')
        if (response.ok) {
          const data = await response.json()
          setChats(data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch chats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChats()
  }, [session?.user?.id])

  const handleValueChange = (chatId: string) => {
    router.push(`/chats/${chatId}`)
  }

  const handleRenameChat = async () => {
    if (!renameChatName.trim() || !currentChatId) return

    setIsRenamingChat(true)
    try {
      const response = await fetch(`/api/chats/${currentChatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: renameChatName.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to rename chat')
      }

      const updatedChat = await response.json()

      // Update the chat in the list
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId ? { ...c, name: updatedChat.name } : c,
        ),
      )

      // Close dialog and reset form
      setIsRenameDialogOpen(false)
      setRenameChatName('')
    } catch (error) {
      console.error('Error renaming chat:', error)
    } finally {
      setIsRenamingChat(false)
    }
  }

  const handleDeleteChat = async () => {
    if (!currentChatId) return

    setIsDeletingChat(true)
    try {
      const response = await fetch(`/api/chats/${currentChatId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete chat')
      }

      // Remove the chat from the list
      setChats((prev) => prev.filter((c) => c.id !== currentChatId))

      // Close dialog and navigate to home
      setIsDeleteDialogOpen(false)
      router.push('/app')
    } catch (error) {
      console.error('Error deleting chat:', error)
    } finally {
      setIsDeletingChat(false)
    }
  }

  const handleDuplicateChat = async () => {
    if (!currentChatId) return

    setIsDuplicatingChat(true)
    try {
      const response = await fetch('/api/chat/fork', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId: currentChatId }),
      })

      if (!response.ok) {
        throw new Error('Failed to duplicate chat')
      }

      const result = await response.json()

      // Close dialog and navigate to the new forked chat
      setIsDuplicateDialogOpen(false)
      router.push(`/chats/${result.id}`)
    } catch (error) {
      console.error('Error duplicating chat:', error)
    } finally {
      setIsDuplicatingChat(false)
    }
  }

  const handleChangeVisibility = async () => {
    if (!currentChatId) return

    setIsChangingVisibility(true)
    try {
      const response = await fetch(`/api/chats/${currentChatId}/visibility`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ privacy: selectedVisibility }),
      })

      if (!response.ok) {
        throw new Error('Failed to change chat visibility')
      }

      const updatedChat = await response.json()

      // Update the chat in the list
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId ? { ...c, privacy: updatedChat.privacy } : c,
        ),
      )

      // Close dialog
      setIsVisibilityDialogOpen(false)
    } catch (error) {
      console.error('Error changing chat visibility:', error)
    } finally {
      setIsChangingVisibility(false)
    }
  }

  // Don't show if user is not authenticated
  if (!session?.user?.id) return null

  const currentChat = currentChatId
    ? chats.find((c) => c.id === currentChatId)
    : null

  return (
    <>
      <div className="flex items-center gap-1">
        <Select value={currentChatId || ''} onValueChange={handleValueChange}>
          <SelectTrigger
            className="w-fit min-w-[150px] max-w-[250px]"
            size="sm"
          >
            <SelectValue placeholder="Select chat">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">
                  {currentChat
                    ? getChatDisplayName(currentChat)
                    : 'Sélectionner un site'}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {chats.length > 0 ? (
              chats.slice(0, 15).map((chat) => (
                <SelectItem key={chat.id} value={chat.id}>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="truncate">{getChatDisplayName(chat)}</span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Pas de sites encore
              </div>
            )}
          </SelectContent>
        </Select>

        {/* Chat Context Menu */}
        {currentChat && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={
                  isRenamingChat ||
                  isDeletingChat ||
                  isDuplicatingChat ||
                  isChangingVisibility
                }
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Options du site</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuItem asChild>
                <a
                  href={`https://v0.app/chat/${currentChatId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on v0.dev
                </a>
              </DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                onClick={() => setIsDuplicateDialogOpen(true)}
                disabled={
                  isRenamingChat ||
                  isDeletingChat ||
                  isDuplicatingChat ||
                  isChangingVisibility
                }
              >
                <Copy className="mr-2 h-4 w-4" />
                Dupliquer le site
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedVisibility(currentChat.privacy || 'private')
                  setIsVisibilityDialogOpen(true)
                }}
                disabled={
                  isRenamingChat ||
                  isDeletingChat ||
                  isDuplicatingChat ||
                  isChangingVisibility
                }
              >
                {getPrivacyIcon(currentChat.privacy || 'private')}
                <span className="ml-2">Changer la visibilité</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRenameChatName(currentChat.name || '')
                  setIsRenameDialogOpen(true)
                }}
                disabled={
                  isRenamingChat ||
                  isDeletingChat ||
                  isDuplicatingChat ||
                  isChangingVisibility
                }
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Renommer le site
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={
                  isRenamingChat ||
                  isDeletingChat ||
                  isDuplicatingChat ||
                  isChangingVisibility
                }
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer le site
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Rename Chat Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer la conversation</DialogTitle>
            <DialogDescription>
              Entrez un nouveau nom pour ce site.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nom de la conversation"
              value={renameChatName}
              onChange={(e) => setRenameChatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isRenamingChat) {
                  handleRenameChat()
                }
              }}
              disabled={isRenamingChat}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRenameDialogOpen(false)
                setRenameChatName('')
              }}
              disabled={isRenamingChat}
            >
              Annuler
            </Button>
            <Button
              onClick={handleRenameChat}
              disabled={isRenamingChat || !renameChatName.trim()}
            >
              {isRenamingChat ? 'Renommage en cours...' : 'Renommer la conversation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Chat Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la conversation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action ne peut
              pas être annulée et supprimera définitivement la conversation et tous ses
              messages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeletingChat}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteChat}
              disabled={isDeletingChat}
            >
              {isDeletingChat ? 'Suppression en cours...' : 'Supprimer la conversation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Chat Dialog */}
      <Dialog
        open={isDuplicateDialogOpen}
        onOpenChange={setIsDuplicateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dupliquer la conversation</DialogTitle>
            <DialogDescription>
              Cette action créera une copie de la conversation actuelle. Vous serez redirigé
              vers la nouvelle conversation une fois créée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDuplicateDialogOpen(false)}
              disabled={isDuplicatingChat}
            >
              Annuler
            </Button>
            <Button onClick={handleDuplicateChat} disabled={isDuplicatingChat}>
              {isDuplicatingChat ? 'Duplication en cours...' : 'Dupliquer la conversation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Visibility Dialog */}
      <Dialog
        open={isVisibilityDialogOpen}
        onOpenChange={setIsVisibilityDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer la visibilité de la conversation</DialogTitle>
            <DialogDescription>
              Choisissez qui peut voir et accéder à cette conversation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedVisibility}
              onValueChange={(
                value: 'public' | 'private' | 'team' | 'team-edit' | 'unlisted',
              ) => setSelectedVisibility(value)}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getPrivacyIcon(selectedVisibility)}
                    <span>{getPrivacyDisplayName(selectedVisibility)}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    <div>
                      <div>Privé</div>
                      <div className="text-xs text-muted-foreground">
                        Seul vous pouvez voir cette conversation
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <div>
                      <div>Public</div>
                      <div className="text-xs text-muted-foreground">
                        Tout le monde peut voir cette conversation
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="team">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <div>
                      <div>Équipe</div>
                      <div className="text-xs text-muted-foreground">
                        Les membres de l'équipe peuvent voir cette conversation
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="team-edit">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <div>
                      <div>Équipe (modification)</div>
                      <div className="text-xs text-muted-foreground">
                        Les membres de l'équipe peuvent voir et modifier cette conversation
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="unlisted">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <div>
                      <div>Non listé</div>
                      <div className="text-xs text-muted-foreground">
                        Seuls les personnes avec le lien peuvent voir cette conversation
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsVisibilityDialogOpen(false)}
              disabled={isChangingVisibility}
            >
              Annuler
            </Button>
            <Button
              onClick={handleChangeVisibility}
              disabled={isChangingVisibility}
            >
              {isChangingVisibility ? 'Modification en cours...' : 'Changer la visibilité'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
