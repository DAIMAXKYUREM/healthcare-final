import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

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
      <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-8">My Schedule</h1>
      
      <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 p-8 max-w-3xl">
        <p className="text-slate-500 mb-8">Set your working hours for each day of the week. Leave times blank for days off.</p>
        
        <div className="space-y-4">
          {schedules.map((schedule, index) => (
            <div key={schedule.day_of_week} className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="w-24 font-medium text-slate-800">{schedule.day_of_week}</div>
              
              <div className="flex-1 flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Start Time</label>
                  <input
                    type="time"
                    className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-2.5 transition-colors"
                    value={schedule.start_time || ''}
                    onChange={(e) => handleChange(index, 'start_time', e.target.value)}
                  />
                </div>
                <span className="text-slate-400 mt-6 font-light">to</span>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">End Time</label>
                  <input
                    type="time"
                    className="block w-full rounded-xl border-slate-200 bg-white shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-2.5 transition-colors"
                    value={schedule.end_time || ''}
                    onChange={(e) => handleChange(index, 'end_time', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="sm:w-24 sm:text-right pt-6 sm:pt-0">
                {(!schedule.start_time || !schedule.end_time) ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">Day Off</span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">Working</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
