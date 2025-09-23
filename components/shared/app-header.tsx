'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
// import { ChatSelector } from './chat-selector'

import { MobileMenu } from './mobile-menu'
import { useSession } from 'next-auth/react'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/ui/button'
import { VercelIcon, GitHubIcon } from '@/components/ui/icons'
import { DEPLOY_URL } from '@/lib/constants'
import { Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AuroraText } from '../ui/aurora-text'

interface AppHeaderProps {
  className?: string
}

// Component that uses useSearchParams - needs to be wrapped in Suspense
function SearchParamsHandler() {
  const searchParams = useSearchParams()
  const { update } = useSession()

  // Force session refresh when redirected after auth
  useEffect(() => {
    const shouldRefresh = searchParams.get('refresh') === 'session'

    if (shouldRefresh) {
      // Force session update
      update()

      // Clean up URL without causing navigation
      const url = new URL(window.location.href)
      url.searchParams.delete('refresh')
      window.history.replaceState({}, '', url.pathname)
    }
  }, [searchParams, update])

  return null
}

export function AppHeader({ className = '' }: AppHeaderProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isHomepage = pathname === '/'
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)

  // Handle logo click - reset UI if on homepage, otherwise navigate to homepage
  const handleLogoClick = (e: React.MouseEvent) => {
    if (isHomepage) {
      e.preventDefault()
      // Add reset parameter to trigger UI reset
      window.location.href = '/?reset=true'
    }
    // If not on homepage, let the Link component handle navigation normally
  }

  return (
    <div
      className={`relative z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ${!isHomepage ? 'border-b border-border dark:border-input' : ''} ${className}`}
    >
      {/* Handle search params with Suspense boundary */}
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center gap-4 relative z-10">
            <Link
              href="/app"
              onClick={handleLogoClick}
              className="relative z-10"
            >
            <AuroraText
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
            >SiteForge</AuroraText>


            </Link>

            {/* Hide ChatSelector on mobile */}
            {/* <div className="hidden lg:block">
              <ChatSelector />
            </div> */}
          </div>

          {/* Desktop right side - Navigation and User */}
          <div className="hidden lg:flex items-center gap-3 relative z-10">
            <Link
              href="/sites"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 cursor-pointer relative z-10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Mes sites
            </Link>
            <UserNav session={session} />
          </div>

          {/* Mobile right side - Only menu button and user avatar */}
          <div className="flex lg:hidden items-center gap-2 relative z-10">
            <UserNav session={session} />
            <MobileMenu onInfoDialogOpen={() => setIsInfoDialogOpen(true)} />
          </div>
        </div>
      </div>

      {/* Info Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            {/* <DialogTitle className="text-2xl font-bold mb-4">
              v0 Clone Platform
            </DialogTitle> */}
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <p>
              This is a <strong>demo</strong> of a{' '}
              <a
                href="https://v0.app"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                v0 clone
              </a>{' '}
              where users can enter text prompts and generate React components
              and applications using AI.
            </p>
            <p>
              It's built with{' '}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Next.js
              </a>{' '}
              and the{' '}
              <a
                href="https://v0-sdk.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                v0 SDK
              </a>{' '}
              to provide a full-featured interface with authentication, database
              integration, and real-time streaming responses.
            </p>
            <p>
              Try the demo or{' '}
              <a
                href={DEPLOY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                deploy your own
              </a>
              .
            </p>
          </div>
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setIsInfoDialogOpen(false)}
              className="bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900"
            >
              Try now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
