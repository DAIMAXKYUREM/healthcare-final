import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/db';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-min-32-chars';

router.post('/register', async (req, res) => {
  const { name, email, password, phone, age, gender, blood_group } = req.body;
  
  try {
    const existingUser = await db.queryOne('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    const hash = bcrypt.hashSync(password, 10);
    
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const userResult = await client.query(
        'INSERT INTO users (name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [name, email, hash, 'patient', phone]
      );
      const userId = userResult.rows[0].id;

      await client.query(
        'INSERT INTO patients (user_id, age, gender, blood_group) VALUES ($1, $2, $3, $4)',
        [userId, age, gender, blood_group]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    const user = await db.queryOne('SELECT * FROM users WHERE email = ?', [email]) as any;
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    if (role && user.role !== role) {
      res.status(401).json({ message: `Access denied. You are not a ${role}.` });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', verifyToken, async (req: AuthRequest, res) => {
  try {
    const user = await db.queryOne('SELECT id, name, email, role, phone FROM users WHERE id = ?', [req.user?.id]);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
