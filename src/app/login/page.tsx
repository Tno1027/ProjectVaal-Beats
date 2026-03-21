'use client'
// src/app/login/page.tsx
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Disc3, Mail, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error('Fill in email and password')
      return
    }
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Welcome back')
        router.push('/account/orders')
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast.success('Account created — check your email to verify')
      }
    } catch (err: any) {
      toast.error(err.message || 'Auth failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(59,130,246,0.08),transparent)]" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-gradient flex items-center justify-center mx-auto mb-4">
            <Disc3 className="w-6 h-6 text-dark-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {mode === 'login' ? 'Sign in to access your orders' : 'Start licensing beats today'}
          </p>
        </div>

        {/* Form */}
        <div className="card-dark p-7 space-y-4">
          <div>
            <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500/60"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500/60"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-blue w-full py-3.5 justify-center disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-dark-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-4">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-white hover:text-white transition-colors"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        <p className="text-center mt-4">
          <Link href="/shop" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            Continue as guest →
          </Link>
        </p>
      </div>
    </div>
  )
}
