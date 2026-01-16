import { Router } from 'express';
import { db } from '../db/index.js';
import { $notes } from '../db/schema.js';
import { generateImage, generateImagePrompt } from '../lib/ai.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    // Get userId from request (from auth middleware or body for now)
    const userId = req.body.userId || req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Generate image description using AI
    const imageDescription = await generateImagePrompt(name);
    if (!imageDescription) {
      return res.status(500).json({ error: 'Failed to generate image description' });
    }

    // Generate image using free service (Pollinations.ai)
    const imageUrl = await generateImage(imageDescription);
    if (!imageUrl) {
      return res.status(500).json({ error: 'Failed to generate image' });
    }

    const note_ids = await db
      .insert($notes)
      .values({
        name,
        userId: userId as string,
        imageUrl: imageUrl,
      })
      .returning({
        insertedId: $notes.id,
      });

    return res.json({
      note_id: note_ids[0].insertedId,
    });
  } catch (error) {
    console.error('Create notebook error:', error);
    return res.status(500).json({ error: 'Failed to create notebook' });
  }
});

export { router as notebookRouter };
