import { Router } from 'express';
import { db } from '../db/index.js';
import { $notes } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Get all notes for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notes = await db
      .select()
      .from($notes)
      .where(eq($notes.userId, userId));

    return res.json({ notes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Get single note
router.get('/:noteId', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    const { noteId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notes = await db
      .select()
      .from($notes)
      .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));

    if (notes.length !== 1) {
      return res.status(404).json({ error: 'Note not found' });
    }

    return res.json({ note: notes[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Delete note
router.post('/', async (req, res) => {
  try {
    const { noteId } = req.body;
    
    if (!noteId) {
      return res.status(400).json({ error: 'Note ID is required' });
    }

    await db.delete($notes).where(eq($notes.id, parseInt(noteId)));
    
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Save note (update editor state)
router.put('/', async (req, res) => {
  try {
    const { noteId, editorState } = req.body;
    
    if (!editorState || !noteId) {
      return res.status(400).json({ error: 'Missing editorState or noteId' });
    }

    const parsedNoteId = parseInt(noteId);
    const notes = await db.select().from($notes).where(eq($notes.id, parsedNoteId));
    
    if (notes.length !== 1) {
      return res.status(500).json({ error: 'Failed to update' });
    }

    const note = notes[0];
    if (note.editorState !== editorState) {
      await db
        .update($notes)
        .set({ editorState })
        .where(eq($notes.id, parsedNoteId));
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
});

export { router as noteRouter };
