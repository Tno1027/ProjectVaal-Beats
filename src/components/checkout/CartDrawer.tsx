'use client'
// src/components/checkout/CartDrawer.tsx
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, total, clearCart } = useCartStore()
  const router = useRouter()

  const handleCheckout = async () => {
    if (items.length === 0) return
    closeCart()
    router.push('/checkout')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={clsx(
          'fixed top-0 right-0 h-full w-full max-w-md z-50 bg-dark-100 border-l border-zinc-850',
          'flex flex-col transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-850">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-white" />
            <h2 className="font-display font-semibold text-white">Your Cart</h2>
            {items.length > 0 && (
              <span className="text-xs text-zinc-500 font-mono">({items.length})</span>
            )}
          </div>
          <button onClick={closeCart} className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-850">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-zinc-700" />
              </div>
              <p className="text-zinc-500 text-sm">Your cart is empty</p>
              <button
                onClick={() => { closeCart(); router.push('/shop') }}
                className="mt-4 text-white text-sm hover:text-white transition-colors underline-blue"
              >
                Browse beats
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map(item => (
                <div
                  key={`${item.beat.id}-${item.license.tier}`}
                  className="flex gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-850"
                >
                  {/* Cover */}
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-850 flex-shrink-0">
                    {item.beat.cover_art_url ? (
                      <Image src={item.beat.cover_art_url} alt={item.beat.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-lg">♪</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.beat.title}</p>
                    <p className="text-xs text-white mt-0.5">{item.license.label}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-600 font-mono">
                      {item.license.files?.slice(0, 2).join(' · ')}
                    </div>
                  </div>

                  {/* Price + remove */}
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-white font-display font-bold text-sm">
                      ${item.license.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.beat.id, item.license.tier)}
                      className="p-1 text-zinc-700 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-850 px-6 py-5 space-y-4">
            {/* License reminder */}
            <p className="text-[11px] text-zinc-600 text-center">
              License agreements delivered with your order
            </p>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Total</span>
              <span className="text-white font-display font-bold text-xl">
                ${total().toFixed(2)} AUD
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="btn-blue w-full justify-center gap-2 py-3.5"
            >
              Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={clearCart}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors w-full text-center"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
