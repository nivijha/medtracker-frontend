"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LogOut,
  LayoutDashboard,
  Menu,
  Activity,
  X,
  Calendar,
  Plus,
  ArrowUpRight,
  FileText
} from "lucide-react";

export default function LoggedInNavbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setMenuOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const isActive = (path) => pathname === path;

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Appointments", path: "/appointments", icon: Calendar },
    { name: "Medications", path: "/medications", icon: Activity },
    { name: "Reports", path: "/reports", icon: FileText },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 h-24 flex items-center ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-slate-900/5 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex justify-between items-center w-full">
        {/* LOGO */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
            <Plus className="text-teal-500 w-5 h-5" />
          </div>
          <span className="text-xl font-syne font-bold tracking-tight">MedTracker</span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-900/5">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${isActive(link.path) ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <link.icon size={14} className={isActive(link.path) ? 'text-teal-500' : ''} />
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4">
            {user && (
              <Link
                href="/profile"
                className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white border border-slate-900/5 rounded-full hover:border-teal-500 transition-colors group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-900 rounded-full font-bold text-xs uppercase group-hover:bg-teal-500 group-hover:text-white transition-colors">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">Profile</div>
                  <div className="text-xs font-bold text-slate-900">{user.name.split(" ")[0]}</div>
                </div>
              </Link>
            )}

            <button
              onClick={handleLogoutClick}
              className="p-3 text-slate-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-slate-900"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col md:hidden">
          {/* Mobile Header with Close Button */}
          <div className="h-24 px-6 flex items-center justify-between border-b border-slate-900/5">
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <Plus className="text-teal-500 w-5 h-5" />
              </div>
              <span className="text-xl font-syne font-bold tracking-tight">MedTracker</span>
            </Link>
            <button onClick={() => setMenuOpen(false)} className="p-2 text-slate-900">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-12 flex flex-col">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`text-4xl font-syne font-bold py-4 flex items-center justify-between group transition-all ${isActive(link.path) ? 'text-teal-500 underline decoration-4 underline-offset-8' : 'text-slate-900 hover:translate-x-2'}`}
                >
                  <span>{link.name}</span>
                  <ArrowUpRight className={`w-8 h-8 transition-colors ${isActive(link.path) ? 'text-teal-500' : 'text-slate-200 group-hover:text-teal-500'}`} />
                </Link>
              ))}
            </div>
            
            <div className="mt-auto pt-12 border-t border-slate-900/5 flex flex-col gap-6">
              {user && (
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-4 group bg-slate-50 p-6 rounded-3xl border border-slate-900/5"
                >
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-2xl group-hover:bg-teal-500 transition-colors">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Profile</div>
                    <div className="text-2xl font-syne font-bold text-slate-900">{user.name}</div>
                  </div>
                </Link>
              )}
              
              <button
                onClick={handleLogoutClick}
                className="flex items-center justify-between w-full p-6 bg-red-50 text-red-600 rounded-3xl font-bold uppercase tracking-widest text-sm hover:bg-red-100 transition-colors"
              >
                <span>Terminate Session</span>
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] px-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 md:p-12 border border-slate-900/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-reveal-up relative">
            <h3 className="text-2xl font-syne font-bold text-slate-900 mb-4 tracking-tight">Log out?</h3>
            <p className="text-slate-500 font-light leading-relaxed mb-10">
              You'll need to log back in to access your health data.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-4 rounded-2xl border border-slate-900/10 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-colors"
              >
                Stay logged in
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
              >
                Yes, log out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
