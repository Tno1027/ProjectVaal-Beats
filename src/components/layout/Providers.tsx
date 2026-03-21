'use client'
// src/components/layout/Providers.tsx
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #2a2a2a',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#3b82f6', secondary: '#0a0a0a' },
          },
        }}
      />
    </>
  )
}
