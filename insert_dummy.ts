import { Pool } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

async function run() {
  try {
    await pool.query(`
      INSERT INTO users (name, email, password_hash, role, phone) VALUES 
      ('Dr. Sarah Connor', 'sarah@hospital.com', '$2b$10$ynEbykp40Rq7ebZzYGQOkOX/T2EZ2WyPtoOsc0JPnpPZQ2KRbF52m', 'doctor', '5551234567'),
      ('Dr. Gregory House', 'house@hospital.com', '$2b$10$ynEbykp40Rq7ebZzYGQOkOX/T2EZ2WyPtoOsc0JPnpPZQ2KRbF52m', 'doctor', '5559876543'),
      ('Bob Builder', 'bob@patient.com', '$2b$10$ynEbykp40Rq7ebZzYGQOkOX/T2EZ2WyPtoOsc0JPnpPZQ2KRbF52m', 'patient', '5554443333'),
      ('Alice Wonderland', 'alice@patient.com', '$2b$10$ynEbykp40Rq7ebZzYGQOkOX/T2EZ2WyPtoOsc0JPnpPZQ2KRbF52m', 'patient', '5557778888')
      ON CONFLICT (email) DO NOTHING;
    `);

    const neuroResult = await pool.query(`SELECT id FROM departments WHERE name = 'Neurology'`);
    if (neuroResult.rows.length === 0) {
      await pool.query(`INSERT INTO departments (name, description, floor_number) VALUES ('Neurology', 'Brain and nervous system', 3)`);
    }

    const diagResult = await pool.query(`SELECT id FROM departments WHERE name = 'Diagnostics'`);
    if (diagResult.rows.length === 0) {
      await pool.query(`INSERT INTO departments (name, description, floor_number) VALUES ('Diagnostics', 'General diagnostics and testing', 1)`);
    }

    await pool.query(`
      INSERT INTO doctors (user_id, department_id, specialization, qualification, consultation_fee) 
      SELECT id, (SELECT id FROM departments WHERE name = 'Neurology'), 'Neurologist', 'MD, PhD', 600.00 FROM users WHERE email = 'sarah@hospital.com'
      ON CONFLICT (user_id) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO doctors (user_id, department_id, specialization, qualification, consultation_fee) 
      SELECT id, (SELECT id FROM departments WHERE name = 'Diagnostics'), 'Diagnostician', 'MD', 450.00 FROM users WHERE email = 'house@hospital.com'
      ON CONFLICT (user_id) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO patients (user_id, age, gender, blood_group, address) 
      SELECT id, 45, 'male', 'A-', '456 Construction Way' FROM users WHERE email = 'bob@patient.com'
      ON CONFLICT (user_id) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO patients (user_id, age, gender, blood_group, address) 
      SELECT id, 25, 'female', 'B+', '789 Rabbit Hole Ln' FROM users WHERE email = 'alice@patient.com'
      ON CONFLICT (user_id) DO NOTHING;
    `);

    console.log('Dummy data inserted');
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
