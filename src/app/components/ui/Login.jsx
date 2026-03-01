"use client";

import React, { useState } from "react";
import { Heart, Mail, Lock, Eye, EyeOff, User, Phone, Plus, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (!formData.phone) {
          setError("Phone number is required");
          setLoading(false);
          return;
        }

        await register(
          formData.name,
          formData.email,
          formData.phone,
          formData.password
        );
      }
    } catch (err) {
      console.error(err);
      const apiError = err.response?.data;

      if (apiError?.errors?.length) {
        setError(apiError.errors.join(" • "));
      } else {
        setError(apiError?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 bg-grain flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full">
        <Link href="/" className="flex items-center gap-2 justify-center mb-12 group">
          <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
            <Plus className="text-teal-500 w-6 h-6" />
          </div>
          <span className="text-3xl font-syne font-bold tracking-tight">MedTracker</span>
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] p-10 md:p-16 border border-slate-900/5 relative overflow-hidden">
          {/* Subtle decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-[5rem]" />

          <div className="relative z-10">
            <div className="mb-12">
              <h2 className="text-4xl font-syne font-bold tracking-tighter mb-4">
                {isLogin ? "Access the Protocol" : "Join the Network"}
              </h2>
              <p className="text-slate-500 font-light text-lg">
                {isLogin 
                  ? "Enter your credentials to synchronize with your health profile." 
                  : "Initialize your secure health ecosystem today."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {!isLogin && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors group-focus-within:text-teal-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors group-focus-within:text-teal-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 987 654 3210"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors group-focus-within:text-teal-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="protocol@medtracker.io"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Secure Passkey</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors group-focus-within:text-teal-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Confirm Passkey</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 transition-colors group-focus-within:text-teal-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 animate-reveal-up">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.25rem] hover:bg-teal-600 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-colors"
              >
                {isLogin ? "Need to join the network?" : "Already have clinical access?"}
              </button>
            </div>
          </div>
        </div>
        
        <p className="mt-12 text-center text-slate-400 text-xs uppercase tracking-widest font-bold">
          © 2026 MedTracker Protocol • Secure End-to-End Encryption
        </p>
      </div>
    </div>
  );
}
