"use client";

import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, Plus, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPassword({ params }) {
  const router = useRouter();
  // Unwrap the params properly in Next.js 15+ if needed, but since it's a client component, `useParams` might be safer or just using React.use()
  // Since we don't know the exact Next.js version (likely 13-14 here), we extract resettoken directly from params if available.
  const [resetToken, setResetToken] = useState(null);

  useEffect(() => {
    // Handling potential Promise-based params in newer Next.js versions
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params;
        setResetToken(resolvedParams.resettoken);
      } catch (err) {
        setResetToken(params?.resettoken);
      }
    };
    unwrapParams();
  }, [params]);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/auth/resetpassword/${resetToken}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // IMPORTANT: Let's assume the API returns a cookie or token. For now, we just want it to succeed.
        body: JSON.stringify({ password: formData.password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || data.errors?.[0] || "Failed to reset password");
      }

      setSuccess(true);
      // Optional: automatically redirect to login after a few seconds
      setTimeout(() => {
        router.push("/login"); // or "/" depending on auth flow
      }, 3000);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background text-slate-900 bg-grain flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full text-center">
          <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] p-10 md:p-16 border border-slate-900/5 relative overflow-hidden flex flex-col items-center">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-teal-500" />
            </div>
            <h2 className="text-3xl font-syne font-bold tracking-tighter mb-4 text-slate-900">
              Passkey Reset Successful
            </h2>
            <p className="text-slate-500 font-light text-lg mb-8">
              Your security credentials have been updated. You will be redirected to the login terminal shortly.
            </p>
            <Link 
              href="/" 
              className="text-white bg-slate-900 px-8 py-4 rounded-full font-bold hover:bg-teal-600 transition-colors inline-block"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                Initialize New Passkey
              </h2>
              <p className="text-slate-500 font-light text-lg">
                Please enter your new security credentials below to restore access to your health profile.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">New Secure Passkey</label>
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

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Confirm New Passkey</label>
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

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 animate-reveal-up">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !resetToken}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.25rem] hover:bg-teal-600 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Update Passkey</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        <p className="mt-12 text-center text-slate-400 text-xs uppercase tracking-widest font-bold">
          © 2026 MedTracker Protocol • Secure End-to-End Encryption
        </p>
      </div>
    </div>
  );
}
