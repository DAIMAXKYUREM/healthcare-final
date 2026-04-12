-- Password is 'password123' for all seeded users
INSERT INTO users (name, email, password_hash, role, phone) VALUES 
('Admin User', 'admin@hospital.com', '$2b$10$ynEbykp40Rq7ebZzYGQOkOX/T2EZ2WyPtoOsc0JPnpPZQ2KRbF52m', 'admin', '1234567890'),
('Dr. John Smith', 'john@hospital.com', '$2b$10$ynEbykp40Rq7ebZzYGQOkOX/T2EZ2WyPtoOsc0JPnpPZQ2KRbF52m', 'doctor', '0987654321'),
('Jane Doe', 'jane@patient.com', '$2b$10$ynEbykp40Rq7ebZzYGQOkOX/T2EZ2WyPtoOsc0JPnpPZQ2KRbF52m', 'patient', '1112223333'),
('Dr. Sarah Connor', 'sarah@hospital.com', '$2b$10$ynEbykp40Rq7ebZzYGQOkOX/T2EZ2WyPtoOsc0JPnpPZQ2KRbF52m', 'doctor', '5551234567'),
('Dr. Gregory House', 'house@hospital.com', '$2b$10$ynEbykp40Rq7ebZzYGQOkOX/T2EZ2WyPtoOsc0JPnpPZQ2KRbF52m', 'doctor', '5559876543'),
('Bob Builder', 'bob@patient.com', '$2b$10$ynEbykp40Rq7ebZzYGQOkOX/T2EZ2WyPtoOsc0JPnpPZQ2KRbF52m', 'patient', '5554443333'),
('Alice Wonderland', 'alice@patient.com', '$2b$10$ynEbykp40Rq7ebZzYGQOkOX/T2EZ2WyPtoOsc0JPnpPZQ2KRbF52m', 'patient', '5557778888');

INSERT INTO departments (name, description, floor_number) VALUES 
('Cardiology', 'Heart and cardiovascular system', 1),
('Pediatrics', 'Children and infants', 2),
('Neurology', 'Brain and nervous system', 3),
('Diagnostics', 'General diagnostics and testing', 1);

INSERT INTO doctors (user_id, department_id, specialization, qualification, consultation_fee) VALUES 
(2, 1, 'Cardiologist', 'MD, DM', 500.00),
(4, 3, 'Neurologist', 'MD, PhD', 600.00),
(5, 4, 'Diagnostician', 'MD', 450.00);

INSERT INTO patients (user_id, age, gender, blood_group, address) VALUES 
(3, 30, 'female', 'O+', '123 Main St'),
(6, 45, 'male', 'A-', '456 Construction Way'),
(7, 25, 'female', 'B+', '789 Rabbit Hole Ln');
