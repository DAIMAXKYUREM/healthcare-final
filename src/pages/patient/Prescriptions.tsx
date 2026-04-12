import React, { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { format } from 'date-fns';
import { FileText, Download, User, Calendar, Pill, Stethoscope, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState<any[]>([]);

    useEffect(() => {
        api.get('/prescriptions/my').then(res => setPrescriptions(res.data));
    }, []);

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <div className="mb-10">
                <Link to="/patient" className="inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors mb-6 group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Medical History</h1>
                <p className="text-slate-500 mt-1">Access your past diagnoses and prescriptions.</p>
            </div>

            <div className="space-y-10">
                {prescriptions.length === 0 ? (
                    <div className="card-healthcare p-20 text-center flex flex-col items-center">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                            <FileText className="h-10 w-10 text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium text-lg">No prescriptions found in your history.</p>
                    </div>
                ) : (
                    prescriptions.map((p) => (
                        <div key={p.id} className="card-healthcare overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-heading font-bold text-slate-900">Dr. {p.doctor_name}</h3>
                                        <p className="text-sm font-bold text-primary">{p.specialization}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    {format(new Date(p.visit_date), 'MMMM d, yyyy')}
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="lg:col-span-1">
                                        <div className="mb-8">
                                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                                <Stethoscope className="h-4 w-4 mr-2 text-primary" />
                                                Diagnosis
                                            </h4>
                                            <div className="text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-100 leading-relaxed font-medium">
                                                {p.diagnosis || 'No diagnosis recorded for this visit.'}
                                            </div>
                                        </div>

                                        {p.file_data && (
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Documents</h4>
                                                {p.file_data.startsWith('data:image') ? (
                                                    <div className="relative group">
                                                        <img src={p.file_data} alt="Prescription" className="max-w-full h-auto rounded-2xl border border-slate-200 shadow-sm group-hover:opacity-90 transition-opacity" />
                                                        <a href={p.file_data} download={`prescription-${p.id}.png`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="bg-primary text-white p-3 rounded-full shadow-xl">
                                                                <Download className="h-6 w-6" />
                                                            </div>
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <a href={p.file_data} download="prescription.pdf" className="btn-secondary w-full flex items-center justify-center py-4 rounded-2xl">
                                                        <Download className="mr-2 h-5 w-5" />
                                                        Download Full Report
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="lg:col-span-2">
                                        {p.items && p.items.length > 0 ? (
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                                    <Pill className="h-4 w-4 mr-2 text-primary" />
                                                    Prescribed Medicines
                                                </h4>
                                                <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                                                    <table className="min-w-full divide-y divide-slate-100">
                                                        <thead className="bg-slate-50/50">
                                                        <tr>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Medicine</th>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Dosage</th>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Frequency</th>
                                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Duration</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-slate-50">
                                                        {p.items.map((item: any) => (
                                                            <tr key={item.id} className="hover:bg-primary-light/10 transition-colors">
                                                                <td className="px-6 py-5">
                                                                    <p className="text-sm font-bold text-slate-900">{item.medicine_name}</p>
                                                                    {item.notes && <p className="text-xs text-slate-400 mt-1 italic">{item.notes}</p>}
                                                                </td>
                                                                <td className="px-6 py-5 text-sm font-semibold text-slate-600">{item.dosage}</td>
                                                                <td className="px-6 py-5 text-sm font-semibold text-slate-600">{item.frequency}</td>
                                                                <td className="px-6 py-5 text-sm font-semibold text-slate-600">{item.duration}</td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                                                <Pill className="h-10 w-10 text-slate-200 mb-3" />
                                                <p className="text-slate-400 text-sm font-medium">No specific medicines prescribed.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
