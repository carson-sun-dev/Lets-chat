<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { storeToRefs } from 'pinia'
import { GROQ_MODELS } from '@/types/chat'
import type { ThemeMode } from '@/types/chat'

const store = useChatStore()
const { chatsForList, currentChatId, filteredChats, sidebarOpen, selectedModel, theme } = storeToRefs(store)

const systemPrefersDark = ref(false)
onMounted(() => {
  const m = window.matchMedia('(prefers-color-scheme: dark)')
  systemPrefersDark.value = m.matches
  m.addEventListener('change', () => {
    systemPrefersDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  })
})
const effectiveDark = computed(
  () => theme.value === 'dark' || (theme.value === 'system' && systemPrefersDark.value)
)

function cycleTheme(): void {
  const next: ThemeMode = theme.value === 'light' ? 'dark' : theme.value === 'dark' ? 'system' : 'light'
  store.setTheme(next)
}

function confirmClear(): void {
  if (window.confirm('Delete all chat history? This cannot be undone.')) {
    store.clearAllChats()
    store.sidebarOpen = false
  }
}
</script>

<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar-open': sidebarOpen }"
  >
    <div class="sidebar-header">
      <h1 class="sidebar-title">Let's chat</h1>
      <div class="header-actions">
        <button
          type="button"
          class="icon-btn clear-data-btn"
          title="Clear all chat data"
          aria-label="Clear all chat data"
          @click="confirmClear"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button
          type="button"
          class="sidebar-close only-mobile"
          aria-label="Close sidebar"
          @click="store.sidebarOpen = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    <div class="sidebar-body">
      <div class="sidebar-search">
        <input
          v-model="store.filteredChats"
          type="text"
          placeholder="Search conversations..."
          class="input search-input"
          aria-label="Search conversations"
        />
        <button
          v-if="store.filteredChats"
          type="button"
          class="search-clear"
          aria-label="Clear search"
          @click="store.filteredChats = ''"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <button
        type="button"
        class="btn-new"
        @click="store.newChat()"
      >
        New chat
      </button>
      <ul class="sidebar-list">
        <li v-for="chat in chatsForList" :key="chat.id">
          <button
            type="button"
            class="sidebar-item"
            :class="{ 'sidebar-item-active': currentChatId === chat.id }"
            @click="store.setCurrentChat(chat.id); store.sidebarOpen = false"
          >
            {{ chat.title }}
          </button>
        </li>
      </ul>
    </div>
    <div class="sidebar-settings">
      <label class="settings-label">Model</label>
      <select
        :value="selectedModel"
        class="input select-model"
        @change="store.setSelectedModel(($event.target as HTMLSelectElement).value)"
      >
        <option v-for="m in GROQ_MODELS" :key="m.id" :value="m.id">{{ m.label }}</option>
      </select>
    </div>
    <footer class="sidebar-footer">
      <router-link to="/settings" class="footer-link" @click="store.sidebarOpen = false">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Settings</span>
      </router-link>
      <button
        type="button"
        class="theme-btn"
        :title="`Theme: ${theme} (click to cycle)`"
        aria-label="Toggle theme"
        @click="cycleTheme()"
      >
        <template v-if="effectiveDark">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </template>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </template>
      </button>
    </footer>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 16rem;
  flex-shrink: 0;
  border-right: 1px solid #e5e7eb;
  background-color: #f9fafb;
}
.dark .sidebar {
  border-color: #374151;
  background-color: #111827;
}

/* Mobile: overlay, hidden by default */
@media (max-width: 767px) {
  .sidebar {
    position: fixed;
    inset: 0;
    z-index: 30;
    transform: translateX(-100%);
    transition: transform 0.2s ease-out;
  }
  .sidebar-open {
    transform: translateX(0);
  }
}

@media (min-width: 768px) {
  .sidebar {
    position: relative;
  }
}

.sidebar-header {
  display: flex;
  height: 3rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 0.75rem;
}
.dark .sidebar-header {
  border-color: #374151;
}

.sidebar-title {
  flex: 1;
  min-width: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}
.dark .sidebar-title {
  color: #f9fafb;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon-btn {
  padding: 0.375rem;
  color: #6b7280;
  border-radius: 0.25rem;
}
.icon-btn:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}
.dark .icon-btn:hover {
  background-color: #374151;
  color: #f9fafb;
}

.clear-data-btn:hover {
  color: #dc2626;
}
.dark .clear-data-btn:hover {
  color: #f87171;
}

.sidebar-close {
  padding: 0.375rem;
  color: #6b7280;
  border-radius: 0.25rem;
}
.sidebar-close:hover {
  background-color: #e5e7eb;
}
.dark .sidebar-close:hover {
  background-color: #374151;
}
@media (min-width: 768px) {
  .sidebar-close.only-mobile {
    display: none;
  }
}

.sidebar-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0.5rem;
}

.sidebar-search {
  position: relative;
  margin-bottom: 0.5rem;
}
.sidebar-search .search-input {
  padding-right: 2rem;
}
.search-clear {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  padding: 0.25rem;
  color: #6b7280;
  border-radius: 0.25rem;
}
.search-clear:hover {
  color: #1f2937;
  background-color: #e5e7eb;
}
.dark .search-clear {
  color: #9ca3af;
}
.dark .search-clear:hover {
  color: #f9fafb;
  background-color: #374151;
}

.input {
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background-color: #fff;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}
.input::placeholder {
  color: #9ca3af;
}
.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}
.dark .input {
  border-color: #4b5563;
  background-color: #1f2937;
  color: #f9fafb;
}
.dark .input::placeholder {
  color: #6b7280;
}

.btn-new {
  margin-bottom: 0.5rem;
  border-radius: 0.375rem;
  background-color: #2563eb;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
}
.btn-new:hover {
  background-color: #1d4ed8;
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 0 0.5rem;
  margin: 0;
  list-style: none;
}

.sidebar-item {
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sidebar-item:hover {
  background-color: #e5e7eb;
}
.sidebar-item-active {
  background-color: #dbeafe;
  color: #1e40af;
}
.dark .sidebar-item {
  color: #d1d5db;
}
.dark .sidebar-item:hover {
  background-color: #374151;
}
.dark .sidebar-item-active {
  background-color: rgba(59, 130, 246, 0.4);
  color: #93c5fd;
}

.sidebar-settings {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #e5e7eb;
}
.dark .sidebar-settings {
  border-color: #374151;
}

.settings-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
}
.dark .settings-label {
  color: #9ca3af;
}

.select-model {
  width: 100%;
  cursor: pointer;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #e5e7eb;
}
.dark .sidebar-footer {
  border-color: #374151;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-decoration: none;
  border-radius: 0.25rem;
  padding: 0.375rem;
}
.footer-link:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}
.dark .footer-link {
  color: #9ca3af;
}
.dark .footer-link:hover {
  background-color: #374151;
  color: #f9fafb;
}

.theme-btn {
  display: flex;
  padding: 0.375rem;
  color: #6b7280;
  border-radius: 0.25rem;
}
.theme-btn:hover {
  background-color: #e5e7eb;
  color: #1f2937;
}
.dark .theme-btn {
  color: #9ca3af;
}
.dark .theme-btn:hover {
  background-color: #374151;
  color: #f9fafb;
}
</style>
