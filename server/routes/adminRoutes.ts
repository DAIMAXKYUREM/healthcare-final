import { Router } from 'express';
import { db } from '../database/db.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';
import bcrypt from 'bcryptjs';

const router = Router();

// Apply middleware to all admin routes
router.use(verifyToken, requireRole('admin'));

// --- DOCTORS ---

router.get('/doctors', async (req, res) => {
  try {
    const doctors = await db.query(`
      SELECT d.id, d.specialization, d.consultation_fee, u.name, u.email, u.phone, dept.name as department
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN departments dept ON d.department_id = dept.id
      ORDER BY u.created_at DESC
    `);
    res.json(doctors.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/doctors', async (req, res) => {
  const { name, email, password, phone, specialization, department_id, consultation_fee } = req.body;

  try {
    const existingUser = await db.queryOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const userResult = await client.query(
          'INSERT INTO users (name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [name, email, passwordHash, 'doctor', phone]
      );
      const userId = userResult.rows[0].id;

      await client.query(
          'INSERT INTO doctors (user_id, specialization, department_id, consultation_fee) VALUES ($1, $2, $3, $4)',
          [userId, specialization, department_id || null, consultation_fee || 0]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    res.status(201).json({ message: 'Doctor created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- PATIENTS ---

router.get('/patients', async (req, res) => {
  try {
    const patients = await db.query(`
      SELECT p.id, p.age, p.gender, p.blood_group, u.name, u.email, u.phone
      FROM patients p
      JOIN users u ON p.user_id = u.id
      ORDER BY u.created_at DESC
    `);
    res.json(patients.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/patients', async (req, res) => {
  const { name, email, password, phone, age, gender, address, blood_group } = req.body;

  try {
    const existingUser = await db.queryOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const userResult = await client.query(
          'INSERT INTO users (name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [name, email, passwordHash, 'patient', phone]
      );
      const userId = userResult.rows[0].id;

      await client.query(
          'INSERT INTO patients (user_id, age, gender, address, blood_group) VALUES ($1, $2, $3, $4, $5)',
          [userId, age, gender, address, blood_group]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    res.status(201).json({ message: 'Patient created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- DEPARTMENTS ---
router.get('/departments', async (req, res) => {
  try {
    const departments = await db.query('SELECT * FROM departments');
    res.json(departments.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- STAFF ---
router.get('/staff', async (req, res) => {
  try {
    const staff = await db.query(`
      SELECT s.id, s.designation, s.shift, s.salary, u.name, u.email, u.phone, dept.name as department
      FROM staff s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN departments dept ON s.department_id = dept.id
      ORDER BY u.created_at DESC
    `);
    res.json(staff.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/staff', async (req, res) => {
  const { name, email, password, phone, designation, department_id, shift, salary } = req.body;
  try {
    const existingUser = await db.queryOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const passwordHash = bcrypt.hashSync(password, 10);
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const userResult = await client.query(
          'INSERT INTO users (name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [name, email, passwordHash, 'staff', phone]
      );
      const userId = userResult.rows[0].id;

      await client.query(
          'INSERT INTO staff (user_id, designation, department_id, shift, salary) VALUES ($1, $2, $3, $4, $5)',
          [userId, designation, department_id || null, shift, salary || 0]
      );
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    res.status(201).json({ message: 'Staff created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- METRICS ---
router.get('/metrics', async (req, res) => {
  try {
    const activeDoctors = await db.queryOne("SELECT COUNT(*) as count FROM users WHERE role = 'doctor' AND is_active = true");
    const activePatients = await db.queryOne("SELECT COUNT(*) as count FROM users WHERE role = 'patient' AND is_active = true");
    const availableStaff = await db.queryOne("SELECT COUNT(*) as count FROM users WHERE role = 'staff' AND is_active = true");
    const upcomingAppointments = await db.queryOne("SELECT COUNT(*) as count FROM appointments WHERE status = 'scheduled' AND appointment_date >= CURRENT_DATE");
    const emergencies = await db.queryOne("SELECT COUNT(*) as count FROM emergencies WHERE status = 'reported' OR status = 'assigned'");

    const totalIncome = await db.queryOne("SELECT COALESCE(SUM(amount), 0) as total FROM billing WHERE payment_status = 'paid'");
    const totalExpenses = await db.queryOne("SELECT COALESCE(SUM(amount), 0) as total FROM expenses");

    res.json({
      activeDoctors: parseInt(activeDoctors?.count || '0'),
      activePatients: parseInt(activePatients?.count || '0'),
      availableStaff: parseInt(availableStaff?.count || '0'),
      upcomingAppointments: parseInt(upcomingAppointments?.count || '0'),
      emergencies: parseInt(emergencies?.count || '0'),
      totalIncome: parseFloat(totalIncome?.total || '0'),
      totalExpenses: parseFloat(totalExpenses?.total || '0'),
      profit: parseFloat(totalIncome?.total || '0') - parseFloat(totalExpenses?.total || '0')
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- EMERGENCIES ---
router.get('/emergencies', async (req, res) => {
  try {
    const emergencies = await db.query(`
      SELECT e.*, p.age, p.gender, u.name as patient_name, u.phone as patient_phone
      FROM emergencies e
      LEFT JOIN patients p ON e.patient_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY e.reported_at DESC
    `);
    res.json(emergencies.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/emergencies/:id', async (req, res) => {
  const { status } = req.body;
  try {
    await db.execute('UPDATE emergencies SET status = ?, resolved_at = CASE WHEN ? = \'resolved\' THEN CURRENT_TIMESTAMP ELSE resolved_at END WHERE id = ?', [status, status, req.params.id]);
    res.json({ message: 'Emergency updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- EXPENSES ---
router.get('/expenses', async (req, res) => {
  try {
    const expenses = await db.query('SELECT * FROM expenses ORDER BY date DESC');
    res.json(expenses.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/expenses', async (req, res) => {
  const { description, amount, category, date } = req.body;
  try {
    await db.execute('INSERT INTO expenses (description, amount, category, date) VALUES (?, ?, ?, ?)', [description, amount, category, date]);
    res.status(201).json({ message: 'Expense added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- APPOINTMENTS (ALL) ---
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await db.query(`
      SELECT a.*, pu.name as patient_name, du.name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `);
    res.json(appointments.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- PRESCRIPTIONS (ALL) ---
router.get('/prescriptions', async (req, res) => {
  try {
    const prescriptions = await db.query(`
      SELECT p.*, pu.name as patient_name, du.name as doctor_name
      FROM prescriptions p
      JOIN patients pat ON p.patient_id = pat.id
      JOIN users pu ON pat.user_id = pu.id
      JOIN doctors d ON p.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      ORDER BY p.visit_date DESC
    `);
    res.json(prescriptions.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- BILLING (ALL) ---
router.get('/billing', async (req, res) => {
  try {
    const billing = await db.query(`
      SELECT b.*, pu.name as patient_name, a.appointment_date
      FROM billing b
      JOIN patients p ON b.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      JOIN appointments a ON b.appointment_id = a.id
      ORDER BY b.id DESC
    `);
    res.json(billing.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
