'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Users, Lock, MoreHorizontal, Edit2, Trash2, Copy, Plus, Search, ArrowLeft, Sparkles } from 'lucide-react'
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
import { AppHeader } from '@/components/shared/app-header'

interface Chat {
  id: string
  name?: string
  privacy?: 'public' | 'private' | 'team' | 'team-edit' | 'unlisted'
  createdAt: string
  updatedAt: string
  url?: string
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

export function SitesClient() {
  const { data: session } = useSession()
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPrivacy, setFilterPrivacy] = useState<string>('all')
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

  // Filter chats based on search and privacy filter
  const filteredChats = chats.filter((chat) => {
    const matchesSearch = getChatDisplayName(chat).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrivacy = filterPrivacy === 'all' || chat.privacy === filterPrivacy
    return matchesSearch && matchesPrivacy
  })

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
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <AppHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Connectez-vous pour voir vos sites
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Vous devez être connecté pour accéder à vos projets
            </p>
            <Button 
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">

      <AppHeader />

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/app')}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Mes sites
                  </h1>
                </div>
              </div>
              <Button 
                onClick={() => router.push('/app')}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un site
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher dans vos sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 dark:border-gray-700"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterPrivacy} onValueChange={setFilterPrivacy}>
                  <SelectTrigger className="w-40 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Filtrer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Privé</SelectItem>
                    <SelectItem value="team">Équipe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                Chargement de vos sites...
              </span>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gray-100 dark:bg-gray-800">
                <Sparkles className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {searchTerm ? 'Aucun site trouvé' : 'Aucun site créé'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? 'Essayez de modifier votre recherche ou vos filtres.'
                  : 'Commencez par créer votre premier site avec l\'IA. C\'est simple et rapide !'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => router.push('/app')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer mon premier site
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <div className="col-span-6">Nom du projet</div>
                    <div className="col-span-2">Statut</div>
                    <div className="col-span-2">Dernière modification</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredChats.map((chat) => (
                    <div key={chat.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Project Name */}
                        <div className="col-span-6">
                          <Link href={`/chats/${chat.id}`} className="group">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {getChatDisplayName(chat)}
                                </h3>
                              </div>
                            </div>
                          </Link>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            {getPrivacyIcon(chat.privacy || 'private')}
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {getPrivacyDisplayName(chat.privacy || 'private')}
                            </span>
                          </div>
                        </div>

                        {/* Last Modified */}
                        <div className="col-span-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {new Date(chat.updatedAt).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer le projet
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredChats.map((chat) => (
                  <div key={chat.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <Link href={`/chats/${chat.id}`} className="group flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                              {getChatDisplayName(chat)}
                            </h3>
                          </div>
                        </div>
                      </Link>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
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
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer le projet
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Card Footer with metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {getPrivacyIcon(chat.privacy || 'private')}
                          <span>{getPrivacyDisplayName(chat.privacy || 'private')}</span>
                        </div>
                      </div>
                      <span className="text-xs">
                        {new Date(chat.updatedAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dialogs */}
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
              pas être annulée et supprimera définitivement le projet.
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

    </div>
  )
}
