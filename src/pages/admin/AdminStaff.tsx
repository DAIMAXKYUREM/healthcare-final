import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';

export const AdminStaff = () => {
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    api.get('/admin/staff').then(res => setStaff(res.data)).catch(() => toast.error('Failed to load staff'));
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-8">Manage Staff</h1>
      <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-50">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Designation</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Shift</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {staff.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-800">{s.name}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">{s.designation}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">{s.department || 'N/A'}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">{s.shift}</td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No staff found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
