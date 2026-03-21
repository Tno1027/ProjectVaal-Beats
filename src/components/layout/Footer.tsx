// src/components/layout/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Socials } from './Socials'

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-dark-300/60 backdrop-blur-sm mt-auto pb-24">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2.5">
              <Image src="/logo.png" alt="ProjectVaal|Beats" width={32} height={32} className="rounded-full" />
              <span className="font-display font-bold text-white tracking-tight">
                ProjectVaal<span className="text-blue-gradient">|Beats</span>
              </span>
            </div>
            <p className="text-zinc-600 text-xs max-w-[200px] text-center md:text-left leading-relaxed">
              Premium instrumentals for artists who move different.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            {[
              { label: 'Shop', href: '/shop' },
              { label: 'Licensing', href: '/licensing' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="hover:text-white transition-colors duration-200">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Follow</span>
            <Socials layout="row" />
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-zinc-700 text-xs">
          <span>&copy; {new Date().getFullYear()} ProjectVaal|Beats. All rights reserved.</span>
          <span className="font-mono">Beats built with purpose.</span>
        </div>
      </div>
    </footer>
  )
}
