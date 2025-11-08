"use client";

import React, { useState } from "react";
import {
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  Save,
  Eye,
  EyeOff
} from "lucide-react";

const SettingSection = ({ title, description, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
    </div>
    <div className="p-6 space-y-6">
      {children}
    </div>
  </div>
);

const SettingItem = ({ icon: Icon, label, description, children }) => (
  <div className="flex items-start gap-4">
    {Icon && (
      <div className="p-2 bg-gray-100 rounded-lg">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <label className="block text-sm font-medium text-gray-900 mb-1">
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-500 mb-3">{description}</p>
      )}
      {children}
    </div>
  </div>
);

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-blue-600' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

const QuickActionCard = ({ icon: Icon, label, description, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left w-full ${
      danger
        ? 'border-red-200 bg-red-50 hover:bg-red-100'
        : 'border-gray-200 bg-white hover:bg-gray-50'
    }`}
  >
    <div className={`p-3 rounded-lg ${danger ? 'bg-red-100' : 'bg-gray-100'}`}>
      <Icon className={`w-5 h-5 ${danger ? 'text-red-600' : 'text-gray-600'}`} />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className={`font-medium ${danger ? 'text-red-900' : 'text-gray-900'}`}>
        {label}
      </h3>
      <p className={`text-sm ${danger ? 'text-red-700' : 'text-gray-600'}`}>
        {description}
      </p>
    </div>
    <ChevronRight className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-gray-400'}`} />
  </button>
);

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    appointments: true,
    reports: true,
    medications: true,
    marketing: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    shareData: false,
    twoFactor: true
  });

  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'en',
    fontSize: 'medium'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    }, 1000);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.cookie = "token=; path=/; max-age=0;";
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Security Section */}
        <SettingSection
          title="Security"
          description="Manage your password and security preferences"
        >
          <SettingItem
            icon={Lock}
            label="Change Password"
            description="Update your password regularly to keep your account secure"
          >
            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Current password"
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </SettingItem>

          <SettingItem
            icon={Shield}
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${privacy.twoFactor ? 'text-green-600' : 'text-gray-600'}`}>
                {privacy.twoFactor ? 'Enabled' : 'Disabled'}
              </span>
              <Toggle
                enabled={privacy.twoFactor}
                onChange={(val) => setPrivacy(prev => ({ ...prev, twoFactor: val }))}
              />
            </div>
          </SettingItem>
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection
          title="Notifications"
          description="Choose how you want to be notified"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <Toggle
                enabled={notifications.email}
                onChange={(val) => setNotifications(prev => ({ ...prev, email: val }))}
              />
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Receive push notifications on your device</p>
              </div>
              <Toggle
                enabled={notifications.push}
                onChange={(val) => setNotifications(prev => ({ ...prev, push: val }))}
              />
            </div>

            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-600">Receive important updates via text</p>
              </div>
              <Toggle
                enabled={notifications.sms}
                onChange={(val) => setNotifications(prev => ({ ...prev, sms: val }))}
              />
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium text-gray-900 mb-3">Notification Types</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Appointment Reminders</span>
                  <Toggle
                    enabled={notifications.appointments}
                    onChange={(val) => setNotifications(prev => ({ ...prev, appointments: val }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">New Reports Available</span>
                  <Toggle
                    enabled={notifications.reports}
                    onChange={(val) => setNotifications(prev => ({ ...prev, reports: val }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Medication Reminders</span>
                  <Toggle
                    enabled={notifications.medications}
                    onChange={(val) => setNotifications(prev => ({ ...prev, medications: val }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Marketing & Updates</span>
                  <Toggle
                    enabled={notifications.marketing}
                    onChange={(val) => setNotifications(prev => ({ ...prev, marketing: val }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </SettingSection>

        {/* Appearance Section */}
        <SettingSection
          title="Appearance"
          description="Customize how the app looks and feels"
        >
          <SettingItem icon={Palette} label="Theme">
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'auto'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setAppearance(prev => ({ ...prev, theme }))}
                  className={`p-3 rounded-lg border-2 transition-all capitalize ${
                    appearance.theme === theme
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {appearance.theme === theme && (
                    <Check className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  )}
                  {theme}
                </button>
              ))}
            </div>
          </SettingItem>

          <SettingItem icon={Globe} label="Language">
            <select
              value={appearance.language}
              onChange={(e) => setAppearance(prev => ({ ...prev, language: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </SettingItem>

          <SettingItem icon={Palette} label="Font Size">
            <div className="grid grid-cols-3 gap-3">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setAppearance(prev => ({ ...prev, fontSize: size }))}
                  className={`p-3 rounded-lg border-2 transition-all capitalize ${
                    appearance.fontSize === size
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {appearance.fontSize === size && (
                    <Check className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  )}
                  {size}
                </button>
              ))}
            </div>
          </SettingItem>
        </SettingSection>

        {/* Privacy Section */}
        <SettingSection
          title="Privacy"
          description="Control your data and privacy settings"
        >
          <SettingItem
            label="Profile Visibility"
            description="Control who can see your profile information"
          >
            <select
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </SettingItem>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Share Anonymous Data</p>
              <p className="text-sm text-gray-600">Help improve our service by sharing anonymous usage data</p>
            </div>
            <Toggle
              enabled={privacy.shareData}
              onChange={(val) => setPrivacy(prev => ({ ...prev, shareData: val }))}
            />
          </div>
        </SettingSection>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActionCard
            icon={HelpCircle}
            label="Help & Support"
            description="Get help with your account"
            onClick={() => console.log('Help & Support')}
          />
          <QuickActionCard
            icon={CreditCard}
            label="Billing & Plans"
            description="Manage your subscription"
            onClick={() => console.log('Billing')}
          />
          <QuickActionCard
            icon={Shield}
            label="Privacy Policy"
            description="Read our privacy policy"
            onClick={() => console.log('Privacy Policy')}
          />
          <QuickActionCard
            icon={LogOut}
            label="Sign Out"
            description="Sign out of your account"
            onClick={handleLogout}
            danger
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-4">
          Version 1.0.0 • Last updated: November 2024
        </div>
      </div>
    </div>
  );
}