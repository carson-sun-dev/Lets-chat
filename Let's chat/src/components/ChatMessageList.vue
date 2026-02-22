<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '@/stores/chat'
import ChatMessageBubble from './ChatMessageBubble.vue'

const listRef = ref<HTMLElement | null>(null)
const store = useChatStore()
const { currentMessages, isTyping } = storeToRefs(store)

function scrollToBottom() {
  nextTick(() => {
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  })
}

watch([currentMessages, isTyping], scrollToBottom, { deep: true })
</script>

<template>
  <div ref="listRef" class="message-list">
    <template v-if="currentMessages.length">
      <ChatMessageBubble
        v-for="(msg, i) in currentMessages"
        :key="i"
        :role="msg.role"
        :content="msg.content"
      />
    </template>
    <div v-else class="empty-hint">
      <p>Start a conversation. Messages appear here.</p>
    </div>
    <div v-if="isTyping" class="typing-indicator">
      <span class="typing-dot" />
      <span class="typing-text">AI is typing...</span>
    </div>
  </div>
</template>

<style scoped>
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.empty-hint {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
}
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background-color: #f3f4f6;
  border-bottom-left-radius: 0.25rem;
}
.typing-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: #3b82f6;
  animation: pulse 1s ease-in-out infinite;
}
.typing-text {
  font-size: 0.875rem;
  color: #6b7280;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
</style>
