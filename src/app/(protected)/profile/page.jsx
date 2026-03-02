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
  Plus,
  ArrowRight,
  Shield,
  Loader2,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProfile, getHealthSummary } from "@/lib/utils";

/* ================= SMALL UI COMPONENTS ================= */

const StatCard = ({ icon: Icon, label, value, accent = "slate", tooltip, onClick }) => {
  const accentStyles = {
    teal: "text-teal-500 bg-teal-500/10",
    slate: "text-slate-900 bg-slate-100",
  };

  return (
    <div 
      onClick={onClick}
      className={`group p-8 bg-white rounded-[2rem] border border-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-500 overflow-visible relative ${onClick ? 'cursor-pointer hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:border-teal-500/20' : ''}`}
    >
      <div className={`p-4 rounded-2xl w-fit mb-8 transition-transform group-hover:scale-110 duration-500 ${accentStyles[accent] || accentStyles.slate}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="relative z-10">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</h3>
        <p className="text-4xl font-syne font-bold text-slate-900 tracking-tighter">{value}</p>
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-slate-50 rounded-tl-[4rem] -z-0 opacity-50 group-hover:bg-teal-50 transition-colors duration-500" />
      
      {tooltip && (
        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-4 bg-slate-900 text-white text-xs rounded-xl shadow-xl pointer-events-none z-50">
          <div className="font-bold mb-2 border-b border-white/10 pb-1">Calculation</div>
          {tooltip}
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex gap-6 p-8 bg-white rounded-[2rem] border border-slate-900/5 items-center group hover:border-teal-500/20 transition-all duration-300">
    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-teal-500/10 group-hover:text-teal-600 transition-colors duration-300">
      <Icon className="w-6 h-6 text-slate-400 group-hover:text-teal-600" />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-900 break-words tracking-tight">
        {value || "Protocol Undefined"}
      </p>
    </div>
  </div>
);

/* ================= PAGE ================= */

export default function ProfilePage() {
  const router = useRouter();
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
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-12 animate-reveal-up">
      {/* HEADER SECTION */}
      <div className="relative bg-slate-900 rounded-[3rem] md:rounded-[4rem] p-10 md:p-20 text-white overflow-hidden group">
        <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
            <div className="relative">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] object-cover border-4 border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] bg-teal-500 text-slate-900 flex items-center justify-center text-4xl md:text-5xl font-syne font-black border-4 border-white/10 shadow-2xl">
                  {user.name?.[0]}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-xl border-4 border-slate-900">
                <Shield size={16} className="text-teal-500" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-widest mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                Verified Clinical Profile
              </div>
              <h1 className="text-4xl md:text-6xl font-syne font-bold tracking-tighter mb-2">
                {user.name}.
              </h1>
              <p className="text-slate-400 text-lg font-light">
                {user.email}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-500 bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/20">
                  <Clock size={12} />
                  Initiated {memberSince}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/profile/edit"
            className="group/btn bg-white text-slate-900 px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-teal-500 hover:text-slate-900 transition-all duration-300 shadow-xl"
          >
            <span>Edit</span>
            <Edit size={16} className="transition-transform group-hover/btn:rotate-12" />
          </Link>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[40%] aspect-square rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[30%] aspect-square rounded-full bg-white/5 blur-[100px] pointer-events-none" />
      </div>

      {/* METRICS SECTION */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-syne font-bold tracking-tight">Clinical Metrics.</h2>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Activity Synchronized</div>
        </div>
        
        {summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Calendar}
              label="Consultations"
              value={summary.appointments}
              onClick={() => router.push('/appointments')}
            />
            <StatCard
              icon={FileText}
              label="Vault Records"
              value={summary.reports}
              accent="teal"
              onClick={() => router.push('/reports')}
            />
            <StatCard
              icon={Activity}
              label="Active Protocols"
              value={summary.activeMedications}
              onClick={() => router.push('/medications')}
            />
            <StatCard
              icon={Heart}
              label="Wellness Coeff."
              value={`${summary.wellnessScore}%`}
              accent="teal"
              tooltip={
                <div className="space-y-1">
                  <div className="flex justify-between"><span>Base Metric</span> <span>40%</span></div>
                  <div className="flex justify-between"><span>Profile Data</span> <span>+10%</span></div>
                  <div className="flex justify-between"><span>Health Records</span> <span>+15%</span></div>
                  <div className="flex justify-between"><span>Appointments</span> <span>+15%</span></div>
                  <div className="flex justify-between"><span>Active Protocols</span> <span>+10%</span></div>
                </div>
              }
            />
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-900/10">
            <Loader2 size={32} className="text-slate-200 animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Recalculating Metrics...</p>
          </div>
        )}
        
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center md:text-left px-4">
          Clinical data aggregation based on your real-time health orchestration.
        </p>
      </div>

      {/* PERSONAL DATA SECTION */}
      <div className="space-y-8">
        <h2 className="text-2xl font-syne font-bold tracking-tight">Personal Parameters.</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <InfoRow icon={User} label="Legal Name" value={user.name} />
          <InfoRow icon={Mail} label="Secure Email" value={user.email} />
          <InfoRow icon={Phone} label="Contact Terminal" value={user.phone} />
          <InfoRow icon={MapPin} label="Geographic Node" value={user.address} />
        </div>
      </div>
      
      {/* SECURITY STATUS */}
      <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-900/5 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-teal-500 shadow-2xl">
            <Shield size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-syne font-bold text-slate-900 tracking-tight">System Integrity</h3>
            <p className="text-slate-500 font-light text-sm mt-1">Your data is protected by clinical-grade end-to-end encryption protocols.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Shield
        </div>
      </div>
    </div>
  );
}
