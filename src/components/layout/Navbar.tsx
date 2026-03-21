'use client'
// src/components/layout/Navbar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { clsx } from 'clsx'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Licensing', href: '/licensing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const { itemCount, openCart } = useCartStore()
  const count = itemCount()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-dark-200/95 backdrop-blur-xl border-b border-zinc-850 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image src="/logo.png" alt="ProjectVaal|Beats logo" width={36} height={36} className="rounded-full" />
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-blue-gradient">PROJECTVAAL|</span>
            <span className="text-white/80 ml-1 text-sm font-body font-normal tracking-widest uppercase">BEATS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'text-sm font-medium tracking-wide underline-blue transition-colors duration-200',
                pathname === link.href
                  ? 'text-white'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            onClick={openCart}
            className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-blue-dim transition-all duration-200"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 text-dark-400 text-[10px] font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {/* CTA */}
          <Link href="/shop" className="hidden md:block btn-blue text-xs px-4 py-2">
            Browse Beats
          </Link>

          {/* Mobile menu */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-850 bg-dark-100/98 backdrop-blur-xl">
          <nav className="px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={clsx(
                  'text-sm font-medium py-2',
                  pathname === link.href ? 'text-white' : 'text-zinc-300'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="btn-blue text-center text-sm mt-2"
            >
              Browse Beats
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
