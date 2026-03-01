"use client";

import React from "react";
import LoggedInNavbar from "../components/ui/LoggedInNavbar";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({ children }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-900 bg-grain flex flex-col selection:bg-teal-500/30">
      <LoggedInNavbar />

      <main className="flex-1 px-6 md:px-12 pt-24 pb-10 md:pb-16">
        <div className="max-w-screen-2xl mx-auto w-full animate-reveal-up">
          {children}
        </div>
      </main>
      
      <div className="py-8 px-12 border-t border-slate-900/5 text-[10px] uppercase tracking-widest font-bold text-slate-400 flex justify-between items-center">
        <span>MedTracker Protocol v1.0</span>
        <span>Secure Session Active</span>
      </div>
    </div>
  );
}
