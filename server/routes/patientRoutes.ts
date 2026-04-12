import { Router } from 'express';
import { db } from '../database/db';
import { verifyToken, requireRole, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const patients = await db.query(`
      SELECT p.*, u.name, u.email, u.phone 
      FROM patients p 
      JOIN users u ON p.user_id = u.id
    `);
    res.json(patients.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-profile', verifyToken, requireRole('patient'), async (req: AuthRequest, res) => {
  try {
    const patient = await db.queryOne(`
      SELECT p.*, u.name, u.email, u.phone 
      FROM patients p 
      JOIN users u ON p.user_id = u.id
      WHERE u.id = ?
    `, [req.user?.id]);
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/my-profile', verifyToken, requireRole('patient'), async (req: AuthRequest, res) => {
  const { phone, age, gender, blood_group, address, emergency_contact, allergies, chronic_conditions } = req.body;
  try {
    const patient = await db.queryOne('SELECT id FROM patients WHERE user_id = ?', [req.user?.id]) as any;
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query(`
        UPDATE patients 
        SET age = $1, gender = $2, blood_group = $3, address = $4, emergency_contact = $5, allergies = $6, chronic_conditions = $7 
        WHERE id = $8
      `, [age, gender, blood_group, address, emergency_contact, allergies, chronic_conditions, patient.id]);
      
      await client.query('UPDATE users SET phone = $1 WHERE id = $2', [phone, req.user?.id]);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/emergencies', verifyToken, requireRole('patient'), async (req: AuthRequest, res) => {
  const { description, location } = req.body;
  try {
    const patient = await db.queryOne('SELECT id FROM patients WHERE user_id = ?', [req.user?.id]) as any;
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await db.execute(
      'INSERT INTO emergencies (patient_id, description, location) VALUES (?, ?, ?)',
      [patient.id, description, location]
    );
    res.status(201).json({ message: 'Emergency reported successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
