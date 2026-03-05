"use client";

import React, { useState, useEffect } from "react";
import {
  Pill,
  Plus,
  Search,
  CheckCircle,
  Loader2,
  X,
  ArrowRight,
  Clock,
  RotateCcw,
  Calendar,
  ChevronRight,
  AlertCircle,
  Square
} from "lucide-react";
import {
  getMedications,
  createMedication,
  deleteMedication,
  getMedicationSchedule,
  markMedicationAsTaken,
  processRefill,
} from "@/lib/utils";

export default function MedicationsPage() {
  const [activeTab, setActiveTab] = useState("current");
  const [currentMedications, setCurrentMedications] = useState([]);
  const [pastMedications, setPastMedications] = useState([]);
  const [medicationSchedule, setMedicationSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    prescribedBy: "",
    startDate: "",
    nextRefill: "",
    notes: "",
  });

  useEffect(() => {
    fetchMedications();
    fetchMedicationSchedule();

    const handleRefresh = () => {
      fetchMedications();
      fetchMedicationSchedule();
    };
    window.addEventListener("refreshMedications", handleRefresh);
    return () => window.removeEventListener("refreshMedications", handleRefresh);
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await getMedications();
      const allMeds = data || [];
      setCurrentMedications(allMeds.filter((m) => m.status === "active"));
      setPastMedications(allMeds.filter((m) => m.status !== "active"));
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicationSchedule = async () => {
    const schedule = await getMedicationSchedule();
    setMedicationSchedule(schedule || []);
  };

  const handleAddMedication = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await createMedication(formData);
    setShowAddModal(false);
    setFormData({
      name: "",
      dosage: "",
      frequency: "",
      time: "",
      prescribedBy: "",
      startDate: "",
      nextRefill: "",
      notes: "",
    });
    await fetchMedications();
    await fetchMedicationSchedule();
    setIsSaving(false);
  };

  const handleDeleteMedication = async (id) => {
    if (!confirm("Remove this medication from the registry?")) return;
    await deleteMedication(id);
    fetchMedications();
  };

  const handleRefill = async (id) => {
    await processRefill(id);
    fetchMedications();
  };

  const handleMarkTaken = async (id) => {
    await markMedicationAsTaken(id);
    fetchMedicationSchedule();
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : "Not Set";

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
            Medications
          </div>
          <h1 className="text-4xl md:text-6xl font-syne font-bold tracking-tighter">
            Medications.
          </h1>
          <p className="text-slate-500 text-lg font-light mt-2">
            Track your daily medications and never miss a dose.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="group w-full md:w-auto flex items-center justify-between gap-4 bg-slate-900 text-white px-8 py-4 rounded-full hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
        >
          <span className="text-sm font-bold uppercase tracking-widest">Add Medication</span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-90">
            <Plus size={18} />
          </div>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* SEARCH & TABS */}
          <div className="space-y-6">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-teal-500" />
              <input
                placeholder="Search active prescriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-900/5 rounded-[2rem] focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-medium text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
              />
            </div>
            
            <div className="flex p-1.5 bg-slate-100 rounded-full border border-slate-900/5 w-fit">
              {[
                { id: "current", label: `Active (${currentMedications.length})` },
                { id: "past", label: `Archived (${pastMedications.length})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* MEDICATION LIST */}
          <div className="grid gap-6">
            {(activeTab === "current" ? currentMedications : pastMedications)
              .filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((med) => (
                <div
                  key={med._id}
                  className="group bg-white rounded-[2.5rem] p-8 border border-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col md:row md:items-center justify-between gap-8 relative overflow-hidden"
                >
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                      <Pill size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-syne font-bold text-slate-900 tracking-tight mb-1">{med.name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">{med.dosage}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">·</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{med.frequency}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:flex items-center gap-8 relative z-10">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Time</div>
                      <div className="text-sm font-bold text-slate-900">{med.time}</div>
                    </div>
                    <div className="text-left md:text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Refill</div>
                      <div className="text-sm font-bold text-slate-900">{formatDate(med.nextRefill)}</div>
                    </div>
                    
                    <div className="col-span-2 md:col-span-1 flex items-center gap-3">
                      {activeTab === "current" ? (
                        <button
                          onClick={() => handleRefill(med._id)}
                          className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-slate-100 text-slate-900 text-[10px] font-bold uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <RotateCcw size={12} />
                          Refill
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteMedication(med._id)}
                          className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -z-0 opacity-50 group-hover:bg-teal-50 transition-colors duration-500" />
                </div>
              ))}
              
            {((activeTab === "current" ? currentMedications : pastMedications).length === 0) && (
              <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-900/10">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Pill size={24} className="text-slate-200" />
                </div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">No medications in this registry</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* DAILY PROTOCOL */}
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-2xl font-syne font-bold">Daily Protocol</h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-500 mt-1">Real-time Adherence</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Clock size={20} className="text-teal-500" />
                </div>
              </div>

              <div className="space-y-4">
                {medicationSchedule.length ? (
                  medicationSchedule.map((item, i) => (
                    <div
                      key={i}
                      className={`group flex items-center justify-between p-5 rounded-3xl transition-all duration-300 ${
                        item.taken 
                        ? "bg-teal-500/10 border border-teal-500/20" 
                        : "bg-white/5 border border-white/5 hover:border-white/20"
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-bold mb-1 ${item.taken ? "text-teal-500" : "text-white"}`}>{item.time}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                          {item.medications.join(", ")}
                        </p>
                      </div>

                      {item.taken ? (
                        <div className="w-8 h-8 rounded-full bg-teal-500 text-slate-900 flex items-center justify-center">
                          <CheckCircle size={16} />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleMarkTaken(item.medicationId)}
                          className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border-2 border-transparent hover:bg-teal-500 hover:text-slate-900 transition-all duration-300 group/btn relative"
                          title="Mark as taken"
                        >
                          <Square size={16} className="absolute transition-opacity group-hover/btn:opacity-0" />
                          <CheckCircle size={16} className="absolute opacity-0 transition-opacity group-hover/btn:opacity-100" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center border border-dashed border-white/10 rounded-3xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">No pending doses</p>
                  </div>
                )}
              </div>
              
              <div className="mt-10 p-6 bg-white/5 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle size={16} className="text-teal-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Clinical Note</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Adherence to the prescribed timing is critical for therapeutic efficacy. Enable system notifications for precision alerts.
                </p>
              </div>
            </div>
            
            {/* Background glow */}
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-teal-500/10 rounded-full blur-[100px]" />
          </div>
          
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h3 className="text-lg font-syne font-bold mb-6">Pharmacy Network</h3>
            <div className="space-y-6">
              {[
                { label: "Refill Requests", value: "02 Pending" },
                { label: "Verification", value: "Active" },
                { label: "Supply Status", value: "Optimal" }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] px-6 py-12">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl border border-slate-900/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-reveal-up overflow-hidden max-h-full relative flex flex-col">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="overflow-y-auto p-10 md:p-16 h-full">
              <div className="mb-12">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-600 mb-4">New Medication</div>
                <h2 className="text-4xl font-syne font-bold tracking-tighter">Add a medication.</h2>
              </div>

              <form onSubmit={handleAddMedication} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Medication Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Lisinopril"
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Dosage</label>
                    <input
                      required
                      value={formData.dosage}
                      onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                      placeholder="e.g. 10mg"
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Frequency</label>
                    <input
                      required
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      placeholder="e.g. Once daily"
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Scheduled Time</label>
                    <input
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="e.g. 08:00 AM"
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Prescribed by</label>
                  <input
                    required
                    value={formData.prescribedBy}
                    onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                    placeholder="Dr. Sarah Chen"
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Next Refill Date</label>
                    <input
                      type="date"
                      value={formData.nextRefill}
                      onChange={(e) => setFormData({ ...formData, nextRefill: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional instructions..."
                    rows={3}
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium resize-none"
                  />
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
                        <span>Save</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
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
