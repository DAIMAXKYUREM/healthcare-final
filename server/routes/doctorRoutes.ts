import { Router } from 'express';
import { db } from '../database/db';
import { verifyToken, requireRole, AuthRequest } from '../middleware/authMiddleware';
import { format, parse, addMinutes, isBefore } from 'date-fns';

const router = Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const doctors = await db.query(`
      SELECT d.id, d.specialization, d.consultation_fee, u.name, u.email, dept.name as department
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN departments dept ON d.department_id = dept.id
    `);
    res.json(doctors.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get logged-in doctor's profile
router.get('/my-profile', verifyToken, requireRole('doctor'), async (req: AuthRequest, res) => {
  try {
    const doctor = await db.queryOne(`
      SELECT d.*, u.name, u.email, u.phone, dept.name as department_name
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN departments dept ON d.department_id = dept.id
      WHERE u.id = ?
    `, [req.user?.id]);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update logged-in doctor's profile
router.put('/my-profile', verifyToken, requireRole('doctor'), async (req: AuthRequest, res) => {
  const { specialization, qualification, consultation_fee, phone } = req.body;
  try {
    const doctor = await db.queryOne('SELECT id FROM doctors WHERE user_id = ?', [req.user?.id]) as any;
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE doctors SET specialization = $1, qualification = $2, consultation_fee = $3 WHERE id = $4',
        [specialization, qualification, consultation_fee, doctor.id]);
      await client.query('UPDATE users SET phone = $1 WHERE id = $2',
        [phone, req.user?.id]);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get logged-in doctor's schedule
router.get('/schedule', verifyToken, requireRole('doctor'), async (req: AuthRequest, res) => {
  try {
    const doctor = await db.queryOne('SELECT id FROM doctors WHERE user_id = ?', [req.user?.id]) as any;
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const schedule = await db.query('SELECT * FROM doctor_schedules WHERE doctor_id = ?', [doctor.id]);
    res.json(schedule.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update logged-in doctor's schedule
router.post('/schedule', verifyToken, requireRole('doctor'), async (req: AuthRequest, res) => {
  const { schedules } = req.body; // Array of { day_of_week, start_time, end_time }
  try {
    const doctor = await db.queryOne('SELECT id FROM doctors WHERE user_id = ?', [req.user?.id]) as any;
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM doctor_schedules WHERE doctor_id = $1', [doctor.id]);
      for (const s of schedules) {
        if (s.start_time && s.end_time) {
          await client.query('INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4)',
            [doctor.id, s.day_of_week, s.start_time, s.end_time]);
        }
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    res.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available slots for a specific doctor on a specific date
router.get('/:id/available-slots', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { date } = req.query as { date: string };
  
  try {
    const dateObj = new Date(date);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayOfWeek = days[dateObj.getDay()];

    const schedule = await db.queryOne('SELECT * FROM doctor_schedules WHERE doctor_id = ? AND day_of_week = ?', [id, dayOfWeek]) as any;
    
    if (!schedule || !schedule.start_time || !schedule.end_time) {
      return res.json([]); // No working hours on this day
    }

    const appointments = await db.query('SELECT appointment_time FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND status != $3', [id, date, 'cancelled']);
    const bookedTimes = appointments.rows.map((a: any) => {
      // Postgres returns time as "HH:mm:ss", so we take the first 5 characters "HH:mm"
      return typeof a.appointment_time === 'string' ? a.appointment_time.substring(0, 5) : a.appointment_time;
    });

    const slots = [];
    let currentTime = parse(schedule.start_time, 'HH:mm', dateObj);
    const endTime = parse(schedule.end_time, 'HH:mm', dateObj);
    const now = new Date();

    while (isBefore(currentTime, endTime)) {
      const timeString = format(currentTime, 'HH:mm');
      
      // Check if slot is in the past for today
      const isPast = date === format(now, 'yyyy-MM-dd') && isBefore(currentTime, now);

      if (!bookedTimes.includes(timeString) && !isPast) {
        slots.push(timeString);
      }
      currentTime = addMinutes(currentTime, 30); // 30 min slots
    }

    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
