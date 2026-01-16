# Complete Setup Guide - AIdeation

This guide walks you through setting up the entire application from scratch.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A code editor (VS Code recommended)
- Web browser

---

## Step 1: Database Setup (Neon PostgreSQL)

### 1.1 Create a Neon Account
1. Go to [https://neon.tech](https://neon.tech)
2. Click **"Sign Up"** (free tier available)
3. Sign up with GitHub, Google, or email

### 1.2 Create a New Project
1. After signing in, click **"New Project"**
2. Enter a project name (e.g., `aideation`)
3. Select a region closest to you
4. Click **"Create Project"**

### 1.3 Get Your Database Connection String
1. On the project dashboard, you'll see a connection string
2. Click the **"Copy"** button next to the connection string
3. It looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
4. **Save this - you'll need it for DATABASE_URL**

### 1.4 Create the Notes Table
1. In Neon dashboard, click **"SQL Editor"** in the left sidebar
2. Run this SQL command:

```sql
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  "imageUrl" TEXT,
  user_id TEXT NOT NULL,
  editor_state TEXT
);
```

3. Click **"Run"** to execute

---

## Step 2: Supabase Setup (Image Storage) - FREE

### 2.1 Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** (free tier available)
3. Sign in with GitHub
4. Click **"New Project"**
5. Enter:
   - Project name: `aideation`
   - Database password: (create a strong password)
   - Region: Choose closest to you
6. Click **"Create new project"** (wait 2-3 minutes)

### 2.2 Create a Storage Bucket
1. In Supabase dashboard, click **"Storage"** in the left sidebar
2. Click **"New bucket"**
3. Enter bucket name: `note-images`
4. **Check "Public bucket"** (makes images accessible)
5. Click **"Create bucket"**

### 2.3 Get Your Supabase Credentials
1. Click **"Project Settings"** (gear icon) in the left sidebar
2. Click **"API"** tab
3. Copy these values:
   - **Project URL** → `SUPABASE_URL` (looks like `https://xxxxx.supabase.co`)
   - **anon public key** → `SUPABASE_ANON_KEY` (long string starting with `eyJ...`)

---

## Step 3: AI Provider Setup (FREE Options)

Choose ONE of these free AI providers:

### Option A: Groq (Recommended - Fastest & Free)

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up with Google or GitHub
3. Click **"API Keys"** in the left sidebar
4. Click **"Create API Key"**
5. Give it a name and click **"Create"**
6. **Copy the key** (starts with `gsk_`)

**Groq Limits (Free):**
- 14,400 requests/day
- 30 requests/minute
- Uses Llama 3.1 (very fast!)

### Option B: Google Gemini (Free)

1. Go to [https://aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API key"** in the left sidebar
4. Click **"Create API key"**
5. Select a project or create new
6. **Copy the API key**

**Gemini Limits (Free):**
- 60 requests/minute
- 1,500 requests/day

### Image Generation: Pollinations.ai (Completely FREE)

The app now uses **Pollinations.ai** for image generation - it's completely free and requires NO API key! Images are generated automatically when you create notes.

---

## Step 4: Environment Variables Configuration

### 4.1 Backend Environment (.env)

Navigate to the server folder and create the `.env` file:

```bash
cd c:\Users\Sid\Desktop\aideation-yt-main\react-app\server
```

Create a file named `.env` with this content:

```env
# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000

# Database - Neon PostgreSQL
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# AI Provider Selection: 'groq' or 'gemini'
AI_PROVIDER=groq

# Groq API Key (if using Groq)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx

# OR Google Gemini API Key (if using Gemini)
# GOOGLE_API_KEY=your-google-api-key

# Supabase Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4.2 Frontend Environment (.env)

Navigate to the react-app folder:

```bash
cd c:\Users\Sid\Desktop\aideation-yt-main\react-app
```

Create a file named `.env` with:

```env
VITE_API_URL=http://localhost:5000
```

---

## Step 5: Install New Dependencies

Since we changed some packages, reinstall dependencies:

```bash
cd c:\Users\Sid\Desktop\aideation-yt-main\react-app\server
npm install
```

---

## Step 6: Running the Application

### 6.1 Start the Backend Server

Open a terminal and run:

```bash
cd c:\Users\Sid\Desktop\aideation-yt-main\react-app\server
npm run dev
```

You should see:
```
Server running on port 5000
```

### 6.2 Start the Frontend

Open a **new terminal** and run:

```bash
cd c:\Users\Sid\Desktop\aideation-yt-main\react-app
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

---

## Step 7: Using the Application

### 7.1 Access the App
1. Open your browser
2. Go to **http://localhost:3000**

### 7.2 Create an Account
1. Click **"Get Started"**
2. You'll be redirected to sign in
3. Click **"Sign up"** link
4. Enter your details:
   - First Name
   - Last Name
   - Email
   - Password
5. Click **"Sign Up"**

### 7.3 Create Your First Note
1. On the dashboard, click the **"+ New Note Book"** card
2. Enter a name for your notebook (e.g., "My First Note")
3. Click **"Create"**
4. Wait for the AI to generate a thumbnail image (this may take 5-10 seconds)
5. You'll be redirected to the editor

### 7.4 Use AI Autocomplete
1. In the editor, start typing some text
2. Press **Shift + A** to trigger AI autocomplete
3. The AI will continue your text based on context

### 7.5 Auto-Save
- Your notes are automatically saved 500ms after you stop typing
- Watch the "Saved" indicator in the top right

---

## Free Tier Comparison

| Service | Free Tier | What You Get |
|---------|-----------|--------------|
| **Neon** | Forever free | 0.5 GB storage, 1 project |
| **Supabase** | Forever free | 1 GB storage, 50k monthly users |
| **Groq** | Forever free | 14,400 requests/day |
| **Gemini** | Forever free | 1,500 requests/day |
| **Pollinations** | Forever free | Unlimited image generation |

**Total Cost: $0/month** 🎉

---

## Troubleshooting

### Database Connection Error
```
Error: DATABASE_URL is not defined
```
**Solution**: Make sure your `.env` file exists in the `server` folder and contains the DATABASE_URL.

### Groq API Error
```
Error: No AI provider configured
```
**Solution**: 
1. Make sure `AI_PROVIDER=groq` is set in `.env`
2. Check your `GROQ_API_KEY` is correct
3. Verify the key starts with `gsk_`

### Supabase Upload Error
```
Error: SUPABASE_URL and SUPABASE_ANON_KEY are required
```
**Solution**:
1. Check both `SUPABASE_URL` and `SUPABASE_ANON_KEY` are in `.env`
2. Make sure the bucket `note-images` exists and is public

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Make sure the backend is running on port 5000 and CLIENT_URL is set correctly.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
1. Find and kill the process using the port:
   ```bash
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```
2. Or change the PORT in your `.env` file

---

## Quick Reference - All Environment Variables

### Server (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| CLIENT_URL | Frontend URL for CORS | http://localhost:3000 |
| DATABASE_URL | Neon PostgreSQL connection | postgresql://... |
| AI_PROVIDER | Which AI to use | groq |
| GROQ_API_KEY | Groq API key | gsk_... |
| GOOGLE_API_KEY | Gemini API key (alternative) | AIza... |
| SUPABASE_URL | Supabase project URL | https://xxx.supabase.co |
| SUPABASE_ANON_KEY | Supabase anon key | eyJ... |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000 |

---

## Need Help?

If you encounter issues:
1. Check the browser console (F12) for frontend errors
2. Check the terminal running the server for backend errors
3. Verify all environment variables are set correctly
4. Make sure both servers are running simultaneously
