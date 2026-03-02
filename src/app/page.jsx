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
  ArrowRight,
  MessageCircle,
  Sparkles,
  Bot,
  Check
} from 'lucide-react';
import ContactModal from './components/ui/ContactModal';
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
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "AI Assistant",
    description: "Conversational AI to schedule appointments and manage medications by simply asking.",
    tag: "Intelligence"
  }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactState, setContactState] = useState('idle'); // idle, sending, sent

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-slate-900 bg-grain selection:bg-teal-500/30 overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'py-3 bg-background/90 backdrop-blur-md border-b border-slate-900/5' : 'py-4 bg-transparent'}`}>
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
              <Plus className="text-teal-500 w-4 h-4" />
            </div>
            <span className="text-lg font-syne font-bold tracking-tight">MedTracker</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-10">
            {['Services', 'Methodology'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
            <Link href="/login" className="relative text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors group">
              Login
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
            <Link href="/login">
              <button className="bg-slate-900 text-white px-7 py-3 rounded-full text-base font-bold hover:bg-teal-600 transition-all duration-300">
                Get Started
              </button>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col p-8 pt-20 animate-fade-in md:hidden">
          <div className="flex flex-col gap-6">
            {['Services', 'Methodology'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-syne font-bold hover:text-teal-600 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-4">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-xl font-syne font-bold border-b border-slate-900 pb-2">Login</Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="bg-slate-900 text-white py-4 rounded-2xl text-center font-bold">Get Started</Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 px-6 md:px-12 max-w-screen-2xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8 animate-reveal-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-900/10 text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Your health, simplified.
            </div>
            <h1 className="text-5xl md:text-8xl font-syne font-bold leading-[0.9] tracking-tighter mb-10 text-balance">
              Your Health, <br />
              <span className="text-teal-500 italic">Meticulously</span> <br />
              Organized.
            </h1>
            <p className="text-lg md:text-xl text-slate-700 max-w-2xl leading-relaxed font-light">
              MedTracker keeps your appointments, medications, and reports in one place — so you always know what's going on with your health.
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
      <section id="services" className="py-16 md:py-24 px-6 md:px-12 bg-slate-900 text-white relative overflow-hidden rounded-[2rem] md:rounded-[3rem] mx-4 md:mx-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-syne font-bold leading-[1.1] mb-8">
                What MedTracker does.
              </h2>
            </div>
            <div className="lg:pt-4">
              <p className="text-xl text-slate-400 font-light leading-relaxed">
                Everything you need to stay on top of your health — no complexity, no jargon.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 xl:grid-cols-5 gap-px bg-slate-800 border border-slate-800 overflow-hidden rounded-3xl">
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

      {/* AI CHATBOT SPOTLIGHT SECTION */}
      <section className="py-14 md:py-20 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-900/10 text-[10px] font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Powered by LLaMA-3
            </div>
            <h2 className="text-4xl md:text-6xl font-syne font-bold leading-[1.05] tracking-tighter mb-8">
              Your Health,<br />
              <span className="text-teal-500 italic">Conversational.</span>
            </h2>
            <p className="text-lg text-slate-600 font-light leading-relaxed mb-10 max-w-lg">
              MedTracker AI understands natural language. Just say <em>&ldquo;Schedule an appointment with Dr. Smith next Monday&rdquo;</em> or <em>&ldquo;Remove Metformin from my medications&rdquo;</em> — no forms, no menus.
            </p>
            <div className="space-y-4">
              {[
                { label: "Book or cancel appointments just by saying so" },
                { label: "Add or remove medications in plain English" },
                { label: "Ask about your reports or health summaries" },
                { label: "Available in the bottom-right corner when you're logged in" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-500/15 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>
            <Link href="/login">
              <button className="mt-12 group bg-slate-900 text-white px-10 py-5 rounded-full text-sm font-bold flex items-center gap-3 hover:bg-teal-600 transition-all duration-300">
                Try the AI Assistant
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>

          {/* Right: mock chat UI */}
          <div className="relative">
            <div className="bg-white rounded-[3rem] border border-slate-900/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
              {/* Chat header */}
              <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-teal-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">MedTracker AI</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              {/* Chat messages */}
              <div className="p-6 space-y-4 bg-slate-50">
                <div className="bg-white rounded-2xl rounded-bl-sm p-4 shadow-sm border border-slate-100 max-w-[85%] text-sm text-slate-700 leading-relaxed">
                  Hi! I can help you manage your health. What would you like to do today?
                </div>
                <div className="bg-teal-500 text-white rounded-2xl rounded-br-sm p-4 ml-auto max-w-[85%] text-sm leading-relaxed">
                  Cancel my appointment with Dr. Smith
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm p-4 shadow-sm border border-slate-100 max-w-[85%] text-sm text-slate-700 leading-relaxed">
                  ✅ Done! Your appointment with Dr. Smith has been cancelled. Is there anything else I can help with?
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
              {/* Chat input */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center gap-3">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-400">
                  Ask me anything...
                </div>
                <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-white">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full bg-teal-500/8 blur-[80px]" />
          </div>
        </div>
      </section>

      {/* METHODOLOGY SECTION */}
      <section id="methodology" className="py-12 md:py-16 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="flex flex-col items-center text-center mb-14">
          <div className="text-sm font-bold uppercase tracking-[0.3em] text-teal-600 mb-6">How it works</div>
          <h2 className="text-4xl md:text-7xl font-syne font-bold tracking-tighter max-w-4xl text-balance">
            Simple to set up. <span className="italic">Simple to use.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "Sign up",
              desc: "Create your account in seconds. Your data is encrypted from day one."
            },
            {
              step: "02",
              title: "Add your info",
              desc: "Upload reports, add medications, and book your first appointment."
            },
            {
              step: "03",
              title: "Stay on top of it",
              desc: "Get reminders, track your history, and ask the AI assistant anything."
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
      <section className="py-10 px-6 md:px-12 mb-10 max-w-screen-2xl mx-auto">
        <div className="bg-teal-500 rounded-[2rem] md:rounded-[3rem] p-10 md:p-16 flex flex-col items-center text-center text-slate-900 relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-syne font-bold mb-8 tracking-tighter">
              Ready to take control <br /> of your health?
            </h2>
            <Link href="/login">
              <button className="bg-slate-900 text-white px-12 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform duration-300">
                Get Started
              </button>
            </Link>
          </div>
          
          {/* Decorative floating icon */}
          <Activity className="absolute bottom-[-10%] right-[10%] w-64 h-64 text-slate-900/5 -rotate-12 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-0" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-slate-900/10 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center">
                <Plus className="text-teal-500 w-3 h-3" />
              </div>
              <span className="text-base font-syne font-bold tracking-tight">MedTracker</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[150px]">A personal health management app.</p>
          </div>

          {/* Navigate */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Navigate</span>
            <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm text-slate-600 hover:text-teal-600 transition-colors cursor-pointer">Features</a>
            <a href="#methodology" onClick={(e) => { e.preventDefault(); document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm text-slate-600 hover:text-teal-600 transition-colors cursor-pointer">How it works</a>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Account</span>
            <Link href="/login" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Login</Link>
            <Link href="/login" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">Sign up</Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Support</span>
            <button 
              onClick={() => setShowContactModal(true)}
              className="text-sm text-left text-slate-600 hover:text-teal-600 transition-colors"
            >
              Contact Us
            </button>
            <a href="mailto:support@medtracker.app" className="text-sm text-slate-600 hover:text-teal-600 transition-colors">support@medtracker.app</a>
          </div>
        </div>

        <div className="pt-5 text-[10px] uppercase tracking-widest font-bold text-slate-400 text-center">
          © 2026 MedTracker
        </div>
      </footer>

      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />

    </div>
  );
}
