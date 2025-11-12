"use client";

import React, { useEffect, useState } from "react";
import {
  Activity,
  Calendar,
  FileText,
  Stethoscope,
  TrendingUp,
  Clock,
  AlertCircle,
  ChevronRight,
  User,
  Bell
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DashboardCard = ({ title, value, subtitle, icon: Icon, trend, onClick, highlight }) => (
  <div 
    className={`p-6 bg-white rounded-xl border ${highlight ? 'border-blue-200 bg-blue-50' : 'border-gray-200'} shadow-sm hover:shadow-md transition-all cursor-pointer group`}
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${highlight ? 'bg-blue-100' : 'bg-gray-100'} group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${highlight ? 'text-blue-600' : 'text-gray-600'}`} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 flex items-center justify-between">
        {subtitle}
        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </p>
    </div>
  </div>
);

const ActivityItem = ({ title, time, type, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="p-2 bg-gray-100 rounded-lg mt-1">
        <Clock className="w-4 h-4 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor()}`}>
        {status}
      </span>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer"
  >
    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <span className="text-sm font-medium text-gray-700">{label}</span>
  </div>
);

export default function EnhancedDashboard() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Simulate fetching reports
    setTimeout(() => {
      setReports([
        { id: 1, name: "Blood Test", date: "2024-03-10" },
        { id: 2, name: "X-Ray", date: "2024-03-05" },
        { id: 3, name: "MRI Scan", date: "2024-02-28" }
      ]);
      setUserName("John Doe");
      setLoading(false);
    }, 1000);

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const recentActivity = [
    { title: "Annual Physical Exam", time: "2 hours ago", type: "appointment", status: "completed" },
    { title: "Lab Results Available", time: "Yesterday", type: "report", status: "pending" },
    { title: "Cardiology Appointment", time: "Tomorrow, 2:00 PM", type: "appointment", status: "upcoming" },
    { title: "Prescription Refill Due", time: "In 3 days", type: "medication", status: "pending" }
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}, {userName}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <button
                className="p-3 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">Appointment Reminder</p>
                      <p className="text-xs text-gray-500 mt-1">Cardiology appointment tomorrow at 2:00 PM</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                    <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">Lab Results Available</p>
                      <p className="text-xs text-gray-500 mt-1">Your blood test results are ready to view</p>
                      <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                    </div>
                    <div className="p-4 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">Medication Refill</p>
                      <p className="text-xs text-gray-500 mt-1">Metformin needs refill in 12 days</p>
                      <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              className="p-3 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all"
              onClick={() => router.push('/profile')}
            >
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">Upcoming Appointment Reminder</p>
            <p className="text-sm text-amber-700 mt-1">You have a cardiology appointment tomorrow at 2:00 PM. Don't forget to bring your insurance card.</p>
          </div>
          <button
            className="text-sm text-amber-700 hover:text-amber-900 font-medium"
            onClick={() => router.push('/appointments')}
          >
            View Details
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Upcoming Appointments"
            value="2"
            subtitle="Next: Tomorrow 2:00 PM"
            icon={Calendar}
            highlight={true}
            onClick={() => router.push('/appointments')}
          />
          <DashboardCard
            title="Medical Reports"
            value={reports.length}
            subtitle="1 new result available"
            icon={FileText}
            trend="+2"
            onClick={() => router.push('/reports')}
          />
          <DashboardCard
            title="Active Medications"
            value="3"
            subtitle="1 refill needed soon"
            icon={Activity}
            onClick={() => router.push('/medications')}
          />
          <DashboardCard
            title="Next Check-up"
            value="Apr 15"
            subtitle="Annual physical exam"
            icon={Stethoscope}
            onClick={() => router.push('/appointments')}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-500 mt-1">Your latest health updates and appointments</p>
            </div>
            <div className="p-4 space-y-2">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                onClick={() => router.push('/reports')}
              >
                View all activity
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-500 mt-1">Frequently used features</p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              <QuickAction
                icon={Calendar}
                label="Book Appointment"
                onClick={() => router.push('/appointments')}
              />
              <QuickAction
                icon={FileText}
                label="View Reports"
                onClick={() => router.push('/reports')}
              />
              <QuickAction
                icon={Activity}
                label="Medications"
                onClick={() => router.push('/medications')}
              />
              <QuickAction
                icon={User}
                label="My Profile"
                onClick={() => router.push('/profile')}
              />
            </div>
          </div>
        </div>

        {/* Health Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900">Health Insights</h2>
              <p className="text-sm text-gray-600 max-w-2xl">
                Your recent blood work shows improvement in cholesterol levels. Keep up the great work with your diet and exercise routine!
              </p>
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              onClick={() => router.push('/reports')}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}