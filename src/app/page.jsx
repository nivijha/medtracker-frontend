'use client';

import React, { useState } from 'react';
import { Heart, Calendar, FileText, Activity, Shield, Bell, ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Medical Records",
      description: "Securely store and organize all your medical documents in one place"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Appointments",
      description: "Schedule and manage your healthcare appointments effortlessly"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Medication Reminders",
      description: "Never miss a dose with intelligent medication tracking"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Health Monitoring",
      description: "Track your vitals and health metrics over time"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Private",
      description: "Your health data is encrypted and completely confidential"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "AI Insights",
      description: "Get personalized health recommendations powered by AI"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-blue-600">MedTracker</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition">How It Works</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition">About</a>
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition">
                Login
              </Link>
              <Link href="/login">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-blue-600">Features</a>
              <a href="#how-it-works" className="block text-gray-700 hover:text-blue-600">How It Works</a>
              <a href="#about" className="block text-gray-700 hover:text-blue-600">About</a>
              <Link href="/login" className="block text-blue-600 font-medium">
                Login
              </Link>
              <Link href="/login">
                <button className="block w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Health Records,
                <span className="text-blue-600"> Simplified</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600">
                MedTracker empowers you to securely store, organize, and access all your medical records in one place. Track medications, manage appointments, and take control of your health journey.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center w-full sm:w-auto">
                    Get Started Free
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </Link>
                <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition">
                  Watch Demo
                </button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  HIPAA Compliant
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-blue-600 mr-2" />
                  Trusted by 10k+ Users
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                  <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-16 h-16 text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-blue-50 rounded-lg"></div>
                    <div className="h-20 bg-blue-50 rounded-lg"></div>
                  </div>
                  <div className="h-4 bg-blue-100 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything You Need to Manage Your Health
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive tools designed to simplify your healthcare experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create Your Account", desc: "Sign up securely in minutes" },
              { step: "2", title: "Upload Records", desc: "Add your medical documents and history" },
              { step: "3", title: "Stay Organized", desc: "Access everything from your dashboard" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust MedTracker with their healthcare management
          </p>
          <Link href="/login">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-semibold">
              Start Your Free Trial
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="w-8 h-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold">MedTracker</span>
              </div>
              <p className="text-gray-400">Your trusted health management platform</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">HIPAA</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MedTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}