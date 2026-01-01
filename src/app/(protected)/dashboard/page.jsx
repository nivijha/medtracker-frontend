"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  Calendar as CalendarIcon,
  FileText,
  Stethoscope,
  Clock,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAppointments, getReports, getMedications } from "@/lib/utils";

/* ---------------- UI COMPONENTS ---------------- */

const DashboardCard = ({ title, value, subtitle, icon: Icon, onClick }) => (
  <div
    onClick={onClick}
    className="p-5 sm:p-6 bg-white rounded-xl border shadow-sm hover:shadow-md cursor-pointer"
  >
    <div className="p-3 bg-gray-100 rounded-lg w-fit mb-4">
      <Icon className="w-6 h-6 text-gray-600" />
    </div>
    <h3 className="text-sm text-gray-600">{title}</h3>
    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);

const ActivityItem = ({ title, time, status }) => {
  const statusStyles = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    upcoming: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 transition">
      <div className="flex items-start gap-3 min-w-0">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Clock className="w-4 h-4 text-gray-600" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {title}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date(time).toLocaleString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <span
        className={`shrink-0 px-3 py-1 text-xs font-medium rounded-full capitalize ${
          statusStyles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

/* ---------------- PAGE ---------------- */

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [isNewUser, setIsNewUser] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [medications, setMedications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [apts, reps, meds] = await Promise.all([
        getAppointments(),
        getReports(),
        getMedications(),
      ]);

      setAppointments(apts || []);
      setReports(reps || []);
      setMedications(meds || []);

      const noDataYet =
        (!apts || apts.length === 0) &&
        (!reps || reps.length === 0) &&
        (!meds || meds.length === 0);

      setIsNewUser(noDataYet);

      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.name) {
        setUserName(storedUser.name.split(" ")[0]);
      }

      let activity = [];

      apts?.forEach((a) => {
        if (!a.appointmentDateTime) return;
        activity.push({
          title: `Appointment with ${a.doctorName}`,
          time: a.appointmentDateTime,
          status:
            new Date(a.appointmentDateTime) >= new Date()
              ? "upcoming"
              : "completed",
        });
      });

      reps?.forEach((r) => {
        activity.push({
          title: "Medical report uploaded",
          time: r.createdAt,
          status: "completed",
        });
      });

      meds?.forEach((m) => {
        activity.push({
          title: `Medication: ${m.name}`,
          time: m.createdAt,
          status: m.status === "active" ? "pending" : "completed",
        });
      });

      setRecentActivity(
        activity
          .filter((a) => a.time)
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 6)
      );
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(
    (a) =>
      a.appointmentDateTime &&
      new Date(a.appointmentDateTime) >= new Date() &&
      a.status !== "cancelled"
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isNewUser
                ? `Welcome, ${userName}`
                : `Welcome back, ${userName}`}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Overview of your health activity
            </p>
          </div>

          <button
            onClick={() => router.push("/profile")}
            className="self-start sm:self-auto p-3 bg-white border rounded-xl hover:shadow"
          >
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <DashboardCard
            title="Upcoming Appointments"
            value={upcomingAppointments}
            subtitle="Scheduled"
            icon={CalendarIcon}
            onClick={() => router.push("/appointments")}
          />
          <DashboardCard
            title="Medical Reports"
            value={reports.length}
            subtitle="Uploaded"
            icon={FileText}
            onClick={() => router.push("/reports")}
          />
          <DashboardCard
            title="Active Medications"
            value={medications.filter((m) => m.status === "active").length}
            subtitle="Currently taking"
            icon={Activity}
            onClick={() => router.push("/medications")}
          />
          <DashboardCard
            title="Next Check-up"
            value={upcomingAppointments ? "Scheduled" : "—"}
            subtitle="Appointments"
            icon={Stethoscope}
            onClick={() => router.push("/appointments")}
          />
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-5 sm:p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <p className="text-sm text-gray-500">
              Sorted by latest updates
            </p>
          </div>
          <div className="p-4 space-y-2">
            {recentActivity.length ? (
              recentActivity.map((item, i) => (
                <ActivityItem key={i} {...item} />
              ))
            ) : (
              <p className="text-center text-gray-500">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
