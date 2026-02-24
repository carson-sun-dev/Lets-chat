<script setup lang="ts">
import type { MessageRole } from '@/types/chat'

defineProps<{
  role: MessageRole
  content: string
}>()
</script>

<template>
  <!-- Assistant: avatar left, bubble right -->
  <div
    v-if="role === 'assistant'"
    class="bubble-row bubble-row-assistant"
  >
    <div class="bubble-avatar bubble-avatar-assistant">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v1.5M12 20.5V22M6 6H4.5M19.5 6H18M6 18H4.5M19.5 18H18" />
        <rect x="5" y="7" width="14" height="10" rx="2" />
        <circle cx="9" cy="11.5" r="1.25" fill="currentColor" />
        <circle cx="15" cy="11.5" r="1.25" fill="currentColor" />
        <path d="M9 15.5h6" />
      </svg>
    </div>
    <div class="bubble bubble-assistant">
      <p v-if="content" class="bubble-text whitespace-pre-wrap break-words">{{ content }}</p>
      <p v-else class="text-gray-500">...</p>
    </div>
  </div>
  <!-- User: bubble left, avatar right (so avatar is on the right) -->
  <div
    v-else
    class="bubble-row bubble-row-user"
  >
    <div class="bubble bubble-user">
      <p class="whitespace-pre-wrap break-words">{{ content }}</p>
    </div>
    <div class="bubble-avatar bubble-avatar-user">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.bubble-row {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  max-width: 100%;
}
.bubble-row-user {
  flex-direction: row;
  justify-content: flex-end;
}
.bubble-row-assistant {
  flex-direction: row;
  justify-content: flex-start;
}

.bubble-avatar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
}
.bubble-avatar-assistant {
  background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%);
  color: #fff;
}
.bubble-avatar-user {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
}

.bubble {
  max-width: 85%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.bubble-user {
  background: #2563eb;
  color: #fff;
  border-bottom-right-radius: 0.25rem;
}
.bubble-assistant {
  background: #e0e7ff;
  color: #1e1b4b;
  border: 1px solid #c7d2fe;
  border-bottom-left-radius: 0.25rem;
}
.bubble-text {
  line-height: 1.6;
}
:root.dark .bubble-assistant {
  background: #312e81;
  color: #e0e7ff;
  border-color: #4338ca;
}
</style>
