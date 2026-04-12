import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

export const BookAppointment = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    doctor_id: '',
    reason: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/doctors').then(res => {
      setDoctors(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, doctor_id: res.data[0].id.toString() }));
      }
    });
  }, []);

  useEffect(() => {
    if (selectedDate && formData.doctor_id) {
      setLoadingSlots(true);
      setSelectedTime('');
      api.get(`/doctors/${formData.doctor_id}/available-slots?date=${format(selectedDate, 'yyyy-MM-dd')}`)
        .then(res => {
          setAvailableSlots(res.data);
        })
        .catch(() => {
          toast.error('Failed to load available slots');
          setAvailableSlots([]);
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate, formData.doctor_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    try {
      const res = await api.post('/appointments', {
        ...formData,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime
      });
      toast.success(`Appointment booked! Token number: ${res.data.token_number}`);
      navigate('/patient');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-light text-slate-900 tracking-tight mb-8">Book Appointment</h1>
      
      <div className="bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl border border-slate-100 p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Select Doctor</label>
            <select 
              required
              className="block w-full max-w-md rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors"
              value={formData.doctor_id}
              onChange={e => {
                setFormData({...formData, doctor_id: e.target.value});
                setSelectedDate(undefined);
                setSelectedTime('');
              }}
            >
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.name} - {doc.specialization} (Fee: ${doc.consultation_fee})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Select Date</label>
              <div className="border border-slate-200 rounded-2xl p-4 inline-block bg-white shadow-sm">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={{ before: new Date() }}
                  className="!m-0"
                  classNames={{
                    day_selected: "bg-slate-900 text-white hover:bg-slate-800",
                    day_today: "font-bold text-slate-900",
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Available Time Slots</label>
              {!selectedDate ? (
                <div className="text-sm text-slate-500 p-6 border border-slate-100 rounded-2xl bg-slate-50 text-center flex items-center justify-center h-[300px]">
                  Please select a date first
                </div>
              ) : loadingSlots ? (
                <div className="text-sm text-slate-500 p-6 border border-slate-100 rounded-2xl bg-slate-50 text-center flex items-center justify-center h-[300px]">
                  Loading slots...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-sm text-red-500 p-6 border border-red-100 rounded-2xl bg-red-50 text-center flex items-center justify-center h-[300px]">
                  No available slots for this date. The doctor might be off or fully booked.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-3 px-3 text-sm font-medium rounded-xl border transition-all ${
                        selectedTime === slot 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Reason for Visit</label>
            <textarea 
              rows={3}
              className="block w-full rounded-xl border-slate-200 bg-slate-50 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm border px-4 py-3 transition-colors resize-none"
              value={formData.reason}
              onChange={e => setFormData({...formData, reason: e.target.value})}
              placeholder="Please briefly describe your symptoms or reason for visit..."
            />
          </div>

          <div className="pt-8 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={!selectedDate || !selectedTime}
              className="w-full md:w-auto flex justify-center py-3 px-8 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
