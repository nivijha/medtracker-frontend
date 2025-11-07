"use client";

import React, { useEffect, useState } from "react";
import { Activity, Calendar, FileText, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DashboardCard = ({ title, value, subtitle, icon: Icon }) => (
  <div className="p-6 bg-white rounded-lg border space-y-2 shadow-sm hover:shadow-md transition">
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${API_URL}/api/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setReports(data || []))
      .catch((err) => console.error("Error fetching reports:", err))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    );

  return (
    <>
      <h1 className="text-2xl font-semibold mb-2 text-gray-900">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome back! Here’s an overview of your health information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Appointments"
          value="12"
          subtitle="2 upcoming"
          icon={Calendar}
        />
        <DashboardCard
          title="Reports"
          value={reports.length}
          subtitle="Fetched from backend"
          icon={FileText}
        />
        <DashboardCard
          title="Medications"
          value="3"
          subtitle="1 refill due"
          icon={Activity}
        />
        <DashboardCard
          title="Next Check-up"
          value="Apr 15"
          subtitle="Annual exam"
          icon={Stethoscope}
        />
      </div>
    </>
  );
}
