// src/app/about/page.tsx
import Link from 'next/link'
import { ArrowRight, Music, Globe, Headphones } from 'lucide-react'


export const metadata = {
  title: 'About',
  description: 'The producer behind ProjectVaal|Beats.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden mb-16 border border-zinc-850">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_70%_50%,rgba(59,130,246,0.1),transparent)]" />
          <div className="relative px-10 py-16">
            <p className="text-white text-xs font-mono tracking-widest uppercase mb-4">The Producer</p>
            <h1 className="font-display text-6xl font-bold text-white mb-6 leading-tight">
              Beats Built<br />
              <span className="text-blue-gradient">From Purpose.</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-xl leading-relaxed mb-8">
              Every beat in this catalog is crafted with intent — for artists
              who understand that the right sound doesn't just complete a record,
              it builds a legacy.
            </p>
            <Link href="/shop" className="btn-blue inline-flex items-center gap-2 px-6 py-3">
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Music,
              title: 'Production Philosophy',
              text: 'Every session starts from emotion and ends with precision. No filler. No templates. Every beat is built to move culture — whether that\'s hard trap, melodic R&B, or cinematic Afrobeats.',
            },
            {
              icon: Globe,
              title: 'Global Sound',
              text: 'Rooted in African rhythm, shaped by Western influence, built for world stages. The catalog bridges continents and connects artists to sounds that transcend borders.',
            },
            {
              icon: Headphones,
              title: 'Your Vision First',
              text: 'The license you choose shapes your creative future. That\'s why the terms are clear, the files are clean, and the exclusive option always exists for those who want to fully own their sound.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-dark p-6 hover-blue-border">
              <Icon className="w-5 h-5 text-white mb-4" />
              <h3 className="font-display font-semibold text-white mb-3">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
