import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { StreamingProvider } from '@/contexts/streaming-context'
import { SWRProvider } from '@/components/providers/swr-provider'
import { SessionProvider } from '@/components/providers/session-provider'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Site Forge',
  description:
    'Site Forge vous permet de créer des sites web en quelques secondes avec l\'IA.',
  icons: {
    icon: [
      { url: '/favicon_new/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon_new/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon_new/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon_new/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon_new/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/favicon_new/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: [
      { url: '/favicon_new/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }
    ]
  },
  manifest: '/favicon_new/site.webmanifest',
  themeColor: '#ffffff',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                // Listen for changes in system preference
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                  if (e.matches) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <SWRProvider>
            <StreamingProvider>{children}</StreamingProvider>
          </SWRProvider>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  )
}
