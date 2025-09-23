'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MessageSquare, Eye, EyeOff, Users, Lock, MoreHorizontal, Edit2, Trash2, Copy } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BorderBeam } from '@/components/ui/border-beam'

interface Chat {
  id: string
  name?: string
  privacy?: 'public' | 'private' | 'team' | 'team-edit' | 'unlisted'
  createdAt: string
  updatedAt: string
  url?: string
  messages?: Array<{
    role: string
    content: string
  }>
}

// Helper function to get display name for a chat
const getChatDisplayName = (chat: Chat): string => {
  return chat.name || `Projet ${chat.id.slice(0, 8)}...`
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

export function ProjectTiles() {
  const { data: session } = useSession()
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false)
  const [renameChatName, setRenameChatName] = useState('')
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [selectedVisibility, setSelectedVisibility] = useState<
    'public' | 'private' | 'team' | 'team-edit' | 'unlisted'
  >('private')
  const [isRenamingChat, setIsRenamingChat] = useState(false)
  const [isDeletingChat, setIsDeletingChat] = useState(false)
  const [isDuplicatingChat, setIsDuplicatingChat] = useState(false)
  const [isChangingVisibility, setIsChangingVisibility] = useState(false)

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

  const getFirstUserMessage = (chat: Chat) => {
    const firstUserMessage = chat.messages?.find((msg) => msg.role === 'user')
    return firstUserMessage?.content || 'Aucun message'
  }

  const handleRenameChat = async () => {
    if (!renameChatName.trim() || !selectedChatId) return

    setIsRenamingChat(true)
    try {
      const response = await fetch(`/api/chats/${selectedChatId}`, {
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
          c.id === selectedChatId ? { ...c, name: updatedChat.name } : c,
        ),
      )

      // Close dialog and reset form
      setIsRenameDialogOpen(false)
      setRenameChatName('')
      setSelectedChatId(null)
    } catch (error) {
      console.error('Error renaming chat:', error)
    } finally {
      setIsRenamingChat(false)
    }
  }

  const handleDeleteChat = async () => {
    if (!selectedChatId) return

    setIsDeletingChat(true)
    try {
      const response = await fetch(`/api/chats/${selectedChatId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete chat')
      }

      // Remove the chat from the list
      setChats((prev) => prev.filter((c) => c.id !== selectedChatId))

      // Close dialog
      setIsDeleteDialogOpen(false)
      setSelectedChatId(null)
    } catch (error) {
      console.error('Error deleting chat:', error)
    } finally {
      setIsDeletingChat(false)
    }
  }

  const handleDuplicateChat = async () => {
    if (!selectedChatId) return

    setIsDuplicatingChat(true)
    try {
      const response = await fetch('/api/chat/fork', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId: selectedChatId }),
      })

      if (!response.ok) {
        throw new Error('Failed to duplicate chat')
      }

      const result = await response.json()

      // Add the new chat to the list
      setChats((prev) => [result, ...prev])

      // Close dialog
      setIsDuplicateDialogOpen(false)
      setSelectedChatId(null)
    } catch (error) {
      console.error('Error duplicating chat:', error)
    } finally {
      setIsDuplicatingChat(false)
    }
  }

  const handleChangeVisibility = async () => {
    if (!selectedChatId) return

    setIsChangingVisibility(true)
    try {
      const response = await fetch(`/api/chats/${selectedChatId}/visibility`, {
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
          c.id === selectedChatId ? { ...c, privacy: updatedChat.privacy } : c,
        ),
      )

      // Close dialog
      setIsVisibilityDialogOpen(false)
      setSelectedChatId(null)
    } catch (error) {
      console.error('Error changing chat visibility:', error)
    } finally {
      setIsChangingVisibility(false)
    }
  }

  // Don't show if user is not authenticated
  if (!session?.user?.id) return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Chargement des projets...
        </span>
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          Aucun projet
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Commencez par créer votre premier projet.
        </p>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {chats.map((chat, index) => (
          <div
            key={chat.id}
            className="group relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white/80 dark:hover:bg-gray-900/80 overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <Link href={`/chats/${chat.id}`} className="block">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {getChatDisplayName(chat)}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {chat.messages?.length || 0} messages
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Project Actions Menu */}
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-800/50 rounded-full"
                    disabled={
                      isRenamingChat ||
                      isDeletingChat ||
                      isDuplicatingChat ||
                      isChangingVisibility
                    }
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Options du projet</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedChatId(chat.id)
                      setIsDuplicateDialogOpen(true)
                    }}
                    disabled={
                      isRenamingChat ||
                      isDeletingChat ||
                      isDuplicatingChat ||
                      isChangingVisibility
                    }
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Dupliquer le projet
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedChatId(chat.id)
                      setSelectedVisibility(chat.privacy || 'private')
                      setIsVisibilityDialogOpen(true)
                    }}
                    disabled={
                      isRenamingChat ||
                      isDeletingChat ||
                      isDuplicatingChat ||
                      isChangingVisibility
                    }
                  >
                    {getPrivacyIcon(chat.privacy || 'private')}
                    <span className="ml-2">Changer la visibilité</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedChatId(chat.id)
                      setRenameChatName(chat.name || '')
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
                    Renommer le projet
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedChatId(chat.id)
                      setIsDeleteDialogOpen(true)
                    }}
                    disabled={
                      isRenamingChat ||
                      isDeletingChat ||
                      isDuplicatingChat ||
                      isChangingVisibility
                    }
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer le projet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* BorderBeam Effects for each project tile */}
            <BorderBeam
              duration={6}
              size={200}
              className="from-transparent via-blue-400 to-transparent opacity-60"
            />
            <BorderBeam
              duration={6}
              delay={3}
              size={150}
              borderWidth={1}
              className="from-transparent via-purple-400 to-transparent opacity-40"
            />
          </div>
        ))}
      </div>

      {/* Rename Chat Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer le projet</DialogTitle>
            <DialogDescription>
              Entrez un nouveau nom pour ce projet.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nom du projet"
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
                setSelectedChatId(null)
              }}
              disabled={isRenamingChat}
            >
              Annuler
            </Button>
            <Button
              onClick={handleRenameChat}
              disabled={isRenamingChat || !renameChatName.trim()}
            >
              {isRenamingChat ? 'Renommage en cours...' : 'Renommer le projet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Chat Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le projet</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce projet ? Cette action ne peut
              pas être annulée et supprimera définitivement le projet et tous ses
              messages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedChatId(null)
              }}
              disabled={isDeletingChat}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteChat}
              disabled={isDeletingChat}
            >
              {isDeletingChat ? 'Suppression en cours...' : 'Supprimer le projet'}
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
            <DialogTitle>Dupliquer le projet</DialogTitle>
            <DialogDescription>
              Cette action créera une copie du projet actuel. Le nouveau projet
              sera ajouté à votre liste.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDuplicateDialogOpen(false)
                setSelectedChatId(null)
              }}
              disabled={isDuplicatingChat}
            >
              Annuler
            </Button>
            <Button onClick={handleDuplicateChat} disabled={isDuplicatingChat}>
              {isDuplicatingChat ? 'Duplication en cours...' : 'Dupliquer le projet'}
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
            <DialogTitle>Changer la visibilité du projet</DialogTitle>
            <DialogDescription>
              Choisissez qui peut voir et accéder à ce projet.
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
                        Seul vous pouvez voir ce projet
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
                        Tout le monde peut voir ce projet
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
                        Les membres de l'équipe peuvent voir ce projet
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
                        Les membres de l'équipe peuvent voir et modifier ce projet
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
                        Seuls les personnes avec le lien peuvent voir ce projet
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
              onClick={() => {
                setIsVisibilityDialogOpen(false)
                setSelectedChatId(null)
              }}
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
