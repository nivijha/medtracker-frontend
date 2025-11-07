"use client";
import Navbar from "../components/ui/LandingNavbar";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white shadow-lg p-4">
        <Navbar />
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <p>Here you can manage your profile details and preferences.</p>
      </main>
    </div>
  );
}
