"use client";

import React, { useState, useEffect } from "react";
import { Pill, Clock, AlertCircle, Plus, Search, Calendar as CalendarIcon, CheckCircle, Loader2 } from "lucide-react";
import {
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
  getRefillSoonMedications,
  getMedicationSchedule,
  markMedicationAsTaken,
  processRefill
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
    notes: ""
  });

  useEffect(() => {
    fetchMedications();
    fetchMedicationSchedule();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await getMedications();
      
      // Separate current and past medications
      const current = data.filter(med => med.status === 'active' || med.status === 'refill-soon');
      const past = data.filter(med => med.status === 'completed' || med.status === 'discontinued');
      
      setCurrentMedications(current);
      setPastMedications(past);
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicationSchedule = async () => {
    try {
      const schedule = await getMedicationSchedule();
      setMedicationSchedule(schedule || []);
    } catch (error) {
      console.error("Error fetching medication schedule:", error);
    }
  };

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
        notes: ""
      });
      fetchMedications();
    } catch (error) {
      console.error("Error adding medication:", error);
    }
  };

  const handleMarkAsTaken = async (medicationId) => {
    try {
      await markMedicationAsTaken(medicationId);
      fetchMedicationSchedule();
    } catch (error) {
      console.error("Error marking medication as taken:", error);
    }
  };

  const handleRequestRefill = async (medicationId) => {
    try {
      await processRefill(medicationId);
      fetchMedications();
    } catch (error) {
      console.error("Error requesting refill:", error);
    }
  };

  const handleDeleteMedication = async (medicationId) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      try {
        await deleteMedication(medicationId);
        fetchMedications();
      } catch (error) {
        console.error("Error deleting medication:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'refill-soon': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredCurrentMedications = currentMedications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPastMedications = pastMedications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Loading medications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
            <p className="text-gray-600 mt-1">Manage your prescriptions and medication schedule</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Medication
          </button>
        </div>

        {/* Alert for refill needed */}
        {currentMedications.some(med => med.status === 'refill-soon') && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">Medication Refill Reminder</p>
              <p className="text-sm text-amber-700 mt-1">
                You have {currentMedications.filter(med => med.status === 'refill-soon').length} medication(s) that need to be refilled soon.
              </p>
            </div>
            <button className="text-sm text-amber-700 hover:text-amber-900 font-medium">
              View All
            </button>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <CalendarIcon className="w-5 h-5" />
              Schedule
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === "current"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("current")}
            >
              Current ({currentMedications.length})
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                activeTab === "past"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("past")}
            >
              Past ({pastMedications.length})
            </button>
          </div>

          {/* Medications List */}
          <div className="p-4">
            {activeTab === "current" ? (
              <div className="space-y-4">
                {filteredCurrentMedications.map((medication) => (
                  <div key={medication.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <Pill className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{medication.name}</h3>
                          <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {medication.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              Next refill: {medication.nextRefill}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Prescribed by {medication.prescribedBy}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(medication.status)}`}>
                          {medication.status === 'refill-soon' ? 'Refill Soon' : 'Active'}
                        </span>
                        <button
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          onClick={() => medication.status === 'refill-soon' ? handleRequestRefill(medication._id) : console.log('View details', medication)}
                        >
                          {medication.status === 'refill-soon' ? 'Request Refill' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPastMedications.map((medication) => (
                  <div key={medication.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Pill className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{medication.name}</h3>
                          <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {medication.startDate} - {medication.endDate}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Reason: {medication.reason}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          Completed
                        </span>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View History
                        </button>
                        <button
                          className="text-sm text-red-600 hover:text-red-700 font-medium ml-2"
                          onClick={() => handleDeleteMedication(medication._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Medication Schedule */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {medicationSchedule.length > 0 ? (
              medicationSchedule.map((item, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${item.taken ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  {item.taken ? (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-600" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.time}</p>
                    <p className="text-sm text-gray-600">{item.medications.join(', ')}</p>
                  </div>
                  <span className={`text-sm font-medium ${item.taken ? 'text-green-600' : 'text-gray-500'}`}>
                    {item.taken ? 'Taken' : 'Pending'}
                  </span>
                  {!item.taken && (
                    <button
                      onClick={() => handleMarkAsTaken(item.medicationId)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium ml-2"
                    >
                      Mark as Taken
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No medications scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Medication Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Medication</h2>
              <form onSubmit={handleAddMedication} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    required
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prescribed By</label>
                  <input
                    type="text"
                    required
                    value={formData.prescribedBy}
                    onChange={(e) => setFormData({...formData, prescribedBy: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Refill</label>
                  <input
                    type="date"
                    required
                    value={formData.nextRefill}
                    onChange={(e) => setFormData({...formData, nextRefill: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Medication
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}