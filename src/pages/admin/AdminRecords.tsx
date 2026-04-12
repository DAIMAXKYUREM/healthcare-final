import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const AdminRecords = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/admin/prescriptions').then(res => setPrescriptions(res.data)).catch(() => toast.error('Failed to load records'));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-8">Medical Records & Prescriptions</h1>
      <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-50">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Diagnosis</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Document</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {prescriptions.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">{format(new Date(p.visit_date), 'MMM d, yyyy')}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-800">{p.patient_name}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">Dr. {p.doctor_name}</td>
                <td className="px-6 py-5 text-sm text-slate-500 max-w-xs truncate">{p.diagnosis}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">
                  {p.file_data ? <a href={p.file_data} download="prescription.pdf" className="text-teal-600 hover:text-teal-700 hover:underline transition-colors">Download</a> : <span className="text-slate-400">None</span>}
                </td>
              </tr>
            ))}
            {prescriptions.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
