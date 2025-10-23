import axios from 'axios'
import api from './api.client'

type User = { id?: number; name?: string; email?: string } | null
type LoginResponse = { token: string; user?: User } | { error?: string }

class AuthService {
  private token: string | null = null
  private readonly STORAGE_KEY = 'auth_token'

  restoreFromStorage(): string | null {
    if (typeof window === 'undefined') return null
    try {
      this.token = localStorage.getItem(this.STORAGE_KEY)
    } catch (e) {
      console.warn('AuthService: localStorage unavailable', e)
      this.token = null
    }
    return this.token
  }

  setToken(t: string | null) {
    this.token = t
    if (typeof window === 'undefined') return
    try {
      if (t) localStorage.setItem(this.STORAGE_KEY, t)
      else localStorage.removeItem(this.STORAGE_KEY)
    } catch (e) {
      console.warn('AuthService: could not write token to storage', e)
    }
  }

  getToken(): string | null {
    if (this.token) return this.token
    if (typeof window === 'undefined') return null
    try {
      this.token = localStorage.getItem(this.STORAGE_KEY)
    } catch {
      this.token = null
    }
    return this.token
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user?: User }> {
    try {
      const { data } = await api.post<LoginResponse>('/login', {
        email,
        password,
      })

      if ('token' in data && typeof data.token === 'string') {
        const token = data.token || 'fake_token'
        const user = data.user ?? null
        this.setToken(token)
        return { token, user }
      }
      const message =
        'error' in data && data.error
          ? data.error
          : 'Login failed: token not provided by server'
      throw new Error(message)
    } catch (err: unknown) {
      let message = 'Login failed'
      if (axios.isAxiosError(err)) {
        const data = err.response?.data
        message = data?.error ?? data?.message ?? err.message ?? message
      } else if (err instanceof Error) {
        message = err.message
      }

      throw new Error(message)
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/logout').catch(() => null)
    } finally {
      this.setToken(null)
    }
  }
}

const authService = new AuthService()
export default authService
export type { User }
