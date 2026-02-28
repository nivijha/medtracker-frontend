'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  Calendar,
  FileText,
  Activity,
  ShieldCheck,
  Bell,
  ArrowUpRight,
  Menu,
  X,
  Plus,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Secure Records",
    description: "Store prescriptions and lab reports in an encrypted clinical vault.",
    tag: "Security"
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Smart Scheduling",
    description: "Intelligent tracking of follow-ups and specialist appointments.",
    tag: "Efficiency"
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Precision Alerts",
    description: "Never miss a dose with sophisticated medication reminders.",
    tag: "Care"
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: "Vitals History",
    description: "Visualize your health trajectory through data-driven insights.",
    tag: "Insights"
  }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-slate-900 bg-grain selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-background/80 backdrop-blur-md border-b border-slate-900/5' : 'py-6 bg-transparent'}`}>
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
              <Plus className="text-teal-500 w-5 h-5" />
            </div>
            <span className="text-xl font-syne font-bold tracking-tight">MedTracker</span>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-10">
            {['Services', 'Methodology', 'Ethics'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium hover:text-teal-600 transition-colors uppercase tracking-widest">{item}</a>
            ))}
            <Link href="/login" className="text-sm font-bold uppercase tracking-widest border-b-2 border-slate-900 pb-0.5 hover:border-teal-500 transition-colors">Login</Link>
            <Link href="/login">
              <button className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 active:scale-95">
                Get Started
              </button>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col p-8 pt-24 animate-fade-in md:hidden">
          {['Services', 'Methodology', 'Ethics'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-4xl font-syne font-bold mb-6 hover:text-teal-600 transition-colors">{item}</a>
          ))}
          <div className="mt-auto flex flex-col gap-4">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-syne font-bold border-b border-slate-900 pb-2">Login</Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="bg-slate-900 text-white py-4 rounded-2xl text-center font-bold">Get Started</Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative pt-40 md:pt-56 pb-20 md:pb-32 px-6 md:px-12 max-w-screen-2xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8 animate-reveal-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-900/10 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Next-Gen Medical Orchestration
            </div>
            <h1 className="text-5xl md:text-8xl font-syne font-bold leading-[0.9] tracking-tighter mb-10 text-balance">
              Your Health, <br />
              <span className="text-teal-500 italic">Meticulously</span> <br />
              Organized.
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-2xl leading-relaxed font-light">
              Elevate your healthcare journey with a sophisticated management interface designed for clarity, security, and human-centric care.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              <Link href="/login">
                <button className="group bg-slate-900 text-white px-10 py-5 rounded-full text-lg font-bold flex items-center justify-center gap-3 hover:bg-teal-600 transition-all duration-300">
                  Join the Network
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <button className="flex items-center gap-4 text-slate-900 font-bold group">
                <div className="w-12 h-12 rounded-full border border-slate-900 flex items-center justify-center transition-all group-hover:bg-slate-900 group-hover:text-white">
                  <Activity className="w-5 h-5" />
                </div>
                Explore Ecosystem
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 relative hidden lg:block">
            <div className="aspect-[3/4] bg-slate-100 rounded-[4rem] overflow-hidden relative border border-slate-900/5 group">
              <div className="absolute inset-0 bg-teal-500/10 group-hover:bg-teal-500/0 transition-colors duration-700" />
              <div className="absolute top-12 left-12 right-12">
                <div className="p-6 bg-white rounded-3xl shadow-2xl border border-slate-900/5 rotate-[-5deg] group-hover:rotate-0 transition-transform duration-700">
                  <div className="flex justify-between mb-8">
                    <Heart className="text-red-500" />
                    <ArrowUpRight className="text-slate-300" />
                  </div>
                  <div className="h-2 w-2/3 bg-slate-100 rounded-full mb-2" />
                  <div className="h-2 w-1/2 bg-slate-100 rounded-full" />
                </div>
                <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-2xl mt-4 translate-x-8 group-hover:translate-x-4 transition-transform duration-700">
                  <Activity className="text-teal-500 mb-4" />
                  <div className="text-xs uppercase tracking-widest font-bold opacity-60 mb-1">Vitals Check</div>
                  <div className="text-2xl font-syne font-bold">Stable Condition</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="services" className="py-24 md:py-40 px-6 md:px-12 bg-slate-900 text-white relative overflow-hidden rounded-[3rem] md:rounded-[5rem] mx-4 md:mx-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-start mb-24">
            <div>
              <h2 className="text-4xl md:text-6xl font-syne font-bold leading-[1.1] mb-8">
                The Anatomy of <br />
                MedTracker.
              </h2>
            </div>
            <div className="lg:pt-4">
              <p className="text-xl text-slate-400 font-light leading-relaxed">
                Our ecosystem integrates seamlessly into your life, providing the clinical rigor of a professional tool with the intuitive grace of premium design.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800 border border-slate-800 overflow-hidden rounded-3xl">
            {features.map((feature, i) => (
              <div key={i} className="p-10 bg-slate-900 group hover:bg-slate-800 transition-colors duration-500">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500 mb-8 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-teal-500 mb-4 opacity-70">
                  {feature.tag}
                </div>
                <h3 className="text-2xl font-syne font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] aspect-square rounded-full bg-teal-500/5 blur-[120px]" />
      </section>

      {/* METHODOLOGY SECTION */}
      <section id="methodology" className="py-32 md:py-56 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center text-center mb-24">
          <div className="text-sm font-bold uppercase tracking-[0.3em] text-teal-600 mb-6">Execution</div>
          <h2 className="text-4xl md:text-7xl font-syne font-bold tracking-tighter max-w-4xl text-balance">
            Designed for those who value <span className="italic">precision</span> in their wellbeing.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "Onboarding",
              desc: "Secure biometric authentication and profile synchronization across devices."
            },
            {
              step: "02",
              title: "Aggregation",
              desc: "Automated ingestion of medical documents, lab results, and medication history."
            },
            {
              step: "03",
              title: "Management",
              desc: "Proactive tracking and real-time alerts within a unified health dashboard."
            }
          ].map((item, i) => (
            <div key={i} className="relative pt-12 border-t border-slate-900/10">
              <div className="text-6xl font-syne font-black text-slate-100 absolute top-0 left-0 leading-none -translate-y-1/2">
                {item.step}
              </div>
              <h3 className="text-2xl font-syne font-bold mb-4">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-6 md:px-12 mb-20 max-w-screen-2xl mx-auto">
        <div className="bg-teal-500 rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 flex flex-col items-center text-center text-slate-900 relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-syne font-bold mb-10 tracking-tighter">
              Ready for a clinical <br /> upgrade?
            </h2>
            <Link href="/login">
              <button className="bg-slate-900 text-white px-12 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform duration-300">
                Initiate Secure Access
              </button>
            </Link>
          </div>
          
          {/* Decorative floating icon */}
          <Activity className="absolute bottom-[-10%] right-[10%] w-64 h-64 text-slate-900/5 -rotate-12 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-0" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-slate-900/5 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="grid md:grid-cols-12 gap-12 items-start mb-20">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                <Plus className="text-teal-500 w-4 h-4" />
              </div>
              <span className="text-xl font-syne font-bold tracking-tight">MedTracker</span>
            </div>
            <p className="text-slate-500 max-w-xs leading-relaxed">
              Personal health management through technical precision and aesthetic grace.
            </p>
          </div>
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Ecosystem', 'Resources', 'Legal', 'Social'].map((category) => (
              <div key={category}>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">{category}</div>
                <div className="flex flex-col gap-4 text-sm font-medium">
                  <a href="#" className="hover:text-teal-600 transition-colors">Interface</a>
                  <a href="#" className="hover:text-teal-600 transition-colors">Security</a>
                  <a href="#" className="hover:text-teal-600 transition-colors">Insights</a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:row gap-8 justify-between items-center text-[10px] uppercase tracking-widest font-bold text-slate-400">
          <div>© 2026 MedTracker Protocol. All Rights Reserved.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Codex</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
