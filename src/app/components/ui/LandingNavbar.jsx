"use client";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function LandingNavbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <Link href="/" className="text-2xl font-bold text-blue-700 hover:text-blue-800 transition">
            MedTracker
          </Link>
        </div>

        {/* Nav Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-gray-700 font-medium hover:text-blue-600 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium shadow hover:bg-blue-700 transition-all"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
