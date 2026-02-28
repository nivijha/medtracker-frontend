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
  Loader2,
  ArrowRight,
  ShieldCheck,
  Plus
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

  const passwordTouched =
    passwords.current || passwords.new || passwords.confirm;

  const passwordMismatch =
    passwords.new && passwords.confirm && passwords.new !== passwords.confirm;

  const sameAsCurrent =
    passwords.current && passwords.new && passwords.current === passwords.new;

  const passwordTooShort = passwords.new && passwords.new.length < 6;

  const passwordInvalid =
    passwordMismatch || sameAsCurrent || passwordTooShort;

  const isProfileChanged = () =>
    form.name || form.email || form.phone || form.address || form.profileImage;

  const handleSave = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    try {
      setSaving(true);
      const res = await updateProfile(form);

      localStorage.setItem("user", JSON.stringify(res.user));
      window.dispatchEvent(new Event("storage"));

      if (passwordTouched) {
        if (passwordInvalid) return;
        await updateUserSecurity({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        });
        setPasswordSuccess("Security credentials updated.");
      }

      router.push("/profile");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Security update failed."
      );
    } finally {
      setSaving(false);
      setPasswords({ current: "", new: "", confirm: "" });
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-reveal-up pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 px-4 md:px-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-900/10 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            Identity Management
          </div>
          <h1 className="text-4xl md:text-6xl font-syne font-bold tracking-tighter">
            Modify Profile.
          </h1>
          <p className="text-slate-500 text-lg font-light mt-2">
            Update your clinical identity and security parameters.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* PROFILE IMAGE & IDENTITY */}
          <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-10">
            <div className="flex items-center gap-8">
              <div className="relative group">
                {form.profileImage ? (
                  <img
                    src={form.profileImage}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] object-cover border-4 border-slate-50 shadow-xl transition-transform group-hover:scale-105 duration-500"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] bg-teal-500 text-slate-900 flex items-center justify-center text-3xl font-syne font-black shadow-xl">
                    {form.name?.[0]}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-slate-900/40 rounded-[2rem] flex items-center justify-center backdrop-blur-sm">
                    <Loader2 size={24} className="text-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-syne font-bold tracking-tight">Profile Visualization</h3>
                <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-900 text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-teal-600 transition-all duration-300">
                  <Camera size={14} />
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setUploading(true);
                      try {
                        const url = await uploadToCloudinary(file);
                        updateField("profileImage", url);
                      } catch (err) {
                        console.error("Upload failed", err);
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Input label="Legal Name" icon={User} value={form.name} onChange={(v) => updateField("name", v)} placeholder="John Doe" />
              <Input label="Secure Email" icon={Mail} value={form.email} onChange={(v) => updateField("email", v)} placeholder="protocol@medtracker.io" />
              <Input label="Contact Terminal" icon={Phone} value={form.phone} onChange={(v) => updateField("phone", v)} placeholder="+1 234 567 890" />
              <Input label="Geographic Node" icon={MapPin} value={form.address} onChange={(v) => updateField("address", v)} placeholder="Global Citizen" />
            </div>
          </div>

          {/* SECURITY */}
          <div className="bg-slate-900 text-white rounded-[3rem] p-10 md:p-12 shadow-2xl space-y-10 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-teal-500">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-syne font-bold tracking-tight">Security Credentials</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Update Protocol Passkeys</p>
                </div>
              </div>

              <div className="space-y-6">
                <PasswordInput placeholder="Current Passkey" value={passwords.current} onChange={(v) => setPasswords((p) => ({ ...p, current: v }))} show={showPassword} toggle={() => setShowPassword(!showPassword)} />
                <div className="grid md:grid-cols-2 gap-6">
                  <PasswordInput placeholder="New Passkey" value={passwords.new} onChange={(v) => setPasswords((p) => ({ ...p, new: v }))} show={showPassword} toggle={() => setShowPassword(!showPassword)} />
                  <PasswordInput placeholder="Confirm New Passkey" value={passwords.confirm} onChange={(v) => setPasswords((p) => ({ ...p, confirm: v }))} show={showPassword} toggle={() => setShowPassword(!showPassword)} />
                </div>

                <div className="space-y-3">
                  {passwordMismatch && <InlineError message="Credential mismatch detected." />}
                  {sameAsCurrent && <InlineError message="New passkey must be unique." />}
                  {passwordTooShort && <InlineError message="Minimum length: 6 characters." />}
                  {passwordError && <InlineError message={passwordError} />}
                  {passwordSuccess && (
                    <div className="flex items-center gap-3 text-teal-500 bg-teal-500/10 p-5 rounded-2xl border border-teal-500/20 text-xs font-bold uppercase tracking-widest">
                      <CheckCircle className="w-4 h-4" />
                      {passwordSuccess}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-[100px]" />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-900/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] sticky top-32">
            <h3 className="text-xl font-syne font-bold mb-8">Modification Controls</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleSave}
                disabled={
                  saving ||
                  uploading ||
                  (passwordTouched && passwordInvalid) ||
                  (!isProfileChanged() && !passwordTouched)
                }
                className="w-full bg-slate-900 text-white py-5 rounded-[1.25rem] hover:bg-teal-600 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Apply Changes</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <button
                onClick={() => router.push("/profile")}
                className="w-full py-5 rounded-[1.25rem] border border-slate-900/10 text-slate-500 font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-colors"
              >
                Discard Edits
              </button>
            </div>

            <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-900/5">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck size={16} className="text-teal-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">Security Note</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-tight">
                Any changes to your identity or credentials will be logged in the clinical security ledger.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const Input = ({ label, icon: Icon, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">{label}</label>
    <div className="relative group">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-medium text-slate-900"
      />
    </div>
  </div>
);

const PasswordInput = ({ placeholder, value, onChange, show, toggle }) => (
  <div className="relative group">
    <input
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:bg-white focus:text-slate-900 focus:border-teal-500 outline-none transition-all font-medium text-white placeholder:text-slate-600"
    />
    <button
      type="button"
      onClick={toggle}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-teal-500 transition-colors"
    >
      {show ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
);

const InlineError = ({ message }) => (
  <div className="flex items-center gap-3 text-red-400 bg-red-400/10 p-5 rounded-2xl border border-red-400/20 text-xs font-bold uppercase tracking-widest">
    <AlertCircle className="w-4 h-4" />
    {message}
  </div>
);
