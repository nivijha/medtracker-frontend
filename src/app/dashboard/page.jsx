"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/ui/LandingNavbar";
import { Activity, Calendar, FileText, Stethoscope } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DashboardCard = ({ title, value, subtitle, icon: Icon }) => (
  <div className="p-6 bg-white rounded-lg border space-y-2 shadow-sm">
    <div className="flex justify-between items-start">
      <h3 className="font-medium text-gray-900">{title}</h3>
      <Icon className="w-5 h-5 text-gray-500" />
    </div>
    <div className="space-y-1">
      <p className="text-3xl font-semibold">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/reports`)
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">MedTracker</h2>
        <Navbar />
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome back! Here’s an overview of your health information.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard title="Appointments" value="12" subtitle="2 upcoming" icon={Calendar} />
          <DashboardCard title="Reports" value={reports.length} subtitle="Fetched from backend" icon={FileText} />
          <DashboardCard title="Medications" value="3" subtitle="1 refill due" icon={Activity} />
          <DashboardCard title="Next Check-up" value="Apr 15" subtitle="Annual exam" icon={Stethoscope} />
        </div>
      </main>
    </div>
  );
}
