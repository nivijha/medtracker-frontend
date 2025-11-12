"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  User,
  FileText,
  LayoutDashboard,
  Settings,
  Menu,
  Activity,
  Heart,
  Bell,
  Download,
  X,
  Calendar
} from "lucide-react";

export default function LoggedInNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0;";
    router.push("/login");
  };

  // Helper to mark active route
  const isActive = (path) =>
    pathname.startsWith(path)
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600";

  return (
    <nav className="w-full bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-50">
      {/* Left: Logo */}
      <Link href="/dashboard" className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-blue-600 tracking-tight">
          MedTracker
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
        <Link href="/dashboard" className={`flex items-center gap-1 ${isActive("/dashboard")}`}>
          <LayoutDashboard size={18} /> <span>Dashboard</span>
        </Link>
        <Link href="/appointments" className={`flex items-center gap-1 ${isActive("/appointments")}`}>
          <Calendar size={18} /> <span>Appointments</span>
        </Link>
        <Link href="/medications" className={`flex items-center gap-1 ${isActive("/medications")}`}>
          <Activity size={18} /> <span>Medications</span>
        </Link>
        <Link href="/health-metrics" className={`flex items-center gap-1 ${isActive("/health-metrics")}`}>
          <Heart size={18} /> <span>Health Metrics</span>
        </Link>
        <Link href="/reports" className={`flex items-center gap-1 ${isActive("/reports")}`}>
          <FileText size={18} /> <span>Reports</span>
        </Link>
        <Link href="/notifications" className={`flex items-center gap-1 ${isActive("/notifications")}`}>
          <Bell size={18} /> <span>Notifications</span>
        </Link>
        <Link href="/data-export" className={`flex items-center gap-1 ${isActive("/data-export")}`}>
          <Download size={18} /> <span>Data Export</span>
        </Link>
        <Link href="/settings" className={`flex items-center gap-1 ${isActive("/settings")}`}>
          <Settings size={18} /> <span>Settings</span>
        </Link>
      </div>

      {/* Right: User + Logout */}
      <div className="flex items-center gap-3">
        {user && (
          <button
            onClick={() => router.push("/profile")}
            className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            title="View Profile"
          >
            {user.name.charAt(0).toUpperCase()}
          </button>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium transition"
        >
          <LogOut size={18} /> <span>Logout</span>
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-blue-600"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t shadow-md flex flex-col p-4 space-y-4 md:hidden">
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${isActive("/dashboard")}`}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/appointments" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${isActive("/appointments")}`}>
            <Calendar size={18} /> Appointments
          </Link>
          <Link href="/medications" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${isActive("/medications")}`}>
            <Activity size={18} /> Medications
          </Link>
          <Link href="/health-metrics" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${isActive("/health-metrics")}`}>
            <Heart size={18} /> Health Metrics
          </Link>
          <Link href="/reports" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${isActive("/reports")}`}>
            <FileText size={18} /> Reports
          </Link>
          <Link href="/notifications" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${isActive("/notifications")}`}>
            <Bell size={18} /> Notifications
          </Link>
          <Link href="/data-export" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${isActive("/data-export")}`}>
            <Download size={18} /> Data Export
          </Link>
          <Link href="/settings" onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 ${isActive("/settings")}`}>
            <Settings size={18} /> Settings
          </Link>
          {user && (
            <Link 
              href="/profile" 
              onClick={() => setMenuOpen(false)} 
              className="flex items-center gap-2 text-gray-700 border-t pt-3 hover:text-blue-600"
            >
              <User className="text-blue-600 w-4 h-4" />
              <span className="font-medium">{user.name.split(" ")[0]}</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}