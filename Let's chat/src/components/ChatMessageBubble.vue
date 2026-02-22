<script setup lang="ts">
import { computed } from 'vue'
import type { MessageRole } from '@/types/chat'
import { renderMarkdown } from '@/utils/markdown'

const props = defineProps<{
  role: MessageRole
  content: string
}>()

const html = computed(() => renderMarkdown(props.content))
</script>

<template>
  <!-- Assistant: avatar left, bubble right -->
  <div
    v-if="role === 'assistant'"
    class="bubble-row bubble-row-assistant"
  >
    <div class="bubble-avatar bubble-avatar-assistant">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H6m12 0h1.5M4.5 16.5H6m12 0h1.5M8.25 21v-1.5M12 3a.75.75 0 01.75.75v.75h1.5v-.75A.75.75 0 0115 3h.75v1.5h1.5V3h.75a.75.75 0 01.75.75v.75h1.5v-.75A.75.75 0 0121 4.5h-.75v1.5h-1.5V4.5H18a.75.75 0 01-.75.75v.75h-1.5v-.75A.75.75 0 0015 4.5h-.75v1.5H12.75V4.5H12a.75.75 0 00-.75.75v.75h-1.5v-.75A.75.75 0 009 3h.75v1.5h1.5V3H12zM6 9.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H6.75A.75.75 0 016 10.5v-.75zm9 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75zM6 14.25a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75v-.75zm9 0a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75z" />
      </svg>
    </div>
    <div class="bubble bubble-assistant">
      <div
        v-if="content"
        class="prose prose-sm max-w-none break-words"
        v-html="html"
      />
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
</style>
