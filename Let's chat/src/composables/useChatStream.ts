import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'

const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://api.deepseek.com'
const API_KEY = import.meta.env.VITE_API_KEY ?? ''
const DEFAULT_MODEL = import.meta.env.VITE_CHAT_MODEL ?? 'llama-3.1-8b-instant'

export function useChatStream() {
  const store = useChatStore()
  const isSending = ref(false)
  let abortController: AbortController | null = null

  async function sendMessage(userContent: string) {
    const key = API_KEY || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('lets-chat-api-key') : null)
    if (!key) {
      console.error('No API key. Set VITE_API_KEY in .env or paste key in settings.')
      return
    }

    store.ensureCurrentChat()
    store.addMessage('user', userContent)
    store.ensureAssistantMessage()
    store.isTyping = true
    isSending.value = true
    store.setLastAssistantMessageContent('')

    abortController = new AbortController()
    const url = `${API_BASE.replace(/\/$/, '')}/v1/chat/completions`
    const messages = store.currentMessages.map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: store.selectedModel || DEFAULT_MODEL,
          messages,
          stream: true,
        }),
        signal: abortController.signal,
      })

      if (!res.ok) {
        const errText = await res.text()
        store.setLastAssistantMessageContent(`[Error ${res.status}] ${errText}`)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        store.setLastAssistantMessageContent('[Error] No response body')
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split(/\r?\n/)
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> }
            const content = json.choices?.[0]?.delta?.content
            if (typeof content === 'string') {
              store.appendToLastAssistantMessage(content)
            }
          } catch {
            // ignore parse errors for non-JSON lines
          }
        }
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      store.setLastAssistantMessageContent(`[Error] ${(e as Error).message}`)
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
