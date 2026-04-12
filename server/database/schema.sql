CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK(role IN ('admin','doctor','patient','staff')) NOT NULL,
    phone VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    age INTEGER,
    gender VARCHAR(20) CHECK(gender IN ('male','female','other')),
    blood_group VARCHAR(10),
    address TEXT,
    emergency_contact VARCHAR(255),
    allergies TEXT,
    chronic_conditions TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    floor_number INTEGER
);

CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    department_id INTEGER,
    specialization VARCHAR(255),
    qualification VARCHAR(255),
    consultation_fee REAL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS doctor_schedules (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    day_of_week VARCHAR(10) CHECK(day_of_week IN ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
    start_time VARCHAR(20),
    end_time VARCHAR(20),
    max_patients INTEGER DEFAULT 20,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    token_number INTEGER,
    status VARCHAR(50) CHECK(status IN ('scheduled','completed','cancelled','emergency')) DEFAULT 'scheduled',
    reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

CREATE TABLE IF NOT EXISTS prescriptions (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    diagnosis TEXT,
    visit_date DATE NOT NULL,
    file_data TEXT,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

CREATE TABLE IF NOT EXISTS prescription_items (
    id SERIAL PRIMARY KEY,
    prescription_id INTEGER NOT NULL,
    medicine_name VARCHAR(255),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    notes TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id)
);

CREATE TABLE IF NOT EXISTS billing (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    payment_status VARCHAR(50) CHECK(payment_status IN ('pending','paid','cancelled')) DEFAULT 'pending',
    payment_method VARCHAR(50) CHECK(payment_method IN ('cash','card','upi','insurance')),
    paid_at TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    department_id INTEGER,
    designation VARCHAR(255),
    shift VARCHAR(50),
    salary REAL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS emergencies (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER,
    description TEXT NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) CHECK(status IN ('reported', 'assigned', 'resolved')) DEFAULT 'reported',
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount REAL NOT NULL,
    category VARCHAR(100),
    date DATE NOT NULL
);
