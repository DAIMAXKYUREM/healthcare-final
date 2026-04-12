/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { Home } from './pages/Home';
import { PortalSelection } from './pages/auth/PortalSelection';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { BookAppointment } from './pages/patient/BookAppointment';
import { Prescriptions } from './pages/patient/Prescriptions';
import { PatientProfile } from './pages/patient/PatientProfile';
import { PatientBilling } from './pages/patient/PatientBilling';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { MySchedule } from './pages/doctor/MySchedule';
import { DoctorProfile } from './pages/doctor/DoctorProfile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminDoctors } from './pages/admin/AdminDoctors';
import { AdminPatients } from './pages/admin/AdminPatients';
import { AdminBilling } from './pages/admin/AdminBilling';
import { AdminStaff } from './pages/admin/AdminStaff';
import { AdminRecords } from './pages/admin/AdminRecords';
import { AdminEmergencies } from './pages/admin/AdminEmergencies';
import { AdminReports } from './pages/admin/AdminReports';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-screen bg-[#f5f5f5] flex flex-col font-sans">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<PortalSelection />} />
          <Route path="/login/patient" element={<Login role="patient" />} />
          <Route path="/login/doctor" element={<Login role="doctor" />} />
          <Route path="/login/admin" element={<Login role="admin" />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route path="/patient" element={<Layout><PatientDashboard /></Layout>} />
            <Route path="/patient/book" element={<Layout><BookAppointment /></Layout>} />
            <Route path="/patient/appointments" element={<Layout><PatientDashboard /></Layout>} />
            <Route path="/patient/prescriptions" element={<Layout><Prescriptions /></Layout>} />
            <Route path="/patient/profile" element={<Layout><PatientProfile /></Layout>} />
            <Route path="/patient/billing" element={<Layout><PatientBilling /></Layout>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/doctor" element={<Layout><DoctorDashboard /></Layout>} />
            <Route path="/doctor/schedule" element={<Layout><MySchedule /></Layout>} />
            <Route path="/doctor/patients" element={<Layout><DoctorDashboard /></Layout>} />
            <Route path="/doctor/profile" element={<Layout><DoctorProfile /></Layout>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/admin/doctors" element={<Layout><AdminDoctors /></Layout>} />
            <Route path="/admin/patients" element={<Layout><AdminPatients /></Layout>} />
            <Route path="/admin/staff" element={<Layout><AdminStaff /></Layout>} />
            <Route path="/admin/appointments" element={<Layout><AdminDashboard /></Layout>} />
            <Route path="/admin/records" element={<Layout><AdminRecords /></Layout>} />
            <Route path="/admin/prescriptions" element={<Layout><AdminRecords /></Layout>} />
            <Route path="/admin/billing" element={<Layout><AdminBilling /></Layout>} />
            <Route path="/admin/emergencies" element={<Layout><AdminEmergencies /></Layout>} />
            <Route path="/admin/reports" element={<Layout><AdminReports /></Layout>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
