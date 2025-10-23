'use client'

import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { ready, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.replace('/login')
    }
  }, [ready, isAuthenticated, router])

  if (!ready) {
    return <div className="p-4 text-sm text-gray-600">Loading session…</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen">
      <header className="mb-4 flex items-center justify-between p-4 border-b">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={logout}
        >
          Logout
        </button>
      </header>
      <main className="p-4">{children}</main>
    </div>
  )
}
