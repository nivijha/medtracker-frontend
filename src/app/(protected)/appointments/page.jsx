"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Search,
  Loader2,
  X,
  Stethoscope,
  MapPin,
  ChevronRight,
  ArrowRight,
  CalendarDays
} from "lucide-react";
import {
  getAppointments,
  createAppointment,
  cancelAppointment,
  deleteAppointment,
  rescheduleAppointment,
} from "@/lib/utils";

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    doctorName: "",
    specialty: "",
    hospital: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAppointments();
      setAppointments(res || []);
    } finally {
      setLoading(false);
    }
  };

  const getDateTime = (apt) =>
    apt.appointmentDateTime ? new Date(apt.appointmentDateTime) : null;

  const now = new Date();

  const upcoming = appointments.filter(
    (a) => getDateTime(a) && getDateTime(a) >= now && a.status !== "cancelled"
  );

  const past = appointments.filter(
    (a) => !getDateTime(a) || getDateTime(a) < now || a.status === "cancelled"
  );

  const filtered = (activeTab === "upcoming" ? upcoming : past).filter(
    (a) =>
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.specialty || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () =>
    setFormData({
      doctorName: "",
      specialty: "",
      hospital: "",
      date: "",
      time: "",
      notes: "",
    });

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await createAppointment(formData);
    setShowAddModal(false);
    resetForm();
    fetchAppointments();
    setIsSaving(false);
  };

  const handleReschedule = (apt) => {
    const dt = new Date(apt.appointmentDateTime);
    setSelectedAppointment(apt);
    setFormData({
      ...formData,
      doctorName: apt.doctorName,
      specialty: apt.specialty || "",
      hospital: apt.hospital || "",
      date: dt.toISOString().split("T")[0],
      time: dt.toTimeString().slice(0, 5),
    });
    setShowRescheduleModal(true);
  };

  const confirmReschedule = async () => {
    setIsSaving(true);
    await rescheduleAppointment(selectedAppointment._id, {
      date: formData.date,
      time: formData.time,
    });
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    fetchAppointments();
    setIsSaving(false);
  };

  const handleCancel = async (id) => {
    if (!confirm("Cancel this consultation?")) return;
    await cancelAppointment(id);
    fetchAppointments();
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this record permanently?")) return;
    await deleteAppointment(id);
    fetchAppointments();
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-900/10 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            Clinical Orchestration
          </div>
          <h1 className="text-4xl md:text-6xl font-syne font-bold tracking-tighter">
            Consultations.
          </h1>
          <p className="text-slate-500 text-lg font-light mt-2">
            Manage your medical schedule with technical precision.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="group flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-full hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
        >
          <span className="text-sm font-bold uppercase tracking-widest">Book Consultation</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-90">
            <Plus size={18} />
          </div>
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="grid md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-teal-500" />
          <input
            placeholder="Search by practitioner or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-900/5 rounded-[2rem] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-medium text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
          />
        </div>
        
        <div className="md:col-span-4 flex p-1.5 bg-slate-100 rounded-full border border-slate-900/5">
          {["upcoming", "past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* APPOINTMENTS LIST */}
      <div className="grid gap-6">
        {filtered.length > 0 ? (
          filtered.map((apt) => {
            const dt = new Date(apt.appointmentDateTime);
            const isCancelled = apt.status === "cancelled";
            
            return (
              <div
                key={apt._id}
                className={`group bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col md:row md:items-center justify-between gap-10 overflow-hidden relative ${isCancelled ? 'opacity-60' : ''}`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${isCancelled ? 'bg-slate-100 text-slate-400' : 'bg-teal-500/10 text-teal-600'}`}>
                    <Stethoscope size={28} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-syne font-bold text-slate-900 tracking-tight">
                        {apt.doctorName}
                      </h3>
                      {isCancelled && (
                        <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-[8px] font-bold uppercase tracking-widest border border-red-100">
                          Cancelled
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Plus size={10} className="text-teal-500" />
                        {apt.specialty || "General Medicine"}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <MapPin size={10} className="text-teal-500" />
                        {apt.hospital || "Clinical Facility"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-6 relative z-10">
                  <div className="flex gap-4">
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Scheduled Date</div>
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <CalendarIcon size={14} className="text-teal-500" />
                        {dt.toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="w-px h-10 bg-slate-900/5" />
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Time Slot</div>
                      <div className="flex items-center gap-2 text-slate-900 font-bold">
                        <Clock size={14} className="text-teal-500" />
                        {dt.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {activeTab === "upcoming" ? (
                      <>
                        <button
                          onClick={() => handleReschedule(apt)}
                          className="px-6 py-2.5 rounded-full border border-slate-900/10 text-[10px] font-bold uppercase tracking-widest hover:border-teal-500 hover:text-teal-600 transition-all duration-300"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(apt._id)}
                          className="px-6 py-2.5 rounded-full bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDelete(apt._id)}
                        className="px-6 py-2.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        Delete Record
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -z-0 opacity-50 group-hover:bg-teal-50 transition-colors duration-500" />
              </div>
            );
          })
        ) : (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-900/10">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays size={32} className="text-slate-200" />
            </div>
            <h3 className="text-xl font-syne font-bold text-slate-900 mb-2">No active schedules.</h3>
            <p className="text-slate-400 text-sm font-light">Your clinical consultation history and upcoming visits will appear here.</p>
          </div>
        )}
      </div>

      {/* MODALS */}
      {(showAddModal || showRescheduleModal) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] px-6 py-12">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-10 md:p-16 border border-slate-900/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-reveal-up overflow-y-auto max-h-full relative">
            <button 
              onClick={() => { setShowAddModal(false); setShowRescheduleModal(false); }}
              className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-12">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-600 mb-4">Protocol Entry</div>
              <h2 className="text-4xl font-syne font-bold tracking-tighter">
                {showAddModal ? "Initialize Consultation." : "Modify Schedule."}
              </h2>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); showAddModal ? handleAddAppointment(e) : confirmReschedule(); }} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Practitioner Name</label>
                  <input
                    required
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    placeholder="Dr. Alexander Wright"
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Specialty</label>
                  <input
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="e.g. Cardiology"
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Clinical Facility</label>
                <input
                  required
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  placeholder="St. Mary's Medical Center"
                  className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Date Selection</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Time Slot</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  disabled={isSaving}
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-[1.25rem] hover:bg-teal-600 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 group"
                >
                  {isSaving ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <span>{showAddModal ? "Commit Schedule" : "Confirm Modification"}</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
