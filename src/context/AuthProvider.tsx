'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useCallback,
} from 'react'
import authService from '@/services/auth.service'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  ready: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = authService.restoreFromStorage?.() ?? authService.getToken()
    setAuthenticated(!!token)
    setReady(true)

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        const loggedIn = !!e.newValue
        setAuthenticated(loggedIn)
        if (!loggedIn) router.replace('/login')
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage)
      }
    }
  }, [router])

  const login = useCallback(
    async (email: string, password: string) => {
      await authService.login(email, password)
      setAuthenticated(true)
      router.push('/home')
    },
    [router]
  )
  const logout = useCallback(async () => {
    await authService.logout()
    setAuthenticated(false)
    router.replace('/login')
  }, [router])

  const value = useMemo(
    () => ({ ready, isAuthenticated, login, logout }),
    [ready, isAuthenticated, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export { AuthProvider, useAuth }
