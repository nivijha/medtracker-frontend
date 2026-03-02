import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageCircle, Check, ArrowRight } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [contactState, setContactState] = useState('idle'); // idle, sending, sent, error
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] px-6 py-12">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl border border-slate-900/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-reveal-up overflow-hidden relative flex flex-col">
        <button 
          onClick={() => {
            onClose();
            // Reset state slightly after close animation would finish
            setTimeout(() => setContactState('idle'), 300);
          }}
          className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors z-10"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
        
        <div className="p-10 md:p-14">
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-3xl font-syne font-bold text-slate-900 tracking-tight mb-2">Get in touch</h3>
            <p className="text-slate-500 font-light">Have a question? We'd love to hear from you.</p>
          </div>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              setContactState('sending');
              const form = e.target;
              const formData = {
                name: `${form.firstName.value} ${form.lastName.value}`.trim(),
                email: form.email.value,
                message: form.message.value
              };
              
              try {
                const response = await fetch('http://localhost:5000/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                  setContactState('sent');
                  form.reset();
                  setTimeout(() => setContactState('idle'), 3000); // Clear message after 3s
                } else {
                  setContactState('error');
                  setTimeout(() => setContactState('idle'), 3000);
                }
              } catch (error) {
                setContactState('error');
                setTimeout(() => setContactState('idle'), 3000);
              }
            }} 
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">First Name</label>
                <input required name="firstName" type="text" className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-medium border border-slate-900/5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Last Name</label>
                <input required name="lastName" type="text" className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-medium border border-slate-900/5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <input required name="email" type="email" className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-medium border border-slate-900/5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400" placeholder="jane@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Message</label>
              <textarea required name="message" rows={4} className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-sm font-medium border border-slate-900/5 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 resize-none" placeholder="How can we help?" />
            </div>

            {contactState === 'sent' && (
              <div className="flex items-center justify-center gap-2 text-teal-600 font-bold text-sm bg-teal-50 py-3 rounded-2xl animate-fade-in">
                <Check className="w-4 h-4" /> Message sent!
              </div>
            )}
            
            {contactState === 'error' && (
              <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-sm bg-red-50 py-3 rounded-2xl animate-fade-in">
                <X className="w-4 h-4" /> Failed to send message.
              </div>
            )}

            <button 
              type="submit" 
              disabled={contactState === 'sending'}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-teal-600 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {contactState === 'sending' ? (
                <span className="animate-pulse">Sending...</span>
              ) : (
                <>
                  <span>Send Message</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
