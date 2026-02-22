# Chat API – minimal request/response (stream)

Use this for Postman/cURL tests and for implementing the frontend.

## Request (stream: true)

**POST** `https://api.deepseek.com/v1/chat/completions`

Headers:

- `Content-Type: application/json`
- `Authorization: Bearer YOUR_API_KEY`

Body (JSON):

```json
{
  "model": "deepseek-chat",
  "messages": [
    { "role": "user", "content": "Hello, say hi in one sentence." }
  ],
  "stream": true
}
```

## Response (SSE)

Streamed lines, e.g.:

```
data: {"id":"...","choices":[{"delta":{"role":"assistant","content":""},"index":0}]}

data: {"id":"...","choices":[{"delta":{"content":"Hi"},"index":0}]}

data: {"id":"...","choices":[{"delta":{"content":"!"},"index":0}]}

data: [DONE]
```

- Parse each line that starts with `data: `.
- If the line is `data: [DONE]`, end the stream.
- Otherwise, parse as JSON and append `choices[0].delta.content` (if present) to the assistant message.

## cURL example

```bash
curl -X POST https://api.deepseek.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"Hi"}],"stream":true}'
```

(Groq: use `https://api.groq.com/openai/v1/chat/completions` and a Groq model name.)
