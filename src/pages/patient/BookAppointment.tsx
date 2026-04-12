import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, User, MessageSquare, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

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
        <div className="mb-10">
          <Link to="/patient" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors mb-6 group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Book Appointment</h1>
          <p className="text-slate-500 mt-1">Schedule your visit with our expert medical team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="card-healthcare p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      Select Doctor
                    </label>
                    <div className="relative">
                      <select
                          required
                          className="block w-full rounded-2xl border-slate-200 bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-4 outline-none transition-all appearance-none"
                          value={formData.doctor_id}
                          onChange={e => {
                            setFormData({...formData, doctor_id: e.target.value});
                            setSelectedDate(undefined);
                            setSelectedTime('');
                          }}
                      >
                        {doctors.map(doc => (
                            <option key={doc.id} value={doc.id}>
                              Dr. {doc.name} — {doc.specialization} (Fee: ${doc.consultation_fee})
                            </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                        <Clock className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      Select Date
                    </label>
                    <div className="border border-slate-100 rounded-3xl p-4 bg-slate-50/50 shadow-inner flex justify-center">
                      <DayPicker
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={{ before: new Date() }}
                          className="!m-0"
                          classNames={{
                            day_selected: "bg-primary text-white hover:bg-primary-dark rounded-xl",
                            day_today: "font-bold text-primary",
                            day: "h-10 w-10 p-0 font-medium text-slate-600 hover:bg-primary-light hover:text-primary rounded-xl transition-colors",
                            head_cell: "text-slate-400 font-bold text-[0.7rem] uppercase tracking-widest h-10 w-10",
                            nav_button: "h-8 w-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors",
                          }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      Available Time Slots
                    </label>
                    {!selectedDate ? (
                        <div className="text-sm text-slate-400 p-8 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30 text-center flex flex-col items-center justify-center h-[310px]">
                          <Calendar className="h-10 w-10 text-slate-200 mb-3" />
                          <p>Please select a date first</p>
                        </div>
                    ) : loadingSlots ? (
                        <div className="text-sm text-slate-400 p-8 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30 text-center flex flex-col items-center justify-center h-[310px]">
                          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
                          <p>Loading available slots...</p>
                        </div>
                    ) : availableSlots.length === 0 ? (
                        <div className="text-sm text-red-400 p-8 border-2 border-dashed border-red-100 rounded-3xl bg-red-50/30 text-center flex flex-col items-center justify-center h-[310px]">
                          <Clock className="h-10 w-10 text-red-200 mb-3" />
                          <p className="font-medium">No available slots for this date.</p>
                          <p className="text-xs mt-1">Try selecting another date.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 max-h-[310px] overflow-y-auto pr-2 custom-scrollbar">
                          {availableSlots.map(slot => (
                              <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setSelectedTime(slot)}
                                  className={`py-4 px-4 text-sm font-bold rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
                                      selectedTime === slot
                                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                                          : 'bg-surface text-slate-600 border-slate-100 hover:border-primary/30 hover:bg-primary-light/30'
                                  }`}
                              >
                                {selectedTime === slot && <CheckCircle2 className="h-4 w-4" />}
                                {slot}
                              </button>
                          ))}
                        </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                    Reason for Visit
                  </label>
                  <textarea
                      rows={4}
                      className="block w-full rounded-2xl border-slate-200 bg-surface focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm border px-4 py-4 outline-none transition-all resize-none"
                      value={formData.reason}
                      onChange={e => setFormData({...formData, reason: e.target.value})}
                      placeholder="Please briefly describe your symptoms or reason for visit..."
                  />
                </div>

                <div className="pt-6">
                  <button
                      type="submit"
                      disabled={!selectedDate || !selectedTime}
                      className="w-full btn-primary py-4 text-base disabled:bg-slate-200 disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    Confirm Appointment Booking
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="card-healthcare p-8 bg-primary text-white">
              <h3 className="text-xl font-heading font-bold mb-4">Booking Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <span className="text-white/70 text-sm">Doctor</span>
                  <span className="font-bold text-right">
                  {doctors.find(d => d.id.toString() === formData.doctor_id)?.name ? `Dr. ${doctors.find(d => d.id.toString() === formData.doctor_id).name}` : 'Not selected'}
                </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-white/70 text-sm">Date</span>
                  <span className="font-bold">{selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Not selected'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-white/70 text-sm">Time</span>
                  <span className="font-bold">{selectedTime || 'Not selected'}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-white/70 text-sm">Consultation Fee</span>
                  <span className="text-2xl font-bold">${doctors.find(d => d.id.toString() === formData.doctor_id)?.consultation_fee || '0'}</span>
                </div>
              </div>
            </div>

            <div className="card-healthcare p-8">
              <h3 className="text-lg font-heading font-bold text-slate-900 mb-4">Important Notes</h3>
              <ul className="space-y-4">
                {[
                  "Please arrive 15 minutes before your scheduled time.",
                  "Bring your ID card and previous medical records.",
                  "Cancellations must be made at least 24 hours in advance.",
                  "Consultation fee is payable at the reception."
                ].map((note, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="bg-primary/10 p-1 rounded-full mt-1">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{note}</p>
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>