import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Badge } from '../../components/common/Badge';

export const PatientBilling = () => {
  const [bills, setBills] = useState<any[]>([]);

  const fetchBills = async () => {
    try {
      const res = await api.get('/billing/my');
      setBills(res.data);
    } catch (error) {
      toast.error('Failed to load bills');
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handlePay = async (id: number) => {
    try {
      await api.put(`/billing/${id}/pay`, { payment_method: 'card' });
      toast.success('Payment successful!');
      fetchBills();
    } catch (error) {
      toast.error('Payment failed');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-8">Billing & Payments</h1>

      <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-50">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Doctor</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {bills.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-light">No billing records found.</td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                    {format(new Date(bill.appointment_date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-800">
                    Dr. {bill.doctor_name}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-800">
                    ${bill.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm">
                    <Badge status={bill.payment_status} />
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    {bill.payment_status === 'pending' ? (
                      <button
                        onClick={() => handlePay(bill.id)}
                        className="text-white bg-slate-900 hover:bg-slate-800 px-5 py-2 rounded-xl transition-colors shadow-sm"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-slate-400">Paid on {bill.paid_at ? format(new Date(bill.paid_at), 'MMM d, yyyy') : ''}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
