import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { completionRouter } from './routes/completion.js';
import { notebookRouter } from './routes/notebook.js';
import { noteRouter } from './routes/note.js';
import { storageRouter } from './routes/storage.js';
import { authRouter } from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/completion', completionRouter);
app.use('/api/createNoteBook', notebookRouter);
app.use('/api/deleteNote', noteRouter);
app.use('/api/saveNote', noteRouter);
app.use('/api/uploadToStorage', storageRouter);
app.use('/api/auth', authRouter);
app.use('/api/notes', noteRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', '..', 'dist');
  app.use(express.static(distPath));

  // Fallback: serve index.html for any non-API route (SPA routing)
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
