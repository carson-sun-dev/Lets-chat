# Let's chat

A Vue 3 browser-side LLM chat app. The front end talks directly to a compatible chat API (e.g. DeepSeek or Groq) with no backend or database; conversations are stored in the browser via localStorage.

## Setup

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Configure API key**

   - Copy `.env.example` to `.env`.
   - In `.env`, set `VITE_API_KEY` to your API key from [DeepSeek](https://platform.deepseek.com) or [Groq](https://console.groq.com).
   - Do not commit `.env` (it is in `.gitignore`).

   Optional: set `VITE_API_BASE` (e.g. `https://api.groq.com`) and `VITE_CHAT_MODEL` if you use another provider. You can also open **Settings** (gear icon in the sidebar) and paste an API key there; it is stored only for the current tab (session).

3. **Run**

   ```sh
   npm run dev
   ```

## Security note

The API key is read by the front end and will be present in the built JavaScript. This is acceptable for learning or portfolio use. For production, use a backend that holds the key and proxies requests to the LLM.

## Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm run preview` – preview production build
- `npm run type-check` – TypeScript check
- `npm run lint` – lint

## Docs

- [API request/response example (stream)](./docs/api-example.md) – for Postman/cURL and implementation reference.
