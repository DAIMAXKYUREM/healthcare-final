import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { format } from 'date-fns';

export const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/prescriptions/my').then(res => setPrescriptions(res.data));
  }, []);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-8">My Prescriptions & Diagnoses</h1>
      
      <div className="space-y-8">
        {prescriptions.length === 0 ? (
          <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 p-12 text-center text-slate-400 font-light">No prescriptions found.</div>
        ) : (
          prescriptions.map((p) => (
            <div key={p.id} className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-slate-800">Dr. {p.doctor_name}</h3>
                  <p className="text-sm text-slate-500">{p.specialization}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{format(new Date(p.visit_date), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Diagnosis</h4>
                  <p className="text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">{p.diagnosis || 'No diagnosis recorded.'}</p>
                </div>
                
                {p.file_data && (
                  <div className="mb-8">
                    <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Attached Document</h4>
                    {p.file_data.startsWith('data:image') ? (
                      <img src={p.file_data} alt="Prescription" className="max-w-full h-auto rounded-xl border border-slate-200 shadow-sm" />
                    ) : (
                      <a href={p.file_data} download="prescription.pdf" className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors">
                        Download Prescription Document
                      </a>
                    )}
                  </div>
                )}
                
                {p.items && p.items.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Medicines</h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                          <tr>
                            <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Medicine</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Dosage</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Frequency</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Duration</th>
                            <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                          {p.items.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-5 py-4 text-sm text-slate-800 font-medium">{item.medicine_name}</td>
                              <td className="px-5 py-4 text-sm text-slate-600">{item.dosage}</td>
                              <td className="px-5 py-4 text-sm text-slate-600">{item.frequency}</td>
                              <td className="px-5 py-4 text-sm text-slate-600">{item.duration}</td>
                              <td className="px-5 py-4 text-sm text-slate-600">{item.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
