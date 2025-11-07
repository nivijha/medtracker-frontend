"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/ui/LandingNavbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ReportsPage() {
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
        <Navbar />
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Reports</h1>
        {reports.length ? (
          <ul className="space-y-2">
            {reports.map((report) => (
              <li key={report._id} className="p-4 bg-white rounded-lg shadow-sm border">
                <p className="font-semibold">{report.name}</p>
                <p className="text-sm text-gray-600">{report.result}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reports found.</p>
        )}
      </main>
    </div>
  );
}
