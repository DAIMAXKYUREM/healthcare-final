import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const AdminReports = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: '', date: format(new Date(), 'yyyy-MM-dd') });

  const fetchExpenses = () => {
    api.get('/admin/expenses').then(res => setExpenses(res.data)).catch(() => toast.error('Failed to load expenses'));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/expenses', newExpense);
      toast.success('Expense added');
      setNewExpense({ description: '', amount: '', category: '', date: format(new Date(), 'yyyy-MM-dd') });
      fetchExpenses();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-8">Reports & Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-xl font-medium text-slate-800 mb-6">Add Expense</h2>
            <form onSubmit={handleAddExpense} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <input type="text" required value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Amount ($)</label>
                <input type="number" step="0.01" required value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <select required value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors">
                  <option value="">Select Category</option>
                  <option value="Salary">Salary</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Date</label>
                <input type="date" required value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors" />
              </div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors mt-2">
                Add Expense
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 bg-white">
              <h3 className="text-xl font-medium text-slate-800">Recent Expenses</h3>
            </div>
            <table className="min-w-full divide-y divide-slate-50">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-8 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="px-8 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="px-8 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-50">
                {expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-600">{format(new Date(e.date), 'MMM d, yyyy')}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-slate-800">{e.description}</td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {e.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-800 font-medium">${e.amount.toFixed(2)}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr><td colSpan={4} className="px-8 py-12 text-center text-slate-500">No expenses recorded</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
