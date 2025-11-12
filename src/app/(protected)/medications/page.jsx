"use client";

import React, { useState } from "react";
import { Pill, Clock, AlertCircle, Plus, Search, Calendar, CheckCircle } from "lucide-react";

export default function MedicationsPage() {
  const [activeTab, setActiveTab] = useState("current");
  
  const currentMedications = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      time: "Morning",
      prescribedBy: "Dr. Sarah Johnson",
      startDate: "2024-01-15",
      nextRefill: "2024-04-15",
      remaining: "45 days",
      status: "active"
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "Morning & Evening",
      prescribedBy: "Dr. Michael Chen",
      startDate: "2023-12-01",
      nextRefill: "2024-03-20",
      remaining: "12 days",
      status: "refill-soon"
    },
    {
      id: 3,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      time: "Evening",
      prescribedBy: "Dr. Sarah Johnson",
      startDate: "2023-10-10",
      nextRefill: "2024-04-10",
      remaining: "60 days",
      status: "active"
    }
  ];

  const pastMedications = [
    {
      id: 4,
      name: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      time: "With meals",
      prescribedBy: "Dr. Emily Rodriguez",
      startDate: "2024-02-01",
      endDate: "2024-02-10",
      reason: "Bacterial infection"
    },
    {
      id: 5,
      name: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      time: "For pain",
      prescribedBy: "Dr. James Wilson",
      startDate: "2023-11-15",
      endDate: "2023-12-15",
      reason: "Post-surgery pain"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'refill-soon': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
            <p className="text-gray-600 mt-1">Manage your prescriptions and medication schedule</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Add Medication
          </button>
        </div>

        {/* Alert for refill needed */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">Medication Refill Reminder</p>
            <p className="text-sm text-amber-700 mt-1">You have 1 medication that needs to be refilled soon (Metformin in 12 days).</p>
          </div>
          <button className="text-sm text-amber-700 hover:text-amber-900 font-medium">
            Request Refill
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medications..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-5 h-5" />
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
                {currentMedications.map((medication) => (
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
                              <Calendar className="w-4 h-4" />
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
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          {medication.status === 'refill-soon' ? 'Request Refill' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {pastMedications.map((medication) => (
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
                              <Calendar className="w-4 h-4" />
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
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Morning (8:00 AM)</p>
                <p className="text-sm text-gray-600">Lisinopril 10mg, Metformin 500mg</p>
              </div>
              <span className="text-sm text-green-600 font-medium">Taken</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Evening (8:00 PM)</p>
                <p className="text-sm text-gray-600">Metformin 500mg, Atorvastatin 20mg</p>
              </div>
              <span className="text-sm text-gray-500 font-medium">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}