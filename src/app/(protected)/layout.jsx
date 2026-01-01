"use client";

import React, { useEffect } from "react";
import LoggedInNavbar from "../components/ui/LoggedInNavbar";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Basic client-side auth check
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Global Navbar */}
      <LoggedInNavbar />

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 py-4 sm:py-6 mt-2 sm:mt-4">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
