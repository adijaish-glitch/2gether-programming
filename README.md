# 2gether Programming

A real-time pair programming platform built with React, Monaco Editor, Express, and Socket.io.

## Features

- **Monaco Editor** — VS Code-grade code editor in the browser
- **Real-time code sync** — Every keystroke synced via Socket.io
- **Live code execution** — Run JavaScript in a secure sandbox
- **Built-in chat** — Talk with your pair without leaving the editor
- **Modern landing page** — Framer-style dark theme with animations

## Project Structure

```
2gether-programming/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx      # Landing page (all sections)
│   │   │   └── Room.tsx      # Pair programming room
│   │   ├── components/IDE/
│   │   │   ├── Editor.tsx    # Monaco editor wrapper
│   │   │   ├── TopNav.tsx    # Room header bar
│   │   │   ├── Console.tsx   # Code output panel
│   │   │   └── ChatPanel.tsx # Chat sidebar
│   │   ├── hooks/
│   │   │   ├── use-socket.ts # Socket.io real-time hook
│   │   │   └── use-run-code.ts # Code execution hook
│   │   └── lib/utils.ts
│   ├── vite.config.ts        # Proxies /api and /socket.io → server
│   └── tailwind.config.js
├── server/               # Express + Socket.io backend
│   └── src/
│       ├── index.ts          # Server entry point (port 3001)
│       ├── socket.ts         # Real-time event handlers
│       └── routes/
│           ├── rooms.ts      # Room management API
│           └── run-code.ts   # JavaScript execution (vm2)
└── package.json              # Root: runs both together
```

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Install dependencies

```bash
npm run install:all
```

This installs dependencies for the root, server, and client.

### 2. Run in development

```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 5173) concurrently.

Open: **http://localhost:5173**

### 3. Use the app

1. Click **"Start Coding"** to generate a room and jump in
2. Copy the **Room ID** from the top bar
3. Open a second tab (or share the URL) and paste the Room ID to join
4. Code together in real time!

## Running Individually

```bash
# Backend only (http://localhost:3001)
npm run dev:server

# Frontend only (http://localhost:5173)
npm run dev:client
```

## How It Works

- **Frontend** (Vite) proxies `/api/*` and `/socket.io/*` to the Express server
- **Socket.io** handles room joining, real-time code sync, and chat
- **vm2** sandboxes JavaScript execution on the server safely
- **Monaco Editor** provides the VS Code-style editor experience

## Hosting

### Local Network
The frontend dev server is accessible at `http://[your-ip]:5173`

### Production Build

```bash
# Build the frontend
cd client && npm run build

# Serve static files from Express
# Add this to server/src/index.ts:
# app.use(express.static(path.join(__dirname, '../../client/dist')));
```

### Deploy on Render / Railway / Fly.io
1. Set `PORT` environment variable
2. Build command: `cd client && npm install && npm run build`
3. Start command: `cd server && npm install && node dist/index.js`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS v3, Framer Motion |
| Editor | Monaco Editor (@monaco-editor/react) |
| Routing | Wouter |
| Data fetching | TanStack Query |
| Icons | Lucide React |
| Backend | Node.js, Express |
| Real-time | Socket.io |
| Code execution | vm2 (sandboxed) |
