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

    const handleRefresh = () => fetchAppointments();
    window.addEventListener("refreshAppointments", handleRefresh);
    return () => window.removeEventListener("refreshAppointments", handleRefresh);
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
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-900/10 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            Appointments
          </div>
          <h1 className="text-4xl md:text-6xl font-syne font-bold tracking-tighter">
            Consultations.
          </h1>
          <p className="text-slate-500 text-lg font-light mt-2">
            Keep track of all your doctor visits in one place.
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="group flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-full hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
        >
          <span className="text-sm font-bold uppercase tracking-widest">Book Appointment</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-90">
            <Plus size={18} />
          </div>
        </button>
      </div>

      {/* SEARCH & TABS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            placeholder="Search by practitioner or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all text-sm font-medium"
          />
        </div>
        <div className="flex p-1 bg-slate-100 rounded-full border border-slate-900/5 shrink-0">
          {["upcoming", "past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
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
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filtered.map((apt) => {
              const dt = new Date(apt.appointmentDateTime);
              const isCancelled = apt.status === "cancelled";

              return (
                <div
                  key={apt._id}
                  className={`flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors gap-4 ${isCancelled ? "opacity-50" : ""}`}
                >
                  {/* Left: icon + names */}
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isCancelled ? "bg-slate-100 text-slate-400" : "bg-teal-500/10 text-teal-600"}`}>
                      <Stethoscope size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{apt.doctorName}</span>
                        {isCancelled && (
                          <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-[8px] font-bold uppercase tracking-widest border border-red-100">
                            Cancelled
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-slate-500">{apt.specialty || "General Medicine"}</span>
                        {apt.hospital && (
                          <>
                            <span className="text-slate-300 text-xs">·</span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin size={10} />
                              {apt.hospital}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: date + time */}
                  <div className="hidden sm:flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Date</div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <CalendarIcon size={12} className="text-teal-500" />
                        {dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Time</div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Clock size={12} className="text-teal-500" />
                        {dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </div>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {activeTab === "upcoming" && !isCancelled ? (
                      <>
                        <button
                          onClick={() => handleReschedule(apt)}
                          className="px-4 py-2 rounded-full border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:border-teal-500 hover:text-teal-600 transition-all"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(apt._id)}
                          className="px-4 py-2 rounded-full bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDelete(apt._id)}
                        className="px-4 py-2 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={28} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-syne font-bold text-slate-900 mb-1">No {activeTab} appointments.</h3>
            <p className="text-slate-400 text-sm font-light">Your consultations will appear here.</p>
          </div>
        )}
      </div>

      {/* MODALS */}
      {(showAddModal || showRescheduleModal) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] px-6 py-12">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl border border-slate-900/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-reveal-up overflow-hidden max-h-full relative flex flex-col">
            <button
              onClick={() => { setShowAddModal(false); setShowRescheduleModal(false); }}
              className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto p-10 md:p-16 h-full">
              <div className="mb-10">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-600 mb-4">New Appointment</div>
                <h2 className="text-4xl font-syne font-bold tracking-tighter">
                  {showAddModal ? "Book a consultation." : "Reschedule."}
                </h2>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); showAddModal ? handleAddAppointment(e) : confirmReschedule(); }} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Doctor's Name</label>
                    <input
                      required
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      placeholder="Dr. Alexander Wright"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Specialty</label>
                    <input
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      placeholder="e.g. Cardiology"
                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Hospital / Clinic</label>
                  <input
                    required
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    placeholder="St. Mary's Medical Center"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all font-medium text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Time</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 outline-none transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    disabled={isSaving}
                    type="submit"
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl hover:bg-teal-600 transition-all duration-300 font-bold text-base flex items-center justify-center gap-3 group"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>{showAddModal ? "Confirm Booking" : "Save Changes"}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
