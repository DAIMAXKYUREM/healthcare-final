import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { Calendar, Clock, Save, ArrowLeft, CheckCircle2, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MySchedule = () => {
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    api.get('/doctors/schedule').then(res => {
      // Map existing schedules or create empty ones for all days
      const existing = res.data;
      const fullSchedule = DAYS_OF_WEEK.map(day => {
        const found = existing.find((s: any) => s.day_of_week === day);
        return found || { day_of_week: day, start_time: '', end_time: '' };
      });
      setSchedules(fullSchedule);
    });
  }, []);

  const handleChange = (index: number, field: string, value: string) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const handleSave = async () => {
    try {
      await api.post('/doctors/schedule', { schedules });
      toast.success('Schedule updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update schedule');
    }
  };

  return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <Link to="/doctor" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors mb-6 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">My Working Schedule</h1>
          <p className="text-slate-500 mt-1">Define your availability for patient consultations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="card-healthcare p-8 md:p-10">
              <div className="space-y-6">
                {schedules.map((schedule, index) => (
                    <div key={schedule.day_of_week} className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-primary-light/5 transition-all group">
                      <div className="w-24">
                        <span className="text-lg font-bold text-slate-900">{schedule.day_of_week}</span>
                        <div className="mt-1">
                          {(!schedule.start_time || !schedule.end_time) ? (
                              <span className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Day Off</span>
                          ) : (
                              <span className="text-[0.65rem] font-black uppercase tracking-widest text-primary">Working</span>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Start Time</label>
                          <div className="relative">
                            <input
                                type="time"
                                className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all"
                                value={schedule.start_time || ''}
                                onChange={(e) => handleChange(index, 'start_time', e.target.value)}
                            />
                            <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          </div>
                        </div>
                        <div className="relative">
                          <label className="block text-[0.65rem] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">End Time</label>
                          <div className="relative">
                            <input
                                type="time"
                                className="block w-full rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-3 outline-none transition-all"
                                value={schedule.end_time || ''}
                                onChange={(e) => handleChange(index, 'end_time', e.target.value)}
                            />
                            <Clock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:block">
                        {(!schedule.start_time || !schedule.end_time) ? (
                            <div className="bg-slate-100 p-3 rounded-2xl">
                              <Moon className="h-5 w-5 text-slate-400" />
                            </div>
                        ) : (
                            <div className="bg-primary/10 p-3 rounded-2xl">
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            </div>
                        )}
                      </div>
                    </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                <button
                    onClick={handleSave}
                    className="btn-primary flex items-center px-10 py-4"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Schedule Changes
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="card-healthcare p-8 bg-primary text-white">
              <h3 className="text-xl font-heading font-bold mb-4">Schedule Tips</h3>
              <ul className="space-y-4">
                {[
                  "Leave times blank to mark a day as unavailable.",
                  "Ensure at least 30 minutes between start and end times.",
                  "Your schedule affects when patients can book appointments.",
                  "Changes are applied immediately to the booking system."
                ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="bg-white/20 p-1 rounded-full mt-1">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed">{tip}</p>
                    </li>
                ))}
              </ul>
            </div>

            <div className="card-healthcare p-8">
              <h3 className="text-lg font-heading font-bold text-slate-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors border border-transparent hover:border-slate-100">
                  Clear All Hours
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors border border-transparent hover:border-slate-100">
                  Set Standard 9-5
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors border border-transparent hover:border-slate-100">
                  Copy Monday to All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
