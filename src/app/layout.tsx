// src/app/layout.tsx
import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { StickyPlayer } from '@/components/player/StickyPlayer'
import { CartDrawer } from '@/components/checkout/CartDrawer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ProjectVaal|Beats — Premium Instrumentals',
    template: '%s | ProjectVaal|Beats',
  },
  description: 'Hard-hitting, cinematic instrumentals for artists who move different. License exclusive and non-exclusive beats.',
  keywords: ['beats', 'instrumentals', 'buy beats', 'trap beats', 'afrobeats', 'producer'],
  openGraph: {
    type: 'website',
    siteName: 'ProjectVaal|Beats',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-dark-200 text-white font-body antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <StickyPlayer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  )
}
