<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const apiKey = ref('')
const saved = ref(false)

const STORAGE_KEY = 'lets-chat-api-key'

onMounted(() => {
  apiKey.value = sessionStorage.getItem(STORAGE_KEY) ?? ''
})

function save() {
  if (apiKey.value.trim()) {
    sessionStorage.setItem(STORAGE_KEY, apiKey.value.trim())
    saved.value = true
    setTimeout(() => { saved.value = false }, 2000)
  } else {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-container">
      <h1 class="settings-title">Settings</h1>

      <section class="settings-section how-to">
        <h2 class="section-title">How to start</h2>
        <ol class="steps">
          <li>
            <strong>Get an API key</strong> — Sign up at
            <a href="https://console.groq.com" target="_blank" rel="noopener">Groq Console</a>
            or
            <a href="https://platform.deepseek.com" target="_blank" rel="noopener">DeepSeek</a>
            and create an API key.
          </li>
          <li>
            <strong>Paste your key</strong> — Enter it below (saved for this tab) or set
            <code>VITE_API_KEY</code> in a <code>.env</code> file in the project root for persistence.
          </li>
          <li>
            <strong>Pick a model</strong> — In the sidebar, choose a model (e.g. Llama 3.1 8B) before chatting.
          </li>
          <li>
            <strong>Start chatting</strong> — Go back to the chat, type a message, and press Send.
          </li>
        </ol>
      </section>

      <section class="settings-section">
        <h2 class="section-title">API Key</h2>
        <p class="section-desc">
          Stored only in this browser tab. For a permanent key, use <code>.env</code> and <code>VITE_API_KEY</code>.
        </p>
        <label for="apikey" class="label">API Key</label>
        <input
          id="apikey"
          v-model="apiKey"
          type="password"
          placeholder="Paste your API key"
          class="input"
          @blur="save"
        />
        <p v-if="saved" class="saved-msg">Saved for this session.</p>
      </section>

      <div class="actions">
        <button type="button" class="btn btn-primary" @click="save(); router.push('/')">
          Save and back to chat
        </button>
        <button type="button" class="btn btn-secondary" @click="router.push('/')">
          Back
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  min-height: 100vh;
  padding: 1.5rem;
  background-color: #f9fafb;
}

.settings-container {
  max-width: 32rem;
  margin: 0 auto;
}

.settings-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
}

.settings-section {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  background-color: #fff;
  border: 1px solid #e5e7eb;
}

.how-to {
  border-color: #bfdbfe;
  background: linear-gradient(to bottom, #eff6ff 0%, #fff 100%);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.section-desc {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.steps {
  margin: 0;
  padding-left: 1.25rem;
  color: #374151;
  font-size: 0.9375rem;
  line-height: 1.6;
}

.steps li {
  margin-bottom: 0.5rem;
}

.steps li:last-child {
  margin-bottom: 0;
}

.steps a {
  color: #2563eb;
  text-decoration: underline;
}

.steps a:hover {
  color: #1d4ed8;
}

.steps code {
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background-color: #f3f4f6;
  font-size: 0.8125rem;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 0.9375rem;
  background-color: #fff;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.saved-msg {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #059669;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background-color: #2563eb;
  color: #fff;
  border: none;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}
</style>
