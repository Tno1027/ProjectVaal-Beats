// src/components/layout/Socials.tsx
import Link from 'next/link'
import { Instagram, Youtube, Mail } from 'lucide-react'

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/yourhandle',
    icon: Instagram,
    external: true,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@yourhandle',
    icon: Youtube,
    external: true,
  },
  {
    label: 'Gmail',
    href: '/contact',
    icon: Mail,
    external: false,
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@yourhandle',
    icon: null,
    external: true,
  },
]

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z" />
    </svg>
  )
}

export function Socials({ layout = 'row' }: { layout?: 'row' | 'col' }) {
  return (
    <div className={`flex ${layout === 'col' ? 'flex-col gap-3' : 'flex-row gap-3'}`}>
      {SOCIALS.map(({ label, href, icon: Icon, external }) => (
        <Link
          key={label}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          aria-label={label}
          className="group w-9 h-9 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-500 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200"
        >
          {Icon
            ? <Icon className="w-4 h-4" />
            : <TikTokIcon className="w-4 h-4" />
          }
        </Link>
      ))}
    </div>
  )
}
