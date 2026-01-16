import { Router } from 'express';
import { generateChatCompletion } from '../lib/ai.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;

    const systemPrompt = `You are a helpful AI embedded in a notion text editor app that is used to autocomplete sentences.
The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
AI is a well-behaved and well-mannered individual.
AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.`;

    const userPrompt = `I am writing a piece of text in a notion text editor app.
Help me complete my train of thought here: ##${prompt}##
keep the tone of the text consistent with the rest of the text.
keep the response short and sweet. Only output the completion, no extra text.`;

    const completion = await generateChatCompletion(systemPrompt, userPrompt);

    // Return in Vercel AI SDK compatible format
    res.setHeader('Content-Type', 'text/plain');
    res.send(completion);
  } catch (error) {
    console.error('Completion error:', error);
    res.status(500).json({ error: 'Failed to generate completion' });
  }
});

export { router as completionRouter };
