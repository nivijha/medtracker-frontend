"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Activity,
  FileText,
  Heart,
  Calendar,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { getProfile, getHealthSummary } from "@/lib/utils";

/* ================= SMALL UI COMPONENTS ================= */

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm text-center sm:text-left">
      <div
        className={`inline-flex p-3 rounded-lg ${colors[color]} mb-3 mx-auto sm:mx-0`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg items-start">
    <div className="p-2 bg-white rounded-lg">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium break-words">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

/* ================= PAGE ================= */

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const [profile, health] = await Promise.all([
        getProfile(),
        getHealthSummary(),
      ]);
      setUser(profile);
      setSummary(health);
    } catch (err) {
      console.error("Profile load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">

            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                  {user.name?.[0]}
                </div>
              )}

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {user.name}
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  {user.email}
                </p>
                <p className="text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1 mt-1">
                  <Clock className="w-4 h-4" />
                  Member since {memberSince}
                </p>
              </div>
            </div>

            {/* EDIT BUTTON */}
            <Link
              href="/profile/edit"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Edit className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
        </div>

        {/* STATS */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Calendar}
              label="Appointments"
              value={summary.appointments}
              color="blue"
            />
            <StatCard
              icon={FileText}
              label="Reports"
              value={summary.reports}
              color="green"
            />
            <StatCard
              icon={Activity}
              label="Medications"
              value={summary.activeMedications}
              color="purple"
            />
            <StatCard
              icon={Heart}
              label="Wellness Score"
              value={`${summary.wellnessScore}%`}
              color="orange"
            />
          </div>
        )}

        {summary && (
          <p className="text-xs text-gray-500 text-center sm:text-left">
            Based on your care tracking activity
          </p>
        )}

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-xl border p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            Personal Information
          </h2>

          <InfoRow icon={User} label="Full Name" value={user.name} />
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Phone} label="Phone" value={user.phone} />
          <InfoRow icon={MapPin} label="Address" value={user.address} />
        </div>
      </div>
    </div>
  );
}
