<script setup lang="ts">
import { RouterView } from 'vue-router'
import { watch, onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'

const store = useChatStore()

function applyTheme(): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const mode = store.theme
  const isDark =
    mode === 'dark' ||
    (mode === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

applyTheme()
onMounted(() => {
  applyTheme()
  if (store.theme === 'system' && typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)
  }
})

watch(
  () => store.theme,
  () => {
    applyTheme()
  }
)
</script>

<template>
  <RouterView />
</template>
