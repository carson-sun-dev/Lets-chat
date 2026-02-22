<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import ChatSidebar from '@/components/ChatSidebar.vue'
import ChatMessageList from '@/components/ChatMessageList.vue'
import ChatInput from '@/components/ChatInput.vue'

const store = useChatStore()
const { sidebarOpen, currentChat } = storeToRefs(store)

store.ensureCurrentChat()
</script>

<template>
  <div class="chat-layout">
    <div
      v-if="sidebarOpen"
      class="sidebar-backdrop"
      aria-hidden="true"
      @click="store.sidebarOpen = false"
    />
    <ChatSidebar />
    <main class="chat-main">
      <header class="chat-header">
        <button
          type="button"
          class="hamburger"
          aria-label="Open menu"
          @click="store.sidebarOpen = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 class="chat-title">
          {{ currentChat?.title ?? "Let's chat" }}
        </h2>
      </header>
      <ChatMessageList />
      <ChatInput />
    </main>
  </div>
</template>

<style scoped>
.chat-layout {
  display: grid;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--color-bg, #fff);
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.sidebar-backdrop {
  display: block;
  position: fixed;
  inset: 0;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.4);
}
@media (min-width: 768px) {
  .sidebar-backdrop {
    display: none;
  }
}

@media (min-width: 768px) {
  .chat-layout {
    grid-template-columns: 16rem 1fr;
  }
}

.chat-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  background-color: #fff;
}

.chat-header {
  display: flex;
  height: 3rem;
  flex-shrink: 0;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 1rem;
  background-color: #fff;
}

.hamburger {
  display: flex;
  padding: 0.5rem;
  color: #6b7280;
  border-radius: 0.25rem;
}
.hamburger:hover {
  background-color: #f3f4f6;
}
:root.dark .hamburger:hover {
  background-color: #1f2937;
}

@media (min-width: 768px) {
  .hamburger {
    display: none;
  }
}

.chat-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}
</style>
