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
      {/* Global Navbar for all protected pages */}
      <LoggedInNavbar />

      {/* Main content */}
      <main className="flex-1 p-6 mt-4">{children}</main>
    </div>
  );
}
