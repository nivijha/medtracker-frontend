"use client";

import React, { useState, useEffect } from "react";
import {
  Pill,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Calendar as CalendarIcon,
  CheckCircle,
  Loader2,
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
  }, []);

  /* ---------------- FETCH ---------------- */

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await getMedications();

      setCurrentMedications(
        data.filter((med) => med.status === "active")
      );

      setPastMedications(
        data.filter(
          (med) =>
            med.status === "completed" ||
            med.status === "discontinued"
        )
      );
    } catch (err) {
      console.error("Error fetching medications:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicationSchedule = async () => {
    try {
      const schedule = await getMedicationSchedule();
      setMedicationSchedule(schedule || []);
    } catch (err) {
      console.error("Error fetching medication schedule:", err);
    }
  };

  /* ---------------- ACTIONS ---------------- */

  const handleAddMedication = async (e) => {
    e.preventDefault();
    try {
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
      fetchMedications();
      fetchMedicationSchedule();
    } catch (err) {
      console.error("Error adding medication:", err);
    }
  };

  const handleMarkAsTaken = async (id) => {
    try {
      await markMedicationAsTaken(id);
      fetchMedicationSchedule();
    } catch (err) {
      console.error("Error marking as taken:", err);
    }
  };

  const handleRequestRefill = async (id) => {
    try {
      await processRefill(id);
      fetchMedications();
    } catch (err) {
      console.error("Error processing refill:", err);
    }
  };

  const handleDeleteMedication = async (id) => {
    if (!window.confirm("Delete this medication?")) return;
    try {
      await deleteMedication(id);
      fetchMedications();
    } catch (err) {
      console.error("Error deleting medication:", err);
    }
  };

  /* ---------------- HELPERS ---------------- */

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "discontinued":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  const filteredCurrent = currentMedications.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPast = pastMedications.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
            <p className="text-gray-600 mt-1">
              Manage your prescriptions and daily schedule
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Medication
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border">
          <div className="flex border-b">
            {["current", "past"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {tab === "current"
                  ? `Current (${currentMedications.length})`
                  : `Past (${pastMedications.length})`}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="p-4 space-y-4">
            {(activeTab === "current" ? filteredCurrent : filteredPast).map(
              (med) => (
                <div
                  key={med._id}
                  className="border rounded-lg p-4 flex justify-between"
                >
                  <div className="flex gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Pill className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{med.name}</h3>
                      <p className="text-sm text-gray-600">
                        {med.dosage} · {med.frequency}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        ⏰ {med.time} · Next refill: {formatDate(med.nextRefill)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Prescribed by {med.prescribedBy}
                      </p>
                      {med.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                          Notes: {med.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${getStatusColor(
                        med.status
                      )}`}
                    >
                      {med.status}
                    </span>

                    {activeTab === "current" ? (
                      <>
                        <button
                          onClick={() => handleRequestRefill(med._id)}
                          className="text-blue-600 text-sm"
                        >
                          Request Refill
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleDeleteMedication(med._id)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Schedule */}
        <div id="med-schedule" className="mt-6 bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Today’s Schedule</h2>

          {medicationSchedule.length ? (
            medicationSchedule.map((item) => (
              <div
                key={item.medicationId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"
              >
                <div>
                  <p className="font-medium">{item.time}</p>
                  <p className="text-sm text-gray-600">
                    {item.medications.join(", ")}
                  </p>
                </div>

                {item.taken ? (
                  <CheckCircle className="text-green-600" />
                ) : (
                  <button
                    onClick={() =>
                      handleMarkAsTaken(item.medicationId)
                    }
                    className="text-blue-600 text-sm"
                  >
                    Mark as Taken
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No medications scheduled for today
            </p>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
              onSubmit={handleAddMedication}
              className="bg-white p-6 rounded-xl w-full max-w-md space-y-4"
            >
              <h2 className="text-xl font-semibold">Add Medication</h2>

              {[
                "name",
                "dosage",
                "frequency",
                "time",
                "prescribedBy",
              ].map((field) => (
                <input
                  key={field}
                  required
                  placeholder={field}
                  className="w-full border p-2 rounded"
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field]: e.target.value,
                    })
                  }
                />
              ))}

              <input
                type="date"
                required
                className="w-full border p-2 rounded"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: e.target.value,
                  })
                }
              />

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.nextRefill}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nextRefill: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Notes"
                className="w-full border p-2 rounded"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    notes: e.target.value,
                  })
                }
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border p-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
