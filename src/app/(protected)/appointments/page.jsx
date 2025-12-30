"use client";

import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, Search, Loader2 } from "lucide-react";
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

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAppointments();
      setAppointments(res);
    } catch {
      alert("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HELPERS ---------------- */
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

  /* ---------------- ADD ---------------- */
  const handleAddAppointment = async (e) => {
    e.preventDefault();

    if (!formData.doctorName.trim()) return alert("Doctor name is required");
    if (!formData.date) return alert("Please select a date");
    if (!formData.time) return alert("Please select a time");

    try {
      setIsSaving(true);
      await createAppointment(formData);
      setShowAddModal(false);
      resetForm();
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save appointment");
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------- RESCHEDULE ---------------- */
  const handleReschedule = (apt) => {
    const dt = new Date(apt.appointmentDateTime);
    setSelectedAppointment(apt);
    setFormData({
      ...formData,
      date: dt.toISOString().split("T")[0],
      time: dt.toTimeString().slice(0, 5),
    });
    setShowRescheduleModal(true);
  };

  const confirmReschedule = async () => {
    if (!formData.date || !formData.time)
      return alert("Date and time required");

    try {
      setIsSaving(true);
      await rescheduleAppointment(selectedAppointment._id, {
        date: formData.date,
        time: formData.time,
      });
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch {
      alert("Failed to reschedule");
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------- CANCEL / DELETE ---------------- */
  const handleCancel = async (id) => {
    if (!confirm("Cancel this appointment?")) return;
    await cancelAppointment(id);
    fetchAppointments();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this appointment permanently?")) return;
    await deleteAppointment(id);
    fetchAppointments();
  };

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-gray-600">Manage your appointments</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" /> Add Appointment
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            placeholder="Search doctor or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 py-2 border rounded-lg"
          />
        </div>

        {/* TABS */}
        <div className="bg-white rounded-xl shadow">
          <div className="flex border-b">
            {["upcoming", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4">
            {filtered.map((apt) => {
              const dt = new Date(apt.appointmentDateTime);
              return (
                <div key={apt._id} className="border rounded-lg p-4 flex justify-between">
                  <div>
                    <h3 className="font-semibold">{apt.doctorName}</h3>
                    <p className="text-sm text-gray-600">
                      {apt.specialty || "General Consultation"}
                    </p>
                    <p className="text-sm text-gray-500">{apt.hospital}</p>

                    <div className="flex gap-4 text-sm mt-2 text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {dt.toLocaleDateString("en-IN")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {dt.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-right">
                    {activeTab === "upcoming" ? (
                      <>
                        <button
                          onClick={() => handleReschedule(apt)}
                          className="text-blue-600 text-sm"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(apt._id)}
                          className="text-yellow-600 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDelete(apt._id)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <Modal
          title="Book Appointment"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddAppointment}
          formData={formData}
          setFormData={setFormData}
          isSaving={isSaving}
        />
      )}

      {/* RESCHEDULE MODAL */}
      {showRescheduleModal && (
        <Modal
          title="Reschedule Appointment"
          onClose={() => setShowRescheduleModal(false)}
          onSubmit={confirmReschedule}
          formData={formData}
          setFormData={setFormData}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

/* ---------------- MODAL ---------------- */
function Modal({ title, onClose, onSubmit, formData, setFormData, isSaving }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <Input label="Doctor Name" field="doctorName" formData={formData} setFormData={setFormData} />
        <Input label="Specialty" field="specialty" formData={formData} setFormData={setFormData} />
        <Input label="Hospital / Clinic" field="hospital" formData={formData} setFormData={setFormData} />
        <Input label="Date" type="date" field="date" formData={formData} setFormData={setFormData} />
        <Input label="Time" type="time" field="time" formData={formData} setFormData={setFormData} />

        <div className="flex gap-3 mt-4">
          <button disabled={isSaving} onClick={onClose} className="flex-1 border rounded-lg py-2">
            Cancel
          </button>
          <button
            disabled={isSaving}
            onClick={onSubmit}
            className={`flex-1 rounded-lg py-2 flex items-center justify-center gap-2 ${
              isSaving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, field, formData, setFormData, type = "text" }) {
  return (
    <div className="mb-3">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        value={formData[field]}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}
