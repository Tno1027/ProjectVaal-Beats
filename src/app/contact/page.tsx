'use client'
// src/app/contact/page.tsx
import { useState } from 'react'
import { Mail, MessageSquare, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const INQUIRY_TYPES = ['General', 'Custom Beat', 'Exclusive Inquiry', 'Licensing Question', 'Technical Issue']

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', type: 'General', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error('Fill in all fields')
      return
    }
    setSending(true)
    // TODO: Wire to email service (Resend / SendGrid)
    await new Promise(r => setTimeout(r, 1000))
    toast.success('Message sent! We\'ll respond within 24 hours.')
    setForm({ name: '', email: '', type: 'General', message: '' })
    setSending(false)
  }

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-white text-xs font-mono tracking-widest uppercase mb-3">Get In Touch</p>
          <h1 className="font-display text-5xl font-bold text-white mb-4">Contact</h1>
          <p className="text-zinc-400">Custom beat requests, licensing inquiries, or general questions — we respond within 24 hours.</p>
        </div>

        <div className="card-dark p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Name</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Your name"
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/60"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@email.com"
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/60"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Inquiry Type</label>
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/60"
            >
              {INQUIRY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Message</label>
            <textarea
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={5}
              placeholder="Describe your request or question..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/60 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={sending}
            className="btn-blue w-full py-4 justify-center disabled:opacity-50"
          >
            {sending ? (
              <span className="w-4 h-4 border-2 border-dark-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Send className="w-4 h-4" /> Send Message</>
            )}
          </button>
        </div>

        <div className="flex justify-center gap-8 mt-8 text-sm text-zinc-500">
          <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-white" /> Response in 24h</span>
          <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-white" /> Custom beats available</span>
        </div>
      </div>
    </div>
  )
}
