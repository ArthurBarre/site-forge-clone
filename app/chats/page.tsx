import { Suspense } from 'react'
import { ChatsClient } from '@/components/chats/chats-client'

export default function ChatsPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ChatsClient />
    </Suspense>
  )
}
