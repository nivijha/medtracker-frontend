"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile, updateUserSecurity } from "@/lib/utils";

/* ================= CLOUDINARY UPLOAD ================= */

const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message);
  return data.secure_url;
};

/* ================= PAGE ================= */

export default function EditProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await getProfile();
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        profileImage: user.profileImage || "",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  /* ================= VALIDATION ================= */

  const passwordTouched =
    passwords.current || passwords.new || passwords.confirm;

  const passwordMismatch =
    passwords.new && passwords.confirm && passwords.new !== passwords.confirm;

  const sameAsCurrent =
    passwords.current &&
    passwords.new &&
    passwords.current === passwords.new;

  const passwordTooShort =
    passwords.new && passwords.new.length < 6;

  const passwordInvalid =
    passwordMismatch || sameAsCurrent || passwordTooShort;

  const isProfileChanged = () =>
    form.name || form.email || form.phone || form.address || form.profileImage;

  /* ================= SAVE ================= */

  const handleSave = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    try {
      setSaving(true);

      await updateProfile(form);

      if (passwordTouched) {
        if (passwordInvalid) return;

        await updateUserSecurity({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        });

        setPasswordSuccess("Password updated successfully");
      }

      router.push("/profile");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to update password"
      );
    } finally {
      setSaving(false);
      setPasswords({ current: "", new: "", confirm: "" });
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6 space-y-8">
        <h1 className="text-2xl font-bold">Edit Profile</h1>

        {/* PROFILE IMAGE */}
        <div className="flex items-center gap-4">
          {form.profileImage ? (
            <img src={form.profileImage} className="w-24 h-24 rounded-full" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold">
              {form.name?.[0]}
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer text-blue-600 text-sm">
            <Camera className="w-4 h-4" />
            Change photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                setUploading(true);
                const url = await uploadToCloudinary(file);
                updateField("profileImage", url);
                setUploading(false);
              }}
            />
          </label>
        </div>

        {/* PROFILE INFO */}
        <Input label="Full Name" icon={User} value={form.name} onChange={(v) => updateField("name", v)} />
        <Input label="Email" icon={Mail} value={form.email} onChange={(v) => updateField("email", v)} />
        <Input label="Phone" icon={Phone} value={form.phone} onChange={(v) => updateField("phone", v)} />
        <Input label="Address" icon={MapPin} value={form.address} onChange={(v) => updateField("address", v)} />

        {/* PASSWORD */}
        <div className="pt-6 border-t space-y-3">
          <h2 className="text-lg font-semibold flex gap-2">
            <Lock className="w-5 h-5" /> Change Password
          </h2>

          <PasswordInput placeholder="Current password" value={passwords.current} onChange={(v) => setPasswords(p => ({ ...p, current: v }))} show={showPassword} toggle={() => setShowPassword(!showPassword)} />
          <PasswordInput placeholder="New password" value={passwords.new} onChange={(v) => setPasswords(p => ({ ...p, new: v }))} show={showPassword} toggle={() => setShowPassword(!showPassword)} />
          <PasswordInput placeholder="Confirm new password" value={passwords.confirm} onChange={(v) => setPasswords(p => ({ ...p, confirm: v }))} show={showPassword} toggle={() => setShowPassword(!showPassword)} />

          {passwordMismatch && <InlineError message="Passwords do not match" />}
          {sameAsCurrent && <InlineError message="New password must be different" />}
          {passwordTooShort && <InlineError message="Password must be at least 6 characters" />}
          {passwordError && <InlineError message={passwordError} />}
          {passwordSuccess && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4" />
              {passwordSuccess}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={() => router.push("/profile")} className="border px-4 py-2 rounded-lg flex gap-2">
            <X className="w-4 h-4" /> Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={
              saving ||
              uploading ||
              (passwordTouched && passwordInvalid) ||
              (!isProfileChanged() && !passwordTouched)
            }
            className={`px-4 py-2 rounded-lg flex gap-2 ${
              saving || uploading || passwordInvalid
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Input = ({ label, icon: Icon, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-10 py-2 border rounded-lg" />
    </div>
  </div>
);

const PasswordInput = ({ placeholder, value, onChange, show, toggle }) => (
  <div className="relative">
    <input type={show ? "text" : "password"} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full pr-10 px-3 py-2 border rounded-lg" />
    <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>
);

const InlineError = ({ message }) => (
  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
    <AlertCircle className="w-4 h-4" />
    {message}
  </div>
);
