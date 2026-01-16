import { Router } from 'express';
import { db } from '../db/index.js';
import { $notes } from '../db/schema.js';
import { uploadFileToSupabase } from '../lib/supabase.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({ error: 'Note ID is required' });
    }

    const notes = await db
      .select()
      .from($notes)
      .where(eq($notes.id, parseInt(noteId)));

    if (!notes[0]?.imageUrl) {
      return res.status(400).json({ error: 'No image URL' });
    }

    // Upload to Supabase Storage
    const supabaseUrl = await uploadFileToSupabase(
      notes[0].imageUrl,
      notes[0].name
    );

    if (!supabaseUrl) {
      return res.status(500).json({ error: 'Failed to upload to Supabase' });
    }

    // Update the note with the Supabase URL
    await db
      .update($notes)
      .set({
        imageUrl: supabaseUrl,
      })
      .where(eq($notes.id, parseInt(noteId)));

    return res.json({ success: true, url: supabaseUrl });
  } catch (error) {
    console.error('Supabase upload error:', error);
    return res.status(500).json({ error: 'Failed to upload to Supabase' });
  }
});

export { router as storageRouter };
