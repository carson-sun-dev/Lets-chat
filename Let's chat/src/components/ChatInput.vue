<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useChatStream } from '@/composables/useChatStream'

const store = useChatStore()
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const { sendMessage, isSending } = useChatStream()

async function handleSubmit() {
  const text = store.userInput.trim()
  if (!text || isSending.value) return
  store.userInput = ''
  await sendMessage(text)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}
</script>

<template>
  <div class="input-bar-wrap">
    <form class="input-bar" @submit.prevent="handleSubmit">
      <textarea
        ref="textareaRef"
        v-model="store.userInput"
        placeholder="Type a message..."
        rows="1"
        class="input-bar-textarea"
        :disabled="isSending"
        @keydown="onKeydown"
      />
      <button
        type="submit"
        class="input-bar-btn"
        :disabled="!store.userInput.trim() || isSending"
      >
        Send
      </button>
    </form>
  </div>
</template>

<style scoped>
.input-bar-wrap {
  padding: 1rem;
  background-color: #fff;
}
:root.dark .input-bar-wrap {
  background-color: #111827;
}

.input-bar {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  max-width: 48rem;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  border-radius: 1.5rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
:root.dark .input-bar {
  background-color: #1f2937;
  border-color: #374151;
}

.input-bar-textarea {
  flex: 1;
  min-height: 2.75rem;
  padding: 0.625rem 0;
  background: transparent;
  border: none;
  resize: none;
  font-size: 0.9375rem;
  color: #111827;
  outline: none;
}
:root.dark .input-bar-textarea {
  color: #f9fafb;
}
.input-bar-textarea::placeholder {
  color: #9ca3af;
}
:root.dark .input-bar-textarea::placeholder {
  color: #6b7280;
}

.input-bar-btn {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background-color: #2563eb;
  font-weight: 500;
  font-size: 0.875rem;
  color: #fff;
}
.input-bar-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}
.input-bar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
