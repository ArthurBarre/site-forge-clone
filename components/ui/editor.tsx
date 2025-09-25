'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  Image,
  Mic,
  MicOff,
  Send,
  Loader2,
  X,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  onImageSelect?: (files: File[]) => void
  onMicTranscript?: (transcript: string) => void
  onMicError?: (error: string) => void
  className?: string
  darkMode?: boolean
}

export function Editor({
  value,
  onChange,
  onSubmit,
  placeholder = "Décrivez ce que vous voulez créer...",
  disabled = false,
  isLoading = false,
  onImageSelect,
  onMicTranscript,
  onMicError,
  className,
  darkMode = false,
}: EditorProps) {
  const [isListening, setIsListening] = React.useState(false)
  const [isSupported, setIsSupported] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const recognitionRef = React.useRef<SpeechRecognition | null>(null)

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  // Speech recognition setup
  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'fr-FR'

      recognition.onstart = () => setIsListening(true)
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onMicTranscript?.(transcript)
        setIsListening(false)
      }
      recognition.onerror = (event) => {
        if (event.error !== 'aborted') {
          onMicError?.(event.error)
        }
        setIsListening(false)
      }
      recognition.onend = () => setIsListening(false)

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [onMicTranscript, onMicError])

  const handleMicToggle = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => 
      file.type.startsWith('image/')
    )
    if (files.length > 0) {
      onImageSelect?.(files)
    }
    if (e.target) {
      e.target.value = ''
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim()) {
        onSubmit(e as any)
      }
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "rounded-2xl border shadow-lg overflow-hidden",
        darkMode 
          ? "bg-gray-900 border-gray-700" 
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
      )}>
        {/* Toolbar */}
        <div className={cn(
          "border-b",
          darkMode 
            ? "border-gray-700 bg-gray-800/50" 
            : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
        )}>
          <div className="flex items-center justify-between w-full px-4 py-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  darkMode 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                disabled={disabled}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  darkMode 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                disabled={disabled}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  darkMode 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                disabled={disabled}
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  darkMode 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                disabled={disabled}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  darkMode 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                disabled={disabled}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  darkMode 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                disabled={disabled}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  darkMode 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                disabled={disabled}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  darkMode 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                disabled={disabled}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  darkMode 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                disabled={disabled}
              >
                <Quote className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 cursor-not-allowed !hover:bg-transparent !hover:text-inherit",
                    isListening && "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  )}
                  onClick={handleMicToggle}
                  disabled={disabled}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                {/* Coming Soon Label */}
                <div className="absolute -top-1 -right-3 bg-blue-500 text-white text-[6px] px-1.5 py-0.5 rounded-full shadow-lg opacity-100 pointer-events-none whitespace-nowrap z-10 text-center cursor-not-allowed">
                  Soon
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 cursor-pointer",
                  darkMode 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
                onClick={handleImageClick}
                disabled={disabled}
              >
                <Image className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                type="submit"
                size="sm"
                className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white mx-4 cursor-pointer"
                disabled={disabled || !value.trim() || isLoading}
                onClick={onSubmit}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="ml-2">Créer</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-6">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full min-h-[200px] max-h-[400px] resize-none border-0 outline-none bg-transparent text-lg leading-relaxed",
              darkMode 
                ? "text-white placeholder:text-gray-400" 
                : "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
            )}
          />
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
