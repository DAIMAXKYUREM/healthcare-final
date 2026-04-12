import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const AdminEmergencies = () => {
  const [emergencies, setEmergencies] = useState<any[]>([]);

  const fetchEmergencies = () => {
    api.get('/admin/emergencies').then(res => setEmergencies(res.data)).catch(() => toast.error('Failed to load emergencies'));
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/admin/emergencies/${id}`, { status });
      toast.success('Emergency status updated');
      fetchEmergencies();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-8">Emergencies</h1>
      <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-50">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Reported At</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {emergencies.map((e) => (
              <tr key={e.id} className={`${e.status === 'reported' ? 'bg-red-50/30' : ''} hover:bg-slate-50/50 transition-colors`}>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">{format(new Date(e.reported_at), 'MMM d, HH:mm')}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-800">{e.patient_name || 'Unknown'}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">{e.location}</td>
                <td className="px-6 py-5 text-sm text-slate-500 max-w-xs truncate">{e.description}</td>
                <td className="px-6 py-5 whitespace-nowrap text-sm">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                    e.status === 'reported' ? 'bg-red-100 text-red-700' : 
                    e.status === 'assigned' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {e.status}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                  {e.status === 'reported' && (
                    <button onClick={() => updateStatus(e.id, 'assigned')} className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors">Assign</button>
                  )}
                  {e.status !== 'resolved' && (
                    <button onClick={() => updateStatus(e.id, 'resolved')} className="text-emerald-600 hover:text-emerald-900 transition-colors">Resolve</button>
                  )}
                </td>
              </tr>
            ))}
            {emergencies.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No emergencies reported</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
