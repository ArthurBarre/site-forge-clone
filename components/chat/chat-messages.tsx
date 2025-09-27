import React, { useRef, useEffect } from 'react'
import { Message, MessageContent } from '@/components/ai-elements/message'
import {
  Conversation,
  ConversationContent,
} from '@/components/ai-elements/conversation'
import { Loader } from '@/components/ai-elements/loader'
import { MessageRenderer } from '@/components/message-renderer'
import { sharedComponents } from '@/components/shared-components'
import { StreamingMessage } from '@v0-sdk/react'

interface ChatMessage {
  type: 'user' | 'assistant'
  content: string | any
  isStreaming?: boolean
  stream?: ReadableStream<Uint8Array> | null
}

interface Chat {
  id: string
  demo?: string
  url?: string
}

interface ChatMessagesProps {
  chatHistory: ChatMessage[]
  isLoading: boolean
  currentChat: Chat | null
  onStreamingComplete: (finalContent: any) => void
  onChatData: (chatData: any) => void
  onStreamingStarted?: () => void
}

export function ChatMessages({
  chatHistory,
  isLoading,
  currentChat,
  onStreamingComplete,
  onChatData,
  onStreamingStarted,
}: ChatMessagesProps) {
  const streamingStartedRef = useRef(false)

  // Reset the streaming started flag when a new message starts loading
  useEffect(() => {
    if (isLoading) {
      streamingStartedRef.current = false
    }
  }, [isLoading])

  // Function to filter content to keep only 'p' tags and remove AssistantMessageContentPart
  const filterAssistantContent = (content: any): any => {
    if (!content || !Array.isArray(content)) return content
    
    return content.map((item: any) => {
      if (Array.isArray(item) && item.length >= 2) {
        const [firstElement, ...rest] = item
        if (firstElement === 0 && Array.isArray(rest[0])) {
          // This is the main content array, filter it
          const filteredContent = rest[0].filter((subItem: any) => {
            if (Array.isArray(subItem) && subItem.length > 0) {
              // Keep only 'p' tags, remove AssistantMessageContentPart and other technical elements
              return subItem[0] === 'p' || subItem[0] === 'text'
            }
            return true
          })
          return [firstElement, filteredContent]
        }
      }
      return item
    })
  }

  if (chatHistory.length === 0) {
    return (
      <Conversation>
        <ConversationContent>
          <div>
            {/* Empty conversation - messages will appear here when they load */}
          </div>
        </ConversationContent>
      </Conversation>
    )
  }

  return (
    <>
      <Conversation>
        <ConversationContent>
          {chatHistory.map((msg, index) => {
            // Filter content for assistant messages to keep only 'p' tags
            const filteredContent = msg.type === 'assistant' 
              ? filterAssistantContent(msg.content)
              : msg.content
            
            return (
              <Message from={msg.type} key={index}>
                {msg.isStreaming && msg.stream ? (
                  <StreamingMessage
                    stream={msg.stream}
                    messageId={`msg-${index}`}
                    role={msg.type}
                    onComplete={onStreamingComplete}
                    onChatData={onChatData}
                    onChunk={(chunk) => {
                      // Hide external loader once we start receiving content (only once)
                      if (onStreamingStarted && !streamingStartedRef.current) {
                        streamingStartedRef.current = true
                        onStreamingStarted()
                      }
                    }}
                    onError={(error) => console.error('Streaming error:', error)}
                    components={sharedComponents}
                    showLoadingIndicator={false}
                  />
                ) : (
                  <MessageRenderer
                    content={filteredContent}
                    role={msg.type}
                    messageId={`msg-${index}`}
                  />
                )}
              </Message>
            )
          })}
          {isLoading && (
            <div className="flex justify-center py-4">
              <Loader size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </ConversationContent>
      </Conversation>
    </>
  )
}
