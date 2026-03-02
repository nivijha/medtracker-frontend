"use client";

import React, { useEffect, useState } from "react";
import ContactModal from '@/app/components/ui/ContactModal';
import {
  Activity,
  Calendar as CalendarIcon,
  FileText,
  Stethoscope,
  Clock,
  User,
  Plus,
  ArrowRight,
  Loader2,
  ChevronRight,
  Shield,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getAppointments, getReports, getMedications } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/app/components/ui/skeleton";

/* ---------------- UI COMPONENTS ---------------- */

const ClinicalHologram = () => (
  <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20 hidden xl:block">
    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-[120px] animate-pulse" />
    <svg viewBox="0 0 200 200" className="w-full h-full text-teal-500/20 animate-[spin_60s_linear_infinite]">
      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 4" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.2" />
      <path d="M100 20 L100 180 M20 100 L180 100" stroke="currentColor" strokeWidth="0.1" />
    </svg>
  </div>
);

const DashboardCard = ({ title, value, subtitle, icon: Icon, onClick, accent = "slate", isLoading }) => {
  const accentStyles = {
    teal: "text-teal-500 bg-teal-500/10",
    slate: "text-slate-900 bg-slate-100",
  };

  return (
    <div
      onClick={onClick}
      className="group p-8 bg-white rounded-[2rem] border border-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:border-teal-500/20 cursor-pointer transition-all duration-500 overflow-hidden relative"
    >
      <div className={`p-4 rounded-2xl w-fit mb-8 transition-transform group-hover:scale-110 duration-500 ${accentStyles[accent] || accentStyles.slate}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="relative z-10">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{title}</h3>
        <div className="flex items-baseline gap-2 mb-1">
          {isLoading ? (
            <Skeleton className="h-10 w-16" />
          ) : (
            <p className="text-4xl font-syne font-bold text-slate-900 tracking-tighter">{value}</p>
          )}
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ title, time, status }) => {
  const statusStyles = {
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    upcoming: "bg-teal-50 text-teal-600 border-teal-100",
  };

  return (
    <div className="group flex items-center justify-between gap-6 p-6 rounded-3xl hover:bg-slate-50 border border-transparent hover:border-slate-900/5 transition-all duration-300">
      <div className="flex items-start gap-4 min-w-0">
        <div className="p-3 bg-white shadow-sm rounded-2xl border border-slate-900/5 group-hover:scale-110 transition-transform duration-300">
          <Clock className="w-5 h-5 text-slate-400" />
        </div>

        <div className="min-w-0 pt-1">
          <p className="text-sm font-bold text-slate-900 truncate tracking-tight">
            {title}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
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
        className={`shrink-0 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full border ${
          statusStyles[status] || "bg-slate-100 text-slate-600 border-slate-200"
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
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [medications, setMedications] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [apts, repsData, meds] = await Promise.all([
        getAppointments(),
        getReports(1, 10), // Limit to 10 for dashboard
        getMedications(),
      ]);

      const reps = Array.isArray(repsData) ? repsData : (repsData?.reports || []);
      setAppointments(apts || []);
      setReports(reps || []);
      setMedications(meds || []);

      const noDataYet =
        (!apts || apts.length === 0) &&
        (!reps || reps.length === 0) &&
        (!meds || meds.length === 0);

      setIsNewUser(noDataYet);

      let activity = [];

      apts?.forEach((a) => {
        if (!a.appointmentDateTime) return;
        activity.push({
          title: `Consultation: ${a.doctorName}`,
          time: a.appointmentDateTime,
          status:
            new Date(a.appointmentDateTime) >= new Date()
              ? "upcoming"
              : "completed",
        });
      });

      reps?.forEach((r) => {
        activity.push({
          title: `Report uploaded`,
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

  const userName = user?.name ? user.name.split(" ")[0] : "User";

  return (
    <div className="space-y-12 relative overflow-hidden">
      <ClinicalHologram />
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 relative z-10">
        <div className="animate-reveal-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-900/10 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            Up to date
          </div>
          {authLoading ? (
            <Skeleton className="h-16 w-64" />
          ) : (
            <h1 className="text-4xl md:text-7xl font-syne font-bold tracking-tighter leading-none">
              {isNewUser
                ? `Welcome, ${userName}.`
                : `Welcome back, ${userName}.`}
            </h1>
          )}
          <p className="text-slate-500 text-lg font-light mt-4 max-w-xl">
            Your health at a glance. Everything looks good.
          </p>
        </div>

        <button
          onClick={() => router.push("/profile")}
          className="group flex items-center gap-4 p-2 pl-4 pr-6 bg-white border border-slate-900/5 rounded-full hover:border-teal-500 transition-all duration-300 shadow-xl shadow-slate-900/5 animate-reveal-up [animation-delay:200ms]"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center transition-colors group-hover:bg-teal-500 group-hover:text-white">
            <User size={20} />
          </div>
          <span className="text-sm font-bold uppercase tracking-widest">View Profile</span>
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <DashboardCard
          title="Scheduled Visits"
          value={upcomingAppointments}
          subtitle="Upcoming"
          icon={CalendarIcon}
          accent="teal"
          isLoading={loading}
          onClick={() => router.push("/appointments")}
        />
        <DashboardCard
          title="Reports"
          value={reports.length}
          subtitle="Files"
          icon={FileText}
          isLoading={loading}
          onClick={() => router.push("/reports")}
        />
        <DashboardCard
          title="Active Meds"
          value={medications.filter((m) => m.status === "active").length}
          subtitle="Doses"
          icon={Activity}
          isLoading={loading}
          onClick={() => router.push("/medications")}
        />
        <DashboardCard
          title="Health Status"
          value={upcomingAppointments ? "Stable" : "Clear"}
          subtitle="Condition"
          icon={Stethoscope}
          accent="teal"
          isLoading={loading}
          onClick={() => router.push("/appointments")}
        />
      </div>

      {/* RECENT ACTIVITY & SYSTEM LOGS */}
      <div className="grid lg:grid-cols-12 gap-10 relative z-10">
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          <div className="p-10 border-b border-slate-900/5 flex justify-between items-center bg-slate-50/30">
            <div>
              <h2 className="text-2xl font-syne font-bold tracking-tight">Recent Activity</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
                Your latest updates
              </p>
            </div>
            <button className="p-3 bg-white border border-slate-900/5 rounded-2xl text-slate-400 hover:text-teal-500 transition-all shadow-sm">
              <Zap size={20} />
            </button>
          </div>
          <div className="p-4 space-y-1">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))
            ) : recentActivity.length ? (
              recentActivity.map((item, i) => (
                <ActivityItem key={i} {...item} />
              ))
            ) : (
              <div className="py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-900/10">
                  <Activity size={24} className="text-slate-200" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-300">
                  No activity detected
                </p>
              </div>
            )}
          </div>
          {recentActivity.length > 0 && (
            <div className="p-6 bg-slate-50/50 text-center border-t border-slate-900/5">
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-teal-600 transition-colors">
                View all
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl shadow-slate-900/20">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/5">
                <Shield size={24} className="text-teal-500" />
              </div>
              <h3 className="text-2xl font-syne font-bold mb-4 tracking-tight">Need help?</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-light">
                Something off with your records? Reach out and we'll sort it.
              </p>
              <button 
                onClick={() => setShowContactModal(true)}
                className="w-full py-5 bg-teal-500 text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all duration-500 shadow-lg shadow-teal-500/20"
              >
                Contact Support
              </button>
            </div>
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-colors duration-700" />
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h3 className="text-lg font-syne font-bold mb-8 tracking-tight">App Status</h3>
            <div className="space-y-8">
              {[
                { label: "Data sync", status: "Active" },
                { label: "Encryption", status: "On" },
                { label: "Backup", status: "Running" }
              ].map((node, i) => (
                <div key={i} className="flex justify-between items-center group/node">
                  <span className="text-sm font-medium text-slate-500 transition-colors group-hover/node:text-slate-900">{node.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">{node.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <ContactModal 
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}
