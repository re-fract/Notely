import { Router } from 'express';
import { db } from '../db/index.js';
import { $users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await db.select().from($users).where(eq($users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const visibleId = `user_${Date.now()}`;
    
    // Insert user into database
    const [newUser] = await db.insert($users).values({
      visibleId,
      email,
      password, // In production, hash this with bcrypt!
      firstName: firstName || '',
      lastName: lastName || '',
    }).returning();

    return res.json({ 
      user: {
        id: newUser.visibleId,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Failed to sign up' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const [user] = await db.select().from($users).where(eq($users.email, email));

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({ 
      user: {
        id: user.visibleId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ error: 'Failed to sign in' });
  }
});

router.get('/user', async (req, res) => {
  try {
    const visibleId = req.headers['x-user-id'] as string;

    if (!visibleId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find user by visible ID
    const [user] = await db.select().from($users).where(eq($users.visibleId, visibleId));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ 
      user: {
        id: user.visibleId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to get user' });
  }
});

export { router as authRouter };
