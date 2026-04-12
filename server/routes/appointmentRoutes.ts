import { Router } from 'express';
import { db } from '../database/db.js';
import { verifyToken, requireRole, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', verifyToken, requireRole('patient', 'admin'), async (req: AuthRequest, res) => {
  const { doctor_id, appointment_date, appointment_time, reason } = req.body;
  
  try {
    // Get patient ID for the logged-in user
    let patient_id;
    if (req.user?.role === 'patient') {
      const patient = await db.queryOne('SELECT id FROM patients WHERE user_id = ?', [req.user.id]) as any;
      if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
      patient_id = patient.id;
    } else {
      patient_id = req.body.patient_id; // Admin booking for someone
    }

    // Assign token number (simple logic: count existing appointments for that doctor on that date + 1)
    const countQuery = await db.queryOne('SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND appointment_date = ?', [doctor_id, appointment_date]) as any;
    const token_number = parseInt(countQuery.count, 10) + 1;

    await db.execute(`
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, token_number, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [patient_id, doctor_id, appointment_date, appointment_time, token_number, reason]);

    res.status(201).json({ message: 'Appointment booked successfully', token_number });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my', verifyToken, async (req: AuthRequest, res) => {
  try {
    let appointments;
    if (req.user?.role === 'patient') {
      appointments = await db.query(`
        SELECT a.*, u.name as doctor_name, d.specialization
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u ON d.user_id = u.id
        JOIN patients p ON a.patient_id = p.id
        WHERE p.user_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `, [req.user.id]);
    } else if (req.user?.role === 'doctor') {
      appointments = await db.query(`
        SELECT a.*, u.name as patient_name
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE d.user_id = ?
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
      `, [req.user.id]);
    } else {
      appointments = await db.query(`
        SELECT a.*, pu.name as patient_name, du.name as doctor_name
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users pu ON p.user_id = pu.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users du ON d.user_id = du.id
        ORDER BY a.appointment_date DESC
      `);
    }
    res.json(appointments.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/cancel', verifyToken, async (req: AuthRequest, res) => {
  const { id } = req.params;
  try {
    const appointment = await db.queryOne('SELECT * FROM appointments WHERE id = ?', [id]) as any;
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (req.user?.role === 'patient') {
      const patient = await db.queryOne('SELECT id FROM patients WHERE user_id = ?', [req.user.id]) as any;
      if (appointment.patient_id !== patient.id) return res.status(403).json({ message: 'Access denied' });
    } else if (req.user?.role === 'doctor') {
      const doctor = await db.queryOne('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]) as any;
      if (appointment.doctor_id !== doctor.id) return res.status(403).json({ message: 'Access denied' });
    }

    await db.execute('UPDATE appointments SET status = $1 WHERE id = $2', ['cancelled', id]);
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
