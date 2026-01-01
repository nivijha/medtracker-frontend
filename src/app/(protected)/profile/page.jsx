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
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <div className={`inline-flex p-3 rounded-lg ${colors[color]} mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
    <div className="p-2 bg-white rounded-lg">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium">{value || "Not provided"}</p>
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-6">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl font-bold">
                {user.name?.[0]}
              </div>
            )}

            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-blue-100">{user.email}</p>
              <p className="text-sm flex items-center gap-1 mt-1">
                <Clock className="w-4 h-4" />
                Member since {memberSince}
              </p>
            </div>
          </div>

          {/* EDIT BUTTON */}
          <Link
            href="/profile/edit"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Edit className="w-4 h-4" /> Edit Profile
          </Link>
        </div>

        {/* STATS */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <p className="text-xs text-gray-500 mt-1">
              Based on your care tracking activity
            </p>
          </div>
        )}

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Personal Information</h2>

          <InfoRow icon={User} label="Full Name" value={user.name} />
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Phone} label="Phone" value={user.phone} />
          <InfoRow icon={MapPin} label="Address" value={user.address} />
        </div>
      </div>
    </div>
  );
}
