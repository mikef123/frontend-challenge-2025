'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { useRouter } from 'next/navigation'

export default function Login() {
  const { login } = useAuth()
  const [user, setUser] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin() {
    setError(null)
    setLoading(true)

    try {
      await login(user, password)
      router.push('/home')
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Error in the login')
      } else {
        setError('unexpected error')
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="h-screen flex justify-center items-center">
      <div className="w-80 space-y-3">
        <input
          className="border p-2 w-full"
          value={user}
          placeholder="User name"
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          value={password}
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          className="bg-blue-600 text-white w-full p-2 disabled:opacity-60"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Loggin in...' : 'Login'}
        </button>
      </div>
    </main>
  )
}
