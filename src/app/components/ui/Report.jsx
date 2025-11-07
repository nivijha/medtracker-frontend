"use client";
import React, { useState } from 'react';
import reports from '../../server/controllers/userControllers.js'
import { Activity, FileText, FlaskRound as Flask, Heart, LayoutDashboard, Menu, PlusCircle, User, X } from 'lucide-react';


function Report() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div className="max-h-full bg-gray-50 flex h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}

        {/* Main Content Area */}
        <main className="p-6 flex-1 overflow-y-auto">
        <div className="min-h-screen bg-slate p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-2">Medical Reports</h2>
        <p className="text-gray-600 mb-6">
          View and manage all your medical test reports
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-2 border border-gray-200">Type</th>
                <th className="text-left px-4 py-2 border border-gray-200">Status</th>
                <th className="text-left px-4 py-2 border border-gray-200">Date</th>
                <th className="text-left px-4 py-2 border border-gray-200">Doctor</th>
                <th className="text-left px-4 py-2 border border-gray-200">Hospital</th>
                <th className="text-center px-4 py-2 border border-gray-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-200">{report.type}</td>
                  <td className="px-4 py-2 border border-gray-200">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${report.statusColor}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border border-gray-200">{report.date}</td>
                  <td className="px-4 py-2 border border-gray-200">{report.doctor}</td>
                  <td className="px-4 py-2 border border-gray-200">{report.hospital}</td>
                  <td className="px-4 py-2 border border-gray-200 text-center">
                    <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                      {report.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
        </main>
      </div>
    </div>
  );
}

export default Report;