import axios, { AxiosError, AxiosInstance } from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://api.deepseek.com'
const API_KEY_ENV = import.meta.env.VITE_API_KEY ?? ''

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE.replace(/\/$/, ''),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60_000,
})

apiClient.interceptors.request.use(
  (config) => {
    const sessionKey =
      typeof sessionStorage !== 'undefined'
        ? sessionStorage.getItem('lets-chat-api-key')
        : null
    const key = API_KEY_ENV || sessionKey

    if (!key) {
      return Promise.reject(
        new Error('No API key. Set VITE_API_KEY in .env or paste key in settings.')
      )
    }

    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${key}`
    return config
  },
  (error) => Promise.reject(error)
)

export function normalizeApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    if (isCancelError(error)) {
      return new Error('Request was cancelled')
    }

    const status = error.response?.status
    let message = error.message

    const data = error.response?.data
    if (typeof data === 'string' && data.trim()) {
      message = data
    } else if (data && typeof data === 'object') {
      const maybeMessage =
        // Common OpenAI / LLM-style error shape
        (data as any).error?.message ??
        (data as any).message
      if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
        message = maybeMessage
      }
    }

    if (status) {
      return new Error(`[Error ${status}] ${message}`)
    }
    return new Error(message)
  }

  return error instanceof Error ? error : new Error(String(error))
}

export function isCancelError(error: unknown): boolean {
  if (axios.isCancel(error)) return true
  if (!axios.isAxiosError(error)) return false
  return error.code === 'ERR_CANCELED'
}

export default apiClient

