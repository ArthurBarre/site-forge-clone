'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  PromptInput,
  PromptInputImageButton,
  PromptInputImagePreview,
  PromptInputMicButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  createImageAttachment,
  createImageAttachmentFromStored,
  savePromptToStorage,
  loadPromptFromStorage,
  clearPromptFromStorage,
  type ImageAttachment,
} from '@/components/ai-elements/prompt-input'
import { AppHeader } from '@/components/shared/app-header'
import { useStreaming } from '@/contexts/streaming-context'
import { StreamingMessage } from '@v0-sdk/react'
import { ChatMessages } from '@/components/chat/chat-messages'
import { ChatInput } from '@/components/chat/chat-input'
import { PreviewPanel } from '@/components/chat/preview-panel'
import { ResizableLayout } from '@/components/shared/resizable-layout'
import { BottomToolbar } from '@/components/shared/bottom-toolbar'
import { Particles } from '@/components/ui/particles'
import { AuroraText } from '../ui/aurora-text'
import { BorderBeam } from '@/components/ui/border-beam'
import { Editor } from '@/components/ui/editor'

// Component that uses useSearchParams - needs to be wrapped in Suspense
function SearchParamsHandler({ onReset }: { onReset: () => void }) {
  const searchParams = useSearchParams()

  // Reset UI when reset parameter is present
  useEffect(() => {
    const reset = searchParams.get('reset')
    if (reset === 'true') {
      onReset()

      // Remove the reset parameter from URL without triggering navigation
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('reset')
      window.history.replaceState({}, '', newUrl.pathname)
    }
  }, [searchParams, onReset])

  return null
}

export function HomeClient() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showChatInterface, setShowChatInterface] = useState(false)
  const [attachments, setAttachments] = useState<ImageAttachment[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [chatHistory, setChatHistory] = useState<
    Array<{
      type: 'user' | 'assistant'
      content: string | any
      isStreaming?: boolean
      stream?: ReadableStream<Uint8Array> | null
    }>
  >([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [currentChat, setCurrentChat] = useState<{
    id: string
    demo?: string
  } | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activePanel, setActivePanel] = useState<'chat' | 'preview'>('chat')
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { startHandoff } = useStreaming()

  const handleReset = () => {
    // Reset all chat-related state
    setShowChatInterface(false)
    setChatHistory([])
    setCurrentChatId(null)
    setCurrentChat(null)
    setMessage('')
    setAttachments([])
    setIsLoading(false)
    setIsFullscreen(false)
    setRefreshKey((prev) => prev + 1)

    // Clear any stored data
    clearPromptFromStorage()

    // Focus textarea after reset
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 0)
  }

  const handleEditorClick = () => {
    // Scroll vers le bas de la page
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth' 
    })
  }

  // Auto-focus the textarea on page load and restore from sessionStorage
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }

    // Restore prompt data from sessionStorage
    const storedData = loadPromptFromStorage()
    if (storedData) {
      setMessage(storedData.message)
      if (storedData.attachments.length > 0) {
        const restoredAttachments = storedData.attachments.map(
          createImageAttachmentFromStored,
        )
        setAttachments(restoredAttachments)
      }
    }
  }, [])

  // Save prompt data to sessionStorage whenever message or attachments change
  useEffect(() => {
    if (message.trim() || attachments.length > 0) {
      savePromptToStorage(message, attachments)
    } else {
      // Clear sessionStorage if both message and attachments are empty
      clearPromptFromStorage()
    }
  }, [message, attachments])

  // Image attachment handlers
  const handleImageFiles = async (files: File[]) => {
    try {
      const newAttachments = await Promise.all(
        files.map((file) => createImageAttachment(file)),
      )
      setAttachments((prev) => [...prev, ...newAttachments])
    } catch (error) {
      console.error('Error processing image files:', error)
    }
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id))
  }

  const handleDragOver = () => {
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = () => {
    setIsDragOver(false)
  }

  const handleSendMessage = async (e: React.FormEvent<Element>) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    const currentAttachments = [...attachments]

    // Clear sessionStorage immediately upon submission
    clearPromptFromStorage()

    setMessage('')
    setAttachments([])

    // Immediately show chat interface and add user message
    setShowChatInterface(true)
    setChatHistory([
      {
        type: 'user',
        content: userMessage,
      },
    ])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          streaming: true,
          attachments: currentAttachments.map((att) => ({ url: att.dataUrl })),
        }),
      })

      if (!response.ok) {
        // Try to get the specific error message from the response
        let errorMessage =
          'Sorry, there was an error processing your message. Please try again.'
        try {
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (response.status === 429) {
            errorMessage =
              'Vous avez dépassé votre nombre maximum de messages pour la journée. Veuillez réessayer plus tard.'
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError)
          if (response.status === 429) {
            errorMessage =
              'Vous avez dépassé votre nombre maximum de messages pour la journée. Veuillez réessayer plus tard.'
          }
        }
        throw new Error(errorMessage)
      }

      if (!response.body) {
        throw new Error('Aucun corps de réponse pour le streaming')
      }

      setIsLoading(false)

      // Add streaming assistant response
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: [],
          isStreaming: true,
          stream: response.body,
        },
      ])
    } catch (error) {
      console.error('Error creating chat:', error)
      setIsLoading(false)

      // Use the specific error message if available, otherwise fall back to generic message
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Désolé, il y a eu une erreur lors du traitement de votre message. Veuillez réessayer.'

      setChatHistory((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: errorMessage,
        },
      ])
    }
  }

  const handleChatData = async (chatData: any) => {
    if (chatData.id) {
      // Only set currentChat if it's not already set or if this is the main chat object
      if (!currentChatId || chatData.object === 'chat') {
        setCurrentChatId(chatData.id)
        setCurrentChat({ id: chatData.id })

        // Update URL without triggering Next.js routing
        window.history.pushState(null, '', `/chats/${chatData.id}`)
      }

      // Create ownership record for new chat (only if this is a new chat)
      if (!currentChatId) {
        try {
          await fetch('/api/chat/ownership', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chatId: chatData.id,
            }),
          })
        } catch (error) {
          console.error('Failed to create chat ownership:', error)
          // Don't fail the UI if ownership creation fails
        }
      }
    }
  }

  const handleStreamingComplete = async (finalContent: any) => {
    setIsLoading(false)

    // Update chat history with final content
    setChatHistory((prev) => {
      const updated = [...prev]
      const lastIndex = updated.length - 1
      if (lastIndex >= 0 && updated[lastIndex].isStreaming) {
        updated[lastIndex] = {
          ...updated[lastIndex],
          content: finalContent,
          isStreaming: false,
          stream: undefined,
        }
      }
      return updated
    })

    // Fetch demo URL after streaming completes
    // Use the current state by accessing it in the state updater
    setCurrentChat((prevCurrentChat) => {
      if (prevCurrentChat?.id) {
        // Fetch demo URL asynchronously
        fetch(`/api/chats/${prevCurrentChat.id}`)
          .then((response) => {
            if (response.ok) {
              return response.json()
            } else {
              console.warn('Failed to fetch chat details:', response.status)
              return null
            }
          })
          .then((chatDetails) => {
            if (chatDetails) {
              const demoUrl =
                chatDetails?.latestVersion?.demoUrl || chatDetails?.demo

              // Update the current chat with demo URL
              if (demoUrl) {
                setCurrentChat((prev) =>
                  prev ? { ...prev, demo: demoUrl } : null,
                )
                if (window.innerWidth < 768) {
                  setActivePanel('preview')
                }
              }
            }
          })
          .catch((error) => {
            console.error('Error fetching demo URL:', error)
          })
      }

      // Return the current state unchanged for now
      return prevCurrentChat
    })
  }

  const handleChatSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim() || isLoading || !currentChatId) return

    const userMessage = message.trim()
    setMessage('')
    setIsLoading(true)

    // Add user message to chat history
    setChatHistory((prev) => [...prev, { type: 'user', content: userMessage }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          chatId: currentChatId,
          streaming: true,
        }),
      })

      if (!response.ok) {
        // Try to get the specific error message from the response
        let errorMessage =
          'Sorry, there was an error processing your message. Please try again.'
        try {
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (response.status === 429) {
            errorMessage =
              'Vous avez dépassé votre nombre maximum de messages pour la journée. Veuillez réessayer plus tard.'
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError)
          if (response.status === 429) {
            errorMessage =
              'Vous avez dépassé votre nombre maximum de messages pour la journée. Veuillez réessayer plus tard.'
          }
        }
        throw new Error(errorMessage)
      }

      if (!response.body) {
        throw new Error('Aucun corps de réponse pour le streaming')
      }

      setIsLoading(false)

      // Add streaming response
      setChatHistory((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: [],
          isStreaming: true,
          stream: response.body,
        },
      ])
    } catch (error) {
      console.error('Error:', error)

      // Use the specific error message if available, otherwise fall back to generic message
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Désolé, il y a eu une erreur lors du traitement de votre message. Veuillez réessayer.'

      setChatHistory((prev) => [
        ...prev,
        {
          type: 'assistant',
          content: errorMessage,
        },
      ])
      setIsLoading(false)
    }
  }

  if (showChatInterface) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col">
        {/* Handle search params with Suspense boundary */}
        <Suspense fallback={null}>
          <SearchParamsHandler onReset={handleReset} />
        </Suspense>

        <AppHeader />

        <div className="flex flex-col h-[calc(100vh-64px-40px)] md:h-[calc(100vh-64px)]">
          <ResizableLayout
            className="flex-1 min-h-0"
            singlePanelMode={false}
            activePanel={activePanel === 'chat' ? 'left' : 'right'}
            leftPanel={
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                  <ChatMessages
                    chatHistory={chatHistory}
                    isLoading={isLoading}
                    currentChat={currentChat}
                    onStreamingComplete={handleStreamingComplete}
                    onChatData={handleChatData}
                    onStreamingStarted={() => setIsLoading(false)}
                  />
                </div>

                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  onSubmit={handleChatSendMessage}
                  isLoading={isLoading}
                  showSuggestions={false}
                />
              </div>
            }
            rightPanel={
              <PreviewPanel
                currentChat={currentChat}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                refreshKey={refreshKey}
                setRefreshKey={setRefreshKey}
              />
            }
          />

          <div className="md:hidden">
            <BottomToolbar
              activePanel={activePanel}
              onPanelChange={setActivePanel}
              hasPreview={!!currentChat}
            />
          </div>
        </div>

        {/* Hidden streaming component for initial response */}
        {chatHistory.some((msg) => msg.isStreaming && msg.stream) && (
          <div className="hidden">
            {chatHistory.map((msg, index) =>
              msg.isStreaming && msg.stream ? (
                <StreamingMessage
                  key={index}
                  stream={msg.stream}
                  messageId={`msg-${index}`}
                  role="assistant"
                  onComplete={handleStreamingComplete}
                  onChatData={handleChatData}
                  onError={(error) => {
                    console.error('Streaming error:', error)
                    setIsLoading(false)
                  }}
                />
              ) : null,
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-slate-900/50 dark:via-transparent dark:to-indigo-900/50" />
      </div>

      {/* Handle search params with Suspense boundary */}
      <Suspense fallback={null}>
        <SearchParamsHandler onReset={handleReset} />
      </Suspense>

      <AppHeader />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight mt-4">
              Votre site web
              <br />
              <AuroraText className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                en 30 secondes
              </AuroraText>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Décrivez simplement ce que vous voulez créer et notre IA va construire votre site web professionnel. 
              <span className="font-semibold text-blue-600 dark:text-blue-400"> Aucune compétence technique requise.</span>
            </p>
            
            {/* Exemples d'inspiration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 dark:border-gray-700/50">
                <div className="text-2xl mb-2">🏪</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Boutique en ligne</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">"Une boutique de vêtements avec catalogue et panier"</p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 dark:border-gray-700/50">
                <div className="text-2xl mb-2">🍽️</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Restaurant</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">"Site pour restaurant avec menu et réservations"</p>
              </div>
              <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 dark:border-gray-700/50">
                <div className="text-2xl mb-2">💼</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Portfolio</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">"Portfolio créatif avec galerie et contact"</p>
              </div>
            </div>
            
            {/* Call to action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Gratuit pour commencer</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Déploiement automatique</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Personnalisation illimitée</span>
              </div>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Commencez votre projet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Décrivez ce que vous voulez créer et laissez l'IA faire le reste
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-black/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden" onClick={handleEditorClick}>
                <Editor
                  value={message}
                  onChange={setMessage}
                  onSubmit={handleSendMessage}
                  placeholder="Décrivez ce que vous voulez construire... Par exemple: 'Une page d'accueil moderne pour un restaurant'"
                  disabled={isLoading}
                  isLoading={isLoading}
                  onImageSelect={handleImageFiles}
                  onMicTranscript={(transcript) => {
                    setMessage((prev) => prev + (prev ? ' ' : '') + transcript)
                  }}
                  onMicError={(error) => {
                    console.error('Speech recognition error:', error)
                  }}
                  className="w-full"
                  darkMode={true}
                />
                
                {/* BorderBeam Effects */}
                <BorderBeam
                  duration={8}
                  size={400}
                  className="from-transparent via-blue-500 to-transparent"
                />
                <BorderBeam
                  duration={8}
                  delay={4}
                  size={400}
                  borderWidth={2}
                  className="from-transparent via-purple-500 to-transparent"
                />
                <BorderBeam
                  duration={8}
                  delay={2}
                  size={300}
                  borderWidth={1}
                  className="from-transparent via-pink-500 to-transparent"
                />
              </div>
            </div>
          </div>


          {/* Footer */}
          <div className="mt-16 mb-16 md:mt-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Propulsé par{' '}
                <Link
                  href="https://v0-sdk.dev"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Ordinarthur & Philou
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
