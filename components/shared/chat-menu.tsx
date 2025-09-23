'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Copy, Trash2, ExternalLink } from 'lucide-react'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ChatMenuProps {
  chatId: string
}

export function ChatMenu({ chatId }: ChatMenuProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDuplicateChat = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/chat/fork', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId }),
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
      // You could add a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteChat = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/chat/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete chat')
      }

      // Close dialog and navigate back to homepage
      setIsDeleteDialogOpen(false)
      router.push('/app')
    } catch (error) {
      console.error('Error deleting chat:', error)
      // You could add a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ouvrir le menu de conversation</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem asChild>
            <a
              href={`https://v0.app/chat/${chatId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on v0.dev
            </a>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDuplicateDialogOpen(true)}
            disabled={isLoading}
          >
            <Copy className="mr-2 h-4 w-4" />
            Dupliquer la conversation
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isLoading}
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer la conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Duplicate Chat Dialog */}
      <Dialog
        open={isDuplicateDialogOpen}
        onOpenChange={setIsDuplicateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dupliquer la conversation</DialogTitle>
            <DialogDescription>
              Cela créera une copie de la conversation actuelle. Vous serez redirigé
              vers la nouvelle conversation une fois qu'elle sera créée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDuplicateDialogOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button onClick={handleDuplicateChat} disabled={isLoading}>
              {isLoading ? 'Duplication en cours...' : 'Dupliquer la conversation'}
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
              Êtes-vous sûr de vouloir supprimer cette conversation ? Cette action ne peut pas être
              annulée et supprimera définitivement la conversation et tous ses messages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteChat}
              disabled={isLoading}
            >
              {isLoading ? 'Suppression en cours...' : 'Supprimer la conversation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
