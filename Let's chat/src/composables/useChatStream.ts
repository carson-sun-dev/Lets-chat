import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import apiClient, { isCancelError, normalizeApiError } from '@/api/client'

const DEFAULT_MODEL = import.meta.env.VITE_CHAT_MODEL ?? 'llama-3.1-8b-instant'

interface ChatCompletionChoice {
  message?: {
    content?: string
  }
  delta?: {
    content?: string
  }
}

interface ChatCompletionResponse {
  choices?: ChatCompletionChoice[]
}

export function useChatStream() {
  const store = useChatStore()
  const isSending = ref(false)
  let abortController: AbortController | null = null

  async function sendMessage(userContent: string) {
    store.ensureCurrentChat()
    store.addMessage('user', userContent)
    store.ensureAssistantMessage()
    store.isTyping = true
    isSending.value = true
    store.setLastAssistantMessageContent('')

    abortController = new AbortController()
    const messages = store.currentMessages.map((m) => ({ role: m.role, content: m.content }))

    try {
      const response = await apiClient.post<ChatCompletionResponse>(
        '/v1/chat/completions',
        {
          model: store.selectedModel || DEFAULT_MODEL,
          messages,
          // Using non-streaming responses with axios for now.
          stream: false,
        },
        {
          signal: abortController.signal,
        }
      )

      const data = response.data
      const choice = data.choices?.[0]
      const content =
        choice?.message?.content ??
        choice?.delta?.content ??
        ''

      if (typeof content === 'string' && content.trim()) {
        store.setLastAssistantMessageContent(content)
      } else {
        store.setLastAssistantMessageContent('[Error] Empty response from model')
      }
    } catch (error) {
      if (isCancelError(error)) {
        return
      }
      const normalized = normalizeApiError(error)
      store.setLastAssistantMessageContent(normalized.message)
    } finally {
      store.isTyping = false
      isSending.value = false
      abortController = null
      store.persist()
    }
  }

  function abort() {
    if (abortController) {
      abortController.abort()
    }
  }

  return { sendMessage, isSending, abort }
}
