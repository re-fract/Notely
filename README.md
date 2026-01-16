# AIdeation - React + Vite + Express

This project has been converted from a Next.js 13.4 App Router application to a standard React application with a separate Express backend.

## Project Structure

```
react-app/
├── src/                    # React frontend
│   ├── components/         # React components
│   │   ├── ui/            # Shadcn UI components
│   │   ├── CreateNoteDialog.tsx
│   │   ├── DeleteButton.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── TipTapEditor.tsx
│   │   ├── TipTapMenuBar.tsx
│   │   └── UserButton.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/               # Utility functions
│   │   ├── types.ts
│   │   ├── useDebounce.ts
│   │   └── utils.ts
│   ├── pages/             # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── Notebook.tsx
│   │   ├── SignIn.tsx
│   │   └── SignUp.tsx
│   ├── App.tsx            # Main app with routing
│   ├── index.css          # Global styles
│   └── main.tsx           # Entry point
├── server/                 # Express backend
│   ├── db/                # Database configuration
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── lib/               # Utility libraries
│   │   ├── firebase.ts
│   │   └── openai.ts
│   ├── routes/            # API routes
│   │   ├── auth.ts
│   │   ├── completion.ts
│   │   ├── firebase.ts
│   │   ├── note.ts
│   │   └── notebook.ts
│   └── index.ts           # Express server entry
├── package.json           # Frontend dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Key Architectural Changes

### 1. Routing
- **Before**: Next.js App Router with file-based routing
- **After**: React Router DOM with explicit route definitions in `App.tsx`

### 2. Server-Side Logic
- **Before**: Next.js API routes (`/api/*`) and server components
- **After**: Separate Express.js server with equivalent API endpoints

### 3. Authentication
- **Before**: Clerk authentication with Next.js middleware
- **After**: Custom auth context with localStorage persistence (replaceable with any auth provider)

### 4. Data Fetching
- **Before**: Server components with direct database access
- **After**: Client-side fetching via API calls

### 5. Image Optimization
- **Before**: Next.js `Image` component with automatic optimization
- **After**: Standard HTML `img` tags (consider adding a CDN for production)

### 6. Environment Variables
- **Before**: `process.env.VARIABLE`
- **After**: Frontend uses `import.meta.env.VITE_VARIABLE`, backend uses `process.env.VARIABLE`

## Getting Started

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd react-app
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Set Up Environment Variables

```bash
# Frontend (.env in react-app folder)
cp .env.example .env

# Backend (.env in server folder)
cd server
cp .env.example .env
# Edit .env with your actual values
```

### 3. Set Up Database

The project uses Drizzle ORM with Neon PostgreSQL. Your existing database should work without changes.

```bash
# Generate migrations if needed
cd server
npx drizzle-kit generate:pg
```

### 4. Run the Application

```bash
# Terminal 1: Start the backend
cd react-app/server
npm run dev

# Terminal 2: Start the frontend
cd react-app
npm run dev
```

Or use concurrently:
```bash
cd react-app
npm run dev:all
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features Preserved

✅ AI-powered note taking with OpenAI GPT-3.5  
✅ DALL·E image generation for note thumbnails  
✅ Rich text editing with TipTap  
✅ Auto-save functionality with debouncing  
✅ Firebase storage for images  
✅ Neon PostgreSQL database with Drizzle ORM  
✅ Tailwind CSS styling with Shadcn UI components  
✅ Responsive design  
✅ Typewriter animation on homepage  

## Trade-offs and Considerations

### Benefits of Migration
1. **No vendor lock-in**: Standard React/Express stack
2. **Deployment flexibility**: Deploy frontend and backend separately
3. **Easier debugging**: Clear separation of concerns
4. **Scalability**: Backend can be scaled independently

### Considerations
1. **No SSR/SSG**: Pages are client-rendered (can add with React frameworks if needed)
2. **Manual image optimization**: Consider using a CDN or image service
3. **Two servers**: Requires running both frontend and backend
4. **CORS handling**: API calls require proper CORS configuration

## Authentication Note

The current implementation uses a simple auth context with localStorage. For production, consider:

- **Firebase Auth**: Already using Firebase for storage
- **Auth0**: Enterprise-ready authentication
- **Supabase Auth**: If migrating database
- **JWT tokens**: For stateless authentication

## Database

The database schema remains unchanged:

```typescript
export const $notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  imageUrl: text('imageUrl'),
  userId: text('user_id').notNull(),
  editorState: text('editor_state'),
});
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Create new user |
| `/api/auth/signin` | POST | Sign in user |
| `/api/auth/user` | GET | Get current user |
| `/api/notes` | GET | Get all user notes |
| `/api/notes/:noteId` | GET | Get single note |
| `/api/createNoteBook` | POST | Create new notebook |
| `/api/deleteNote` | POST | Delete a note |
| `/api/saveNote` | PUT | Save note content |
| `/api/uploadToFirebase` | POST | Upload image to Firebase |
| `/api/completion` | POST | AI text completion |

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

### Backend (Railway/Render/AWS)
```bash
cd server
npm run build
npm start
```

Remember to:
1. Set environment variables in production
2. Update CORS origins for production URLs
3. Use secure authentication in production
