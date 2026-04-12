import { Router } from 'express';
import { db } from '../database/db.js';
import { verifyToken, requireRole, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Patient: Get my bills
router.get('/my', verifyToken, requireRole('patient'), async (req: AuthRequest, res) => {
  try {
    const patient = await db.queryOne('SELECT id FROM patients WHERE user_id = ?', [req.user?.id]) as any;
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const bills = await db.query(`
      SELECT b.*, a.appointment_date, d.name as doctor_name
      FROM billing b
      JOIN appointments a ON b.appointment_id = a.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users d ON doc.user_id = d.id
      WHERE b.patient_id = ?
      ORDER BY b.id DESC
    `, [patient.id]);
    res.json(bills.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all bills
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const bills = await db.query(`
      SELECT b.*, a.appointment_date, p_user.name as patient_name, d_user.name as doctor_name
      FROM billing b
      JOIN appointments a ON b.appointment_id = a.id
      JOIN patients p ON b.patient_id = p.id
      JOIN users p_user ON p.user_id = p_user.id
      JOIN doctors doc ON a.doctor_id = doc.id
      JOIN users d_user ON doc.user_id = d_user.id
      ORDER BY b.id DESC
    `);
    res.json(bills.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Pay bill (Simulated)
router.put('/:id/pay', verifyToken, async (req: AuthRequest, res) => {
  const { payment_method } = req.body;
  try {
    await db.execute('UPDATE billing SET payment_status = $1, payment_method = $2, paid_at = CURRENT_TIMESTAMP WHERE id = $3',
      ['paid', payment_method || 'card', req.params.id]);
    res.json({ message: 'Bill paid successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
