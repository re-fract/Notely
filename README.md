# Notely

AI-assisted note taking built with React (Vite) and an Express backend. It provides rich-text editing (TipTap), quick AI autocompletion (Groq), simple thumbnail generation (Pollinations), and persistent storage via Neon + Drizzle, with images saved to Supabase Storage.

## Table of Contents

- Overview
- Tech Stack
- Project Structure
- Prerequisites
- Setup & Configuration
- Running Locally
- Scripts
- API Endpoints
- Architecture
- Data Model
- Development Notes
- Build & Deploy
- Limitations
- Why React + Vite + Express?
- Contributing

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS + Shadcn-style components
- TipTap editor with debounced autosave
- Express.js backend
- Groq (Llama 3.1) for AI completions
- Pollinations.ai for free thumbnail images
- Neon PostgreSQL + Drizzle ORM
- Supabase Storage (public bucket)

## Project Structure

```
react-app/
├── src/                    # React frontend
│   ├── components/         # UI + editor components
│   │   ├── ui/             # Shadcn-style primitives
│   │   ├── CreateNoteDialog.tsx
│   │   ├── DeleteButton.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── TipTapEditor.tsx
│   │   ├── TipTapMenuBar.tsx
│   │   └── UserButton.tsx
│   ├── contexts/           # Auth + app contexts
│   │   └── AuthContext.tsx
│   ├── lib/                # Utilities & types
│   │   ├── types.ts
│   │   ├── useDebounce.ts
│   │   └── utils.ts
│   ├── pages/              # Routed pages
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── Notebook.tsx
│   │   ├── SignIn.tsx
│   │   └── SignUp.tsx
│   ├── App.tsx             # Routing setup
│   ├── index.css
│   └── main.tsx
├── server/                 # Express backend
│   ├── db/
│   │   ├── index.ts        # Neon + Drizzle init
│   │   └── schema.ts       # Tables: users, notes
│   ├── lib/
│   │   ├── ai.ts           # Groq completions + image prompts
│   │   └── supabase.ts     # Supabase storage uploads
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── completion.ts
│   │   ├── note.ts
│   │   ├── notebook.ts
│   │   └── storage.ts
│   └── index.ts            # Server entry
├── package.json            # Frontend scripts
├── vite.config.ts          # Dev server + proxy
├── tailwind.config.js
└── tsconfig.json
```

## Prerequisites

- Node.js 18+
- npm (or yarn/pnpm)
- Neon PostgreSQL account (free)
- Supabase project (free) with a public bucket `note-images`
- Groq API key (free)

## Setup & Configuration

### 1) Install dependencies

```bash
# Frontend
cd react-app
npm install

# Backend
cd server
npm install
```

### 2) Configure environment

- Frontend: copy [.env.example](.env.example) → `.env` (optional; the Vite dev proxy handles `/api`).
- Backend: copy [server/.env.example](server/.env.example) → `server/.env` and fill values.

Backend `.env` keys used by the app:
- `PORT` (default 5000)
- `CLIENT_URL` (default http://localhost:3000)
- `DATABASE_URL` (Neon PostgreSQL)
- `GROQ_API_KEY` (for AI completions)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` (public bucket `note-images`)

### 3) Running Locally

```bash
# Option A: run both with one command
cd react-app
npm run dev:all

# Option B: separate terminals
# Terminal 1
cd react-app/server
npm run dev
# Terminal 2
cd react-app
npm run dev
```

- Frontend: http://localhost:3000 (proxy `/api` → `http://localhost:5000`, see [vite.config.ts](vite.config.ts))
- Backend: http://localhost:5000

## Scripts

Frontend (package.json):
- `dev`: start Vite dev server
- `build`: type-check + build frontend
- `preview`: preview built app
- `server`: start backend from root via tsx
- `dev:all`: run frontend and backend together

Backend (server/package.json):
- `dev`: watch + run Express server (tsx)
- `build`: compile TypeScript
- `start`: run compiled server

## API Endpoints

Auth
- `POST /api/auth/signup` — create user
- `POST /api/auth/signin` — sign in
- `GET /api/auth/user` — get current user (requires `x-user-id` header)

Notes
- `GET /api/notes` — list notes for current user (`x-user-id`)
- `GET /api/notes/:noteId` — get single note (`x-user-id`)
- `POST /api/deleteNote` — delete note (body: `noteId`)
- `PUT /api/saveNote` — save editor state (body: `noteId`, `editorState`)

Notebook & Media
- `POST /api/createNoteBook` — create notebook (body: `name`, header `x-user-id`); generates thumbnail via AI → Pollinations
- `POST /api/uploadToStorage` — upload existing thumbnail URL to Supabase and persist URL

AI
- `POST /api/completion` — short autocomplete response based on prompt

## Architecture

- **Frontend (React + Vite)**: Routing in [src/App.tsx](src/App.tsx), TipTap editor, local auth state in [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx). Dev server proxies `/api` to backend (see [vite.config.ts](vite.config.ts)).
- **Backend (Express)**: Feature routers mounted in [server/index.ts](server/index.ts): `auth`, `notes`, `notebook`, `storage`, `completion`.
- **Database (Neon + Drizzle)**: Connection in [server/db/index.ts](server/db/index.ts), schema in [server/db/schema.ts](server/db/schema.ts).
- **AI (Groq)**: Completions + prompt generation in [server/lib/ai.ts](server/lib/ai.ts).
- **Images (Pollinations + Supabase)**: Pollinations → URL → upload via [server/lib/supabase.ts](server/lib/supabase.ts) to public bucket.

## Development Notes

- Vite dev server runs on port 3000 and proxies `/api`.
- CORS allows origin from `CLIENT_URL` (default `http://localhost:3000`).
- Auth state is stored in `localStorage` (demo only); see [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx).
- Schema definitions are in [server/db/schema.ts](server/db/schema.ts).

## Build & Deploy

Frontend
```bash
cd react-app
npm run build
# Deploy the generated dist/ to your host (Vercel/Netlify/etc.)
```

Backend
```bash
cd react-app/server
npm run build
npm start
```

Production checklist
- Set all backend environment variables
- Update `CLIENT_URL` and CORS
- Use secure auth (hash passwords, add proper auth provider)

## Data Model

`users`
- `id` (PK, serial), `user_id` (visibleId, unique), `email` (unique), `password`, `first_name`, `last_name`, `created_at`.

`notes`
- `id` (PK, serial), `name`, `created_at`, `imageUrl`, `user_id` (FK by value), `editor_state`.

See [server/db/schema.ts](server/db/schema.ts) for the authoritative definitions.

## Overview

Notely helps you ideate faster. Create notebooks, write freely in a rich editor, and use AI to autocomplete thoughts or generate simple thumbnail images.

Core use cases:
- Rapid idea capture with low‑friction sign‑in and autosave
- AI autocomplete for continuing sentences in context
- Lightweight visual thumbnails per notebook
- Organized notebooks with per‑note routing

## Running Flows

- **Frontend (React + Vite)**: Routing in [src/App.tsx](src/App.tsx), TipTap editor, local auth state in [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx). Dev server proxies `/api` to the backend (see [vite.config.ts](vite.config.ts)).
- **Backend (Express)**: Routes in [server/index.ts](server/index.ts) mount feature routers for `auth`, `notes`, `notebook`, `storage`, and `completion`.
- **Database (Neon + Drizzle)**: Connection setup in [server/db/index.ts](server/db/index.ts), schema in [server/db/schema.ts](server/db/schema.ts).
- **AI (Groq)**: Text completion and prompt generation in [server/lib/ai.ts](server/lib/ai.ts) using Llama 3.1.
- **Images (Pollinations + Supabase)**: Pollinations generates a URL; [server/lib/supabase.ts](server/lib/supabase.ts) uploads to Supabase public bucket.

### Create Notebook Flow
1. Client calls `POST /api/createNoteBook` with `name` and `x-user-id` header.
2. Backend generates an image description via Groq, then a thumbnail URL via Pollinations.
3. Note is inserted into `notes` with `imageUrl`; API returns `note_id`.
4. Optional: Client calls `POST /api/uploadToStorage` to persist the image to Supabase and update `imageUrl` to the public URL.

### Autocomplete Flow
1. Client calls `POST /api/completion` with a short `prompt`.
2. Backend responds with a concise completion (plain text) suitable to append to the editor.


## Why React + Vite + Express?

- Fast local DX, clear client/server boundaries, simple deployment story. Each tier scales independently and can be hosted on your preferred platforms.
