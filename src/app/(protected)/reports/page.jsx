"use client";

import React, { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/api/reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Error fetching reports:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading reports...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Reports</h1>
      {reports.length ? (
        <ul className="space-y-3">
          {reports.map((report) => (
            <li
              key={report._id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <p className="font-semibold text-gray-800">{report.name}</p>
              <p className="text-sm text-gray-600">{report.result}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No reports found.</p>
      )}
    </div>
  );
}
