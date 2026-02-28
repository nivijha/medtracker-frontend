"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  User,
  FileText,
  LayoutDashboard,
  Menu,
  Activity,
  X,
  Calendar,
  Plus,
  ArrowUpRight
} from "lucide-react";

export default function LoggedInNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) setUser(userData);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0;";
    router.push("/login");
  };

  const isActive = (path) => pathname === path;

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Appointments", path: "/appointments", icon: Calendar },
    { name: "Medications", path: "/medications", icon: Activity },
    { name: "Reports", path: "/reports", icon: FileText },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-background/80 backdrop-blur-md border-b border-slate-900/5' : 'py-6 bg-transparent'}`}>
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex justify-between items-center">
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
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white border border-slate-900/5 rounded-full hover:border-teal-500 transition-colors group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-900 rounded-full font-bold text-xs uppercase group-hover:bg-teal-500 group-hover:text-white transition-colors">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">Profile</div>
                  <div className="text-xs font-bold text-slate-900">{user.name.split(" ")[0]}</div>
                </div>
              </button>
            )}

            <button
              onClick={handleLogout}
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
        <div className="fixed inset-0 z-40 bg-background flex flex-col p-8 pt-24 animate-fade-in md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-4xl font-syne font-bold mb-6 flex items-center justify-between group ${isActive(link.path) ? 'text-teal-500' : 'text-slate-900'}`}
            >
              <span>{link.name}</span>
              <ArrowUpRight className="w-8 h-8 text-slate-200 group-hover:text-teal-500 transition-colors" />
            </Link>
          ))}
          
          <div className="mt-auto pt-8 border-t border-slate-900/5 flex flex-col gap-6">
            {user && (
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Profile</div>
                  <div className="text-2xl font-syne font-bold">{user.name}</div>
                </div>
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center justify-between w-full p-6 bg-red-50 text-red-600 rounded-3xl font-bold uppercase tracking-widest text-sm"
            >
              <span>Terminate Session</span>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
