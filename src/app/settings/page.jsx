"use client";
import Navbar from "../components/ui/LandingNavbar";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow-lg p-4">
        <Navbar />
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Settings</h1>
        <p>Update your preferences, themes, and app configurations here.</p>
      </main>
    </div>
  );
}
