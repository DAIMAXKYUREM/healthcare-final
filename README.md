# HealthCare+ Management System

A comprehensive, full-stack web application for managing patient appointments, doctor schedules, medical histories, billing, and hospital administration.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, React Router, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via `pg` package)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs

## Key Features
- **Role-Based Portals**: Dedicated, secure interfaces for Patients, Doctors, and Admins.
- **Patient Portal**: Book appointments, view comprehensive medical history (prescriptions, allergies, chronic conditions), manage personal profiles, and view/pay medical bills.
- **Doctor Portal**: Manage weekly availability, view daily appointments, write prescriptions (with diagnosis, specific medicines, and file uploads), and automatically complete appointments.
- **Admin Portal**: Oversee hospital operations, manage doctor and patient records, view system-wide billing, and track total revenue and appointment metrics.
- **Automated Workflows**: Writing a prescription automatically marks an appointment as completed and generates a patient bill based on the doctor's consultation fee.

---

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3000`. The PostgreSQL database will be automatically seeded with the required tables on the first run if they do not exist.

---

## Environment Variables

To run this application securely, especially in production, you need to configure environment variables. Create a `.env` file in the root directory (or set these in your hosting provider's dashboard):

```env
# Required for secure authentication
JWT_SECRET=your_super_secret_random_string_here_min_32_chars

# Required: PostgreSQL Connection String (e.g., from Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Optional: Port configuration (Defaults to 3000)
PORT=3000

# Optional: Set to 'production' when deploying online
NODE_ENV=production
```

---

## How to Deploy Online (Production)

This application uses a **PostgreSQL database**. We recommend using **Supabase** for the database and **Vercel** for hosting the application.

### Step 1: Set up Supabase (Database)
1. Create an account on [Supabase](https://supabase.com/).
2. Create a new project.
3. Once the project is created, go to **Project Settings** -> **Database**.
4. Copy the **Connection string** (URI format). It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`.
5. Remember to replace `[YOUR-PASSWORD]` with the database password you set during project creation.

### Step 2: Deploying the Application (Vercel)

Since this is a full-stack application (Vite Frontend + Express Backend), deploying to Vercel requires a specific configuration file (`vercel.json`) which is already included in the project.

1. **Push your code to GitHub**.
2. Create an account on [Vercel](https://vercel.com/).
3. Click **Add New...** -> **Project**.
4. Import your GitHub repository.
5. In the **Configure Project** section:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Expand the **Environment Variables** section and add:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `generate-a-secure-random-string-here`
   - `DATABASE_URL` = `your-supabase-connection-string`
7. Click **Deploy**. Vercel will build your frontend and set up your Express backend as serverless functions automatically using the `vercel.json` configuration.

---

## Demo Accounts

You can test the application using the following default accounts. 
**(Password for all accounts is: `password123`)**

- **Admin**: `admin@hospital.com`
- **Doctor**: `john@hospital.com`
- **Patient**: `jane@patient.com`
