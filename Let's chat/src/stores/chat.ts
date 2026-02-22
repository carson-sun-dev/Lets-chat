import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Chat, ChatMessage } from '@/types/chat'
import type { ThemeMode } from '@/types/chat'
import { STORAGE_KEY, CURRENT_CHAT_KEY, SETTINGS_KEY, GROQ_MODELS } from '@/types/chat'

function generateId(): string {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function loadFromStorage(): { chats: Chat[]; currentId: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const chats: Chat[] = !raw ? [] : (() => {
      const parsed = JSON.parse(raw) as Chat[]
      return Array.isArray(parsed) ? parsed : []
    })()
    const currentId = localStorage.getItem(CURRENT_CHAT_KEY)
    return { chats, currentId: currentId || null }
  } catch {
    return { chats: [], currentId: null }
  }
}

function saveToStorage(chats: Chat[], currentId: string | null): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
    if (currentId) localStorage.setItem(CURRENT_CHAT_KEY, currentId)
    else localStorage.removeItem(CURRENT_CHAT_KEY)
  } catch {
    // ignore
  }
}

function loadSettings(): { selectedModel: string; theme: ThemeMode } {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { selectedModel: GROQ_MODELS[0].id, theme: 'system' }
    const parsed = JSON.parse(raw) as { selectedModel?: string; theme?: ThemeMode }
    const model = parsed.selectedModel && GROQ_MODELS.some((m) => m.id === parsed.selectedModel)
      ? parsed.selectedModel
      : GROQ_MODELS[0].id
    const theme = ['light', 'dark', 'system'].includes(parsed.theme ?? '') ? parsed.theme! : 'system'
    return { selectedModel: model, theme }
  } catch {
    return { selectedModel: GROQ_MODELS[0].id, theme: 'system' }
  }
}

function saveSettings(selectedModel: string, theme: ThemeMode): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ selectedModel, theme }))
  } catch {
    // ignore
  }
}

export const useChatStore = defineStore('chat', () => {
  const { chats: loadedChats, currentId: loadedCurrentId } = loadFromStorage()
  const chats = ref<Chat[]>(loadedChats)
  const currentChatId = ref<string | null>(
    loadedCurrentId && loadedChats.some((c) => c.id === loadedCurrentId) ? loadedCurrentId : null
  )
  const userInput = ref('')
  const isTyping = ref(false)
  const sidebarOpen = ref(true)
  const { selectedModel: loadedModel, theme: loadedTheme } = loadSettings()
  const selectedModel = ref(loadedModel)
  const theme = ref<ThemeMode>(loadedTheme)

  const currentChat = computed(() => {
    const id = currentChatId.value
    if (!id) return null
    return chats.value.find((c) => c.id === id) ?? null
  })

  const currentMessages = computed(() => currentChat.value?.messages ?? [])

  const filteredChats = ref<string>('')

  const chatsForList = computed(() => {
    const list = [...chats.value].sort((a, b) => b.createdAt - a.createdAt)
    const q = filteredChats.value.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    )
  })

  function ensureCurrentChat(): Chat {
    let chat = currentChat.value
    if (!chat) {
      const newChat: Chat = {
        id: generateId(),
        title: 'New chat',
        messages: [],
        createdAt: Date.now(),
      }
      chats.value = [newChat, ...chats.value]
      currentChatId.value = newChat.id
      chat = newChat
      persist()
    }
    return chat
  }

  function setCurrentChat(id: string | null): void {
    currentChatId.value = id
  }

  function newChat(): void {
    const newChat: Chat = {
      id: generateId(),
      title: 'New chat',
      messages: [],
      createdAt: Date.now(),
    }
    chats.value = [newChat, ...chats.value]
    currentChatId.value = newChat.id
    persist()
  }

  function addMessage(role: ChatMessage['role'], content: string): void {
    const chat = ensureCurrentChat()
    chat.messages.push({ role, content })
    if (role === 'user' && chat.title === 'New chat') {
      chat.title = content.slice(0, 40) || 'New chat'
    }
    persist()
  }

  function appendToLastAssistantMessage(segment: string): void {
    const chat = currentChat.value
    if (!chat?.messages.length) return
    const last = chat.messages[chat.messages.length - 1]
    if (last.role === 'assistant') {
      last.content += segment
      persist()
    }
  }

  function setLastAssistantMessageContent(content: string): void {
    const chat = currentChat.value
    if (!chat?.messages.length) return
    const last = chat.messages[chat.messages.length - 1]
    if (last.role === 'assistant') {
      last.content = content
      persist()
    }
  }

  function ensureAssistantMessage(): void {
    const chat = currentChat.value
    if (!chat) return
    const last = chat.messages[chat.messages.length - 1]
    if (last?.role !== 'assistant') {
      chat.messages.push({ role: 'assistant', content: '' })
      persist()
    }
  }

  function deleteChat(id: string): void {
    chats.value = chats.value.filter((c) => c.id !== id)
    if (currentChatId.value === id) {
      currentChatId.value = chats.value[0]?.id ?? null
    }
    persist()
  }

  function persist(): void {
    saveToStorage(chats.value, currentChatId.value)
  }

  function clearAllChats(): void {
    chats.value = []
    currentChatId.value = null
    persist()
  }

  function setSelectedModel(model: string): void {
    selectedModel.value = model
    saveSettings(selectedModel.value, theme.value)
  }

  function setTheme(next: ThemeMode): void {
    theme.value = next
    saveSettings(selectedModel.value, theme.value)
  }

  return {
    chats,
    currentChatId,
    currentChat,
    currentMessages,
    userInput,
    isTyping,
    sidebarOpen,
    filteredChats,
    chatsForList,
    selectedModel,
    theme,
    setSelectedModel,
    setTheme,
    setCurrentChat,
    newChat,
    addMessage,
    appendToLastAssistantMessage,
    setLastAssistantMessageContent,
    ensureAssistantMessage,
    ensureCurrentChat,
    deleteChat,
    clearAllChats,
    persist,
  }
})
