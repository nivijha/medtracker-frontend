"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Save,
  X,
  Check,
  Clock,
  Activity,
  FileText,
  Heart,
  Shield,
  Award,
  TrendingUp
} from "lucide-react";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPreferences,
  getHealthSummary
} from "@/lib/utils";

const StatCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
      <div className={`inline-flex p-3 rounded-lg ${colors[color]} mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};

const InfoField = ({ icon: Icon, label, value, editable, isEditing, onChange, type = "text" }) => (
  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
    <div className="p-2 bg-white rounded-lg">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div className="flex-1 min-w-0">
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      {isEditing && editable ? (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-gray-900 font-medium">{value || 'Not provided'}</p>
      )}
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, date, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600"
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{date}</p>
      </div>
    </div>
  );
};

const AchievementBadge = ({ icon: Icon, title, description, earned }) => (
  <div className={`p-4 rounded-xl border-2 transition-all ${
    earned 
      ? 'border-yellow-300 bg-yellow-50' 
      : 'border-gray-200 bg-gray-50 opacity-60'
  }`}>
    <div className={`inline-flex p-3 rounded-lg mb-2 ${
      earned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-400'
    }`}>
      <Icon className="w-6 h-6" />
    </div>
    <h4 className="font-semibold text-gray-900 text-sm mb-1">{title}</h4>
    <p className="text-xs text-gray-600">{description}</p>
  </div>
);

export default function EnhancedProfilePage() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const [profileData, healthSummary] = await Promise.all([
        getUserProfile(),
        getHealthSummary()
      ]);
      
      // Combine profile data with localStorage user data
      const u = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      let localUser = {};
      if (u) {
        try {
          localUser = JSON.parse(u);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
      
      const fullUser = {
        name: profileData.name || localUser.name || '',
        email: profileData.email || localUser.email || '',
        phone: profileData.phone || localUser.phone || '',
        address: profileData.address || localUser.address || '',
        dateOfBirth: profileData.dateOfBirth || localUser.dateOfBirth || '',
        bloodType: profileData.bloodType || localUser.bloodType || '',
        emergencyContact: profileData.emergencyContact || localUser.emergencyContact || '',
        joinDate: profileData.joinDate || localUser.joinDate || new Date().toISOString(),
        ...profileData
      };
      
      setUser(fullUser);
      setEditedUser(fullUser);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Fallback to localStorage data if API fails
      const u = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (u) {
        try {
          const localUser = JSON.parse(u);
          const fallbackUser = {
            name: localUser.name || '',
            email: localUser.email || '',
            phone: localUser.phone || '',
            address: localUser.address || '',
            dateOfBirth: localUser.dateOfBirth || '',
            bloodType: localUser.bloodType || '',
            emergencyContact: localUser.emergencyContact || '',
            joinDate: localUser.joinDate || new Date().toISOString()
          };
          setUser(fallbackUser);
          setEditedUser(fallbackUser);
        } catch (parseError) {
          console.error("Error parsing user data:", parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await updateUserProfile(editedUser);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(editedUser));
      }
      setUser(editedUser);
      setIsEditing(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      // If backend is not available, still save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(editedUser));
        setUser(editedUser);
        setIsEditing(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 2000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 2000);
      }
    }
  };

  const updateField = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const recentActivity = [
    { icon: FileText, title: "Blood Test Results Available", date: "2 days ago", color: "blue" },
    { icon: Calendar, title: "Completed Annual Checkup", date: "1 week ago", color: "green" },
    { icon: Activity, title: "Updated Medication List", date: "2 weeks ago", color: "orange" }
  ];

  const achievements = [
    { icon: Award, title: "Health Champion", description: "Completed 10 checkups", earned: true },
    { icon: TrendingUp, title: "Consistent Care", description: "6 months active", earned: true },
    { icon: Heart, title: "Wellness Warrior", description: "Maintained healthy vitals", earned: false },
    { icon: Shield, title: "Prevention Pro", description: "All vaccinations current", earned: false }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-600">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="font-medium">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-600">
        <User className="w-12 h-12 text-gray-400 mb-3" />
        <p className="font-medium">No profile data found</p>
        <p className="text-sm text-gray-500 mt-1">Please log in to view your profile</p>
      </div>
    );
  }

  const memberSince = new Date(user.joinDate || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Profile Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl font-bold border-4 border-white/30">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                <Camera className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-blue-100 mb-3">{user.email}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Member since {memberSince}
                </span>
                {user.bloodType && (
                  <span className="px-3 py-1 bg-white/20 rounded-full">
                    Blood Type: {user.bloodType}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium disabled:opacity-50"
                  >
                    {saveStatus === 'saving' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : saveStatus === 'saved' ? (
                      <>
                        <Check className="w-4 h-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={Calendar} label="Appointments" value="12" color="blue" />
          <StatCard icon={FileText} label="Reports" value="8" color="green" />
          <StatCard icon={Activity} label="Medications" value="3" color="purple" />
          <StatCard icon={Heart} label="Health Score" value="92%" color="orange" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <p className="text-sm text-gray-600 mt-1">Your personal details and contact information</p>
            </div>
            <div className="p-6 space-y-4">
              <InfoField
                icon={User}
                label="Full Name"
                value={isEditing ? editedUser.name : user.name}
                editable={true}
                isEditing={isEditing}
                onChange={(val) => updateField('name', val)}
              />
              <InfoField
                icon={Mail}
                label="Email Address"
                value={isEditing ? editedUser.email : user.email}
                editable={true}
                isEditing={isEditing}
                onChange={(val) => updateField('email', val)}
                type="email"
              />
              <InfoField
                icon={Phone}
                label="Phone Number"
                value={isEditing ? editedUser.phone : user.phone}
                editable={true}
                isEditing={isEditing}
                onChange={(val) => updateField('phone', val)}
                type="tel"
              />
              <InfoField
                icon={Calendar}
                label="Date of Birth"
                value={isEditing ? editedUser.dateOfBirth : user.dateOfBirth}
                editable={true}
                isEditing={isEditing}
                onChange={(val) => updateField('dateOfBirth', val)}
                type="date"
              />
              <InfoField
                icon={MapPin}
                label="Address"
                value={isEditing ? editedUser.address : user.address}
                editable={true}
                isEditing={isEditing}
                onChange={(val) => updateField('address', val)}
              />
              <InfoField
                icon={Phone}
                label="Emergency Contact"
                value={isEditing ? editedUser.emergencyContact : user.emergencyContact}
                editable={true}
                isEditing={isEditing}
                onChange={(val) => updateField('emergencyContact', val)}
                type="tel"
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-sm text-gray-600 mt-1">Your latest actions</p>
            </div>
            <div className="p-4 space-y-2">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
            <p className="text-sm text-gray-600 mt-1">Your health milestones and accomplishments</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <AchievementBadge key={index} {...achievement} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}