import axios, { AxiosInstance } from 'axios'
import authService from './auth.service'

export const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30_000,
  headers: { 'Content-type': 'application/json' },
  withCredentials: false,
})

api.interceptors.request.use(
  (config) => {
    try {
      const token = authService.getToken()
      if (token) {
        config.headers = config.headers ?? {}
        config.headers['Authorization'] = `Bearer ${token}`
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('failed to read token', e)
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    try {
      const status = error?.response?.status
      if (status === 401) {
        await authService.logout().catch(() => null)

        if (typeof window !== 'undefined') {
          const current = window.location.pathname
          if (current !== '/login') {
            window.location.replace('/login')
          }
        }
      }
    } catch (e) {
      if (process.env.NODE_ENV === 'development') {
        console.error('api.response interceptor error handler failed', e)
      }
    }

    return Promise.reject(error)
  }
)

export default api
