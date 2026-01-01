"use client";

import React, { useState, useEffect } from "react";
import {
  Pill,
  Plus,
  Search,
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

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await getMedications();
      setCurrentMedications(data.filter((m) => m.status === "active"));
      setPastMedications(
        data.filter((m) => m.status !== "active")
      );
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
  };

  const handleDeleteMedication = async (id) => {
    if (!confirm("Delete this medication?")) return;
    await deleteMedication(id);
    fetchMedications();
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Medications
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your prescriptions and daily schedule
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Medication
          </button>
        </div>

        {/* SEARCH */}
        <div className="bg-white p-4 rounded-xl border">
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

        {/* TABS */}
        <div className="bg-white rounded-xl border">
          <div className="flex border-b text-sm sm:text-base">
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

          {/* LIST */}
          <div className="p-4 space-y-4">
            {(activeTab === "current"
              ? currentMedications
              : pastMedications
            )
              .filter((m) =>
                m.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((med) => (
                <div
                  key={med._id}
                  className="border rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between gap-4"
                >
                  <div className="flex gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg h-fit">
                      <Pill className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{med.name}</h3>
                      <p className="text-sm text-gray-600">
                        {med.dosage} · {med.frequency}
                      </p>
                      <p className="text-sm text-gray-500">
                        ⏰ {med.time} · Next refill: {formatDate(med.nextRefill)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Prescribed by {med.prescribedBy}
                      </p>
                      {med.notes && (
                        <p className="text-sm text-gray-500">
                          Notes: {med.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end gap-2">
                    {activeTab === "current" ? (
                      <button
                        onClick={() => processRefill(med._id)}
                        className="text-blue-600 text-sm"
                      >
                        Request Refill
                      </button>
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
              ))}
          </div>
        </div>

        {/* SCHEDULE */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="text-lg font-semibold mb-4">
            Today’s Schedule
          </h2>

          {medicationSchedule.length ? (
            medicationSchedule.map((item) => (
              <div
                key={item.medicationId}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2"
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
                      markMedicationAsTaken(item.medicationId)
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

        {/* ADD MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <form
              onSubmit={handleAddMedication}
              className="bg-white p-5 rounded-xl w-full max-w-md space-y-4"
            >
              <h2 className="text-lg font-semibold">
                Add Medication
              </h2>

              {["name", "dosage", "frequency", "time", "prescribedBy"].map(
                (field) => (
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
                )
              )}

              <input
                type="date"
                required
                className="w-full border p-2 rounded"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full border p-2 rounded"
                value={formData.nextRefill}
                onChange={(e) =>
                  setFormData({ ...formData, nextRefill: e.target.value })
                }
              />

              <textarea
                placeholder="Notes"
                className="w-full border p-2 rounded"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
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
