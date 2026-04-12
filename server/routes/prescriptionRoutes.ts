import { Router } from 'express';
import { db } from '../database/db';
import { verifyToken, requireRole, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/my', verifyToken, requireRole('patient'), async (req: AuthRequest, res) => {
  try {
    const patient = await db.queryOne('SELECT id FROM patients WHERE user_id = ?', [req.user?.id]) as any;
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const prescriptionsRes = await db.query(`
      SELECT p.*, a.appointment_date, du.name as doctor_name, d.specialization
      FROM prescriptions p
      JOIN appointments a ON p.appointment_id = a.id
      JOIN doctors d ON p.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      WHERE p.patient_id = ?
      ORDER BY p.visit_date DESC
    `, [patient.id]);
    
    const prescriptions = prescriptionsRes.rows;

    for (let p of prescriptions) {
      const itemsRes = await db.query('SELECT * FROM prescription_items WHERE prescription_id = ?', [p.id]);
      p.items = itemsRes.rows;
    }

    res.json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Doctor: Create a prescription
router.post('/', verifyToken, requireRole('doctor'), async (req: AuthRequest, res) => {
  const { appointment_id, patient_id, diagnosis, items, file_data } = req.body;
  
  try {
    const doctor = await db.queryOne('SELECT id, consultation_fee FROM doctors WHERE user_id = ?', [req.user?.id]) as any;
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      // 1. Insert prescription
      const pRes = await client.query(
        'INSERT INTO prescriptions (appointment_id, doctor_id, patient_id, diagnosis, visit_date, file_data) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5) RETURNING id',
        [appointment_id, doctor.id, patient_id, diagnosis, file_data || null]
      );
      const prescriptionId = pRes.rows[0].id;
      
      // 2. Insert items
      for (const item of items) {
        await client.query(
          'INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration, notes) VALUES ($1, $2, $3, $4, $5, $6)',
          [prescriptionId, item.medicine_name, item.dosage, item.frequency, item.duration, item.notes]
        );
      }

      // 3. Mark appointment as completed
      await client.query('UPDATE appointments SET status = $1 WHERE id = $2', ['completed', appointment_id]);

      // 4. Generate Bill
      await client.query(
        'INSERT INTO billing (appointment_id, patient_id, amount) VALUES ($1, $2, $3)',
        [appointment_id, patient_id, doctor.consultation_fee || 0]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    res.status(201).json({ message: 'Prescription added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
