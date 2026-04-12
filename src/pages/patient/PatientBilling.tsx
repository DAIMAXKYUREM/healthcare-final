import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Badge } from '../../components/common/Badge';
import { CreditCard, Receipt, Download, ArrowLeft, Calendar, User, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

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
      <div className="mb-10">
        <Link to="/patient" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors mb-6 group">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Billing & Payments</h1>
        <p className="text-slate-500 mt-1">View your invoices and manage your healthcare payments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card-healthcare p-6 border-l-4 border-l-primary">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Invoices</p>
              <p className="text-2xl font-bold text-slate-900">{bills.length}</p>
            </div>
          </div>
        </div>
        <div className="card-healthcare p-6 border-l-4 border-l-red-500">
          <div className="flex items-center gap-4">
            <div className="bg-red-50 p-3 rounded-2xl">
              <CreditCard className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Payments</p>
              <p className="text-2xl font-bold text-slate-900">{bills.filter(b => b.payment_status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="card-healthcare p-6 border-l-4 border-l-success">
          <div className="flex items-center gap-4">
            <div className="bg-success/10 p-3 rounded-2xl">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Paid</p>
              <p className="text-2xl font-bold text-slate-900">${bills.filter(b => b.payment_status === 'paid').reduce((acc, b) => acc + b.amount, 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card-healthcare overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-heading font-bold text-slate-900">Invoice History</h3>
          <button className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Statement
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Date & Doctor</th>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-left text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-right text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white divide-y divide-slate-50"
            >
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Receipt className="h-8 w-8 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold">No billing records found.</p>
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <motion.tr variants={itemVariants} key={bill.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-light/30 rounded-xl">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{format(new Date(bill.appointment_date), 'MMM d, yyyy')}</p>
                          <p className="text-xs text-slate-500 flex items-center mt-0.5">
                            <User className="h-3 w-3 mr-1" />
                            Dr. {bill.doctor_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <p className="text-sm text-slate-600">Consultation Fee</p>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <p className="text-sm font-black text-slate-900">${bill.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <Badge status={bill.payment_status} />
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                      {bill.payment_status === 'pending' ? (
                        <button
                          onClick={() => handlePay(bill.id)}
                          className="btn-primary py-2 px-6 text-xs"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-success flex items-center">
                            Paid
                          </span>
                          <span className="text-[0.65rem] text-slate-400 mt-0.5">
                            {bill.paid_at ? format(new Date(bill.paid_at), 'MMM d, yyyy') : ''}
                          </span>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
