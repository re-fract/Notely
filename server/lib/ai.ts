import dotenv from 'dotenv';
dotenv.config();

import Groq from 'groq-sdk';

// Initialize Groq client (required)
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// Chat completion function - works with multiple providers
export async function generateChatCompletion(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!groq) throw new Error('No AI provider configured. Set GROQ_API_KEY');
  return generateWithGroq(systemPrompt, userPrompt);
}

// Groq implementation (Llama 3.1 - fast & free)
async function generateWithGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!groq) throw new Error('Groq client not initialized');
  
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant', // Fast and free
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content || '';
}

// Removed Gemini/OpenAI implementations; using Groq only.

// Generate image prompt for DALL-E style generation
export async function generateImagePrompt(name: string): Promise<string> {
  const systemPrompt = `You are a creative AI that generates short, minimalistic thumbnail descriptions. 
Your descriptions should be suitable for AI image generation and describe flat, modern styled illustrations.
Keep descriptions under 50 words.`;
  
  const userPrompt = `Generate a thumbnail description for a notebook titled "${name}". 
Make it minimalistic and flat styled.`;

  return generateChatCompletion(systemPrompt, userPrompt);
}

// Generate image using free alternatives
export async function generateImage(imageDescription: string): Promise<string> {
  // Option 1: Use Pollinations.ai (completely free, no API key needed)
  const encodedPrompt = encodeURIComponent(imageDescription);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=256&height=256&nologo=true`;
  
  // Verify the image is accessible
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    if (response.ok) {
      return imageUrl;
    }
  } catch (error) {
    console.error('Pollinations error:', error);
  }

  // Fallback: Use a placeholder with the note name
  return `https://placehold.co/256x256/22c55e/white?text=${encodeURIComponent(imageDescription.slice(0, 20))}`;
}

// Streaming chat completion for autocomplete
export async function streamChatCompletion(
  systemPrompt: string,
  userPrompt: string
): Promise<ReadableStream> {
  if (!groq) throw new Error('No AI provider configured. Set GROQ_API_KEY');

  const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 256,
    });

  // Convert Groq stream to ReadableStream
  return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });
}
