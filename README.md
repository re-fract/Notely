# Notely — React + Vite + Express

A React + Vite frontend with a separate Express backend. Features AI-assisted note taking, thumbnail generation, rich text editing, and Neon + Drizzle persistence.

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

## Quickstart

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

### 3) Run locally

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

- Frontend: http://localhost:3000 (see [vite.config.ts](vite.config.ts), proxies `/api` → `http://localhost:5000`)
- Backend: http://localhost:5000

## Tech Highlights

- React + Vite + TypeScript, Tailwind + Shadcn-style components
- TipTap rich text editor with autosave (debounced)
- AI text completion via Groq (Llama 3.1)
- Thumbnail images via Pollinations.ai (free) → stored in Supabase
- Data: Neon PostgreSQL + Drizzle ORM

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

## Development Notes

- Vite dev server runs on port 3000 and proxies `/api`.
- CORS is allowed from `CLIENT_URL` (default `http://localhost:3000`).
- Store the signed-in user in localStorage (see [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)).
- Drizzle schema: see [server/db/schema.ts](server/db/schema.ts).

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
