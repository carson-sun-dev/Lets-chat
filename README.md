# Let's Chat

一个基于 Vue 3 + TypeScript 的前端聊天应用，可直接对接兼容 OpenAI Chat Completions 协议的 LLM API（如 DeepSeek、Groq）。


---

## ✨ 项目亮点

- 🧩 纯前端架构，克隆后可快速启动
- 🗂️ 多会话管理：新建、切换、搜索、清空
- 🤖 模型切换：内置多种 Groq 常见模型
- 🎨 主题模式：浅色 / 深色 / 跟随系统
- 🔑 双 API Key 方案：`.env` 长期配置 + Settings 临时配置
- 💾 本地持久化：聊天记录和设置自动保存

---

## 🧱 技术栈

- `Vue 3` + `TypeScript`
- `Vite`
- `Pinia`
- `Vue Router`
- `Axios`
- `TailwindCSS v4`
- `ESLint` + `Oxlint` + `Prettier`
- `Vitest` + `jsdom`

---

## 📁 项目结构

> 当前仓库的前端主工程位于子目录 `Let's chat/`。

```text
Lets-chat/
├─ README.md
├─ Let's chat/
│  ├─ package.json
│  ├─ docs/
│  │  └─ api-example.md
│  └─ src/
│     ├─ api/
│     ├─ composables/
│     ├─ stores/
│     ├─ router/
│     ├─ views/
│     ├─ components/
│     ├─ types/
│     ├─ assets/
│     ├─ App.vue
│     └─ main.ts
```

---

## 🚀 快速开始

### 1) 克隆项目并进入目录

```bash
git clone https://github.com/carson-sun-dev/Lets-chat.git
cd Lets-chat
cd "Let's chat"
```

### 2) 安装依赖

```bash
npm install
```

### 3) 配置 API Key（推荐）

在 `Let's chat/` 下创建 `.env` 文件：

```env
VITE_API_KEY=your_api_key_here
# 可选：默认 https://api.deepseek.com
VITE_API_BASE=https://api.deepseek.com
# 可选：默认 llama-3.1-8b-instant
VITE_CHAT_MODEL=llama-3.1-8b-instant
```

### 4) 启动开发环境

```bash
npm run dev
```

### 5) 访问应用

- `http://localhost:5173`

---

## ⚙️ 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建（含类型检查）
npm run preview      # 本地预览构建结果
npm run type-check   # TypeScript 类型检查
npm run lint         # ESLint + Oxlint 自动修复
npm run test:unit    # 运行单元测试
npm run format       # 格式化 src 目录
```

---

## 🧠 功能说明

- 进入应用后会自动创建一个新会话
- 左侧栏支持会话搜索与切换
- 输入消息后按 `Enter` 可发送（`Shift + Enter` 换行）
- 侧边栏可切换模型和主题
- Settings 页面可保存当前标签页 API Key

---

## 🔐 安全说明

该项目为前端直连模型服务。若将 `VITE_API_KEY` 写入前端环境变量，构建产物中可能被读取。

- 学习/演示/作品集场景：可接受
- 生产环境：建议使用后端代理，服务端持有真实密钥

---

## 🗄️ 本地存储键名

- 会话列表：`lets-chat-conversations`
- 当前会话 ID：`lets-chat-current-id`
- 设置项（模型/主题）：`lets-chat-settings`
- 临时 API Key（Settings 页）：`lets-chat-api-key`（`sessionStorage`）

---
