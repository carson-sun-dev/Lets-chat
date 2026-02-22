export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  role: MessageRole
  content: string
}

export interface Chat {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
}

export const STORAGE_KEY = 'lets-chat-conversations'
export const CURRENT_CHAT_KEY = 'lets-chat-current-id'
export const SETTINGS_KEY = 'lets-chat-settings'

export type ThemeMode = 'light' | 'dark' | 'system'

export const GROQ_MODELS = [
  { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
  { id: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B Versatile' },
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
  { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
] as const
