'use client';

import React, { useState } from 'react';
import {
  Heart,
  Calendar as CalendarIcon,
  FileText,
  Activity,
  ShieldCheck,
  Bell,
  ChevronRight,
  Menu,
  X,
  Info,
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <FileText className="w-7 h-7" />,
      title: "Medical Records Storage",
      description:
        "Upload and securely store prescriptions, lab reports, and medical documents for easy access anytime.",
    },
    {
      icon: <CalendarIcon className="w-7 h-7" />,
      title: "Appointment Management",
      description:
        "Keep track of doctor visits, upcoming appointments, and medical follow-ups in one place.",
    },
    {
      icon: <Bell className="w-7 h-7" />,
      title: "Medication Reminders",
      description:
        "Set reminders for medicines so you don’t miss doses during your daily routine.",
    },
    {
      icon: <Activity className="w-7 h-7" />,
      title: "Health Activity Tracking",
      description:
        "View your uploaded health history and activity data over time for personal reference.",
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Privacy First",
      description:
        "Your data is protected with authentication and access control. Only you can access your records.",
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Personal Health Organizer",
      description:
        "MedTracker helps you stay organized — it does not provide medical advice or diagnosis.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-blue-600">
              MedTracker
            </span>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600">
              How It Works
            </a>
            <Link href="/login" className="text-blue-600 font-medium">
              Login
            </Link>
            <Link href="/login">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </Link>
          </div>

          {/* MOBILE */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
            <a href="#features" className="block text-gray-700">
              Features
            </a>
            <a href="#how-it-works" className="block text-gray-700">
              How It Works
            </a>
            <Link href="/login" className="block text-blue-600 font-medium">
              Login
            </Link>
            <Link href="/login">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                Get Started
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-36 pb-28 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Manage Your Health
              <span className="text-blue-600"> Records Easily</span>
            </h1>

            <p className="mt-8 text-lg text-gray-600 max-w-xl">
              MedTracker helps you organize medical documents, appointments, and
              reminders — all in one secure place.
            </p>

            <div className="mt-10 flex gap-4">
              <Link href="/login">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg flex items-center hover:bg-blue-700 transition">
                  Get Started Free
                  <ChevronRight className="ml-2 w-5 h-5" />
                </button>
              </Link>

              {/* Learn More scrolls down */}
              <a
                href="#features"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition"
              >
                Learn More
              </a>
            </div>

            <div className="mt-8 flex items-start gap-2 text-sm text-gray-500">
              <Info className="w-4 h-4 mt-0.5" />
              MedTracker is a personal health management tool and does not
              provide medical diagnosis or treatment.
            </div>
          </div>

          {/* VISUAL */}
          <div className="hidden md:block bg-white rounded-2xl shadow-xl p-8">
            <div className="h-40 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900">
              What You Can Do with MedTracker
            </h2>
            <p className="mt-4 text-gray-600">
              Simple tools designed for everyday healthcare organization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 border rounded-xl hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="py-20 px-4 bg-gradient-to-br from-blue-50 to-white"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              ["1", "Create Account", "Sign up securely in minutes"],
              ["2", "Add Records", "Upload and organize your medical files"],
              ["3", "Stay Organized", "Access everything from your dashboard"],
            ].map(([step, title, desc]) => (
              <div key={step}>
                <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <p>© 2026 MedTracker. All rights reserved.</p>
        <p className="text-sm mt-2">
          MedTracker is not a medical service or diagnostic platform.
        </p>
      </footer>
    </div>
  );
}
``