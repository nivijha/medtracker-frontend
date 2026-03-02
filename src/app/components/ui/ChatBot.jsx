"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { sendChatMessage } from "@/lib/utils";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Welcome to MedTracker AI 👋

I can help you manage your health information.

You can ask me to:

1. Schedule an appointment
2. Track medications
3. View medical reports
4. Set reminders
5. Ask a health question

What would you like to do today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const popupTimerRef = useRef(null);

  // Show notification popup on every mount (every login / page visit)
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-dismiss popup after 5 seconds once visible
  useEffect(() => {
    if (showPopup) {
      popupTimerRef.current = setTimeout(() => setShowPopup(false), 5000);
    }
    return () => clearTimeout(popupTimerRef.current);
  }, [showPopup]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = () => {
    setShowPopup(false);
    clearTimeout(popupTimerRef.current);
    setOpen(true);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatMessage(newMessages);
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);

      if (data.action === "refresh_appointments") {
        window.dispatchEvent(new Event("refreshAppointments"));
      }
      if (data.action === "refresh_medications") {
        window.dispatchEvent(new Event("refreshMedications"));
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "AI service unavailable. Please try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* NOTIFICATION POPUP */}
      {showPopup && !open && (
        <div className="fixed bottom-24 right-6 z-[200] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="relative bg-slate-900 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-2xl max-w-[220px]">
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-slate-600 hover:bg-slate-500 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={10} />
            </button>

            {/* Sparkle icon + text */}
            <div className="flex items-start gap-2">
              <Sparkles size={14} className="text-teal-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold leading-tight">MedTracker AI</p>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Ask me to schedule, track meds, or view your reports!
                </p>
              </div>
            </div>

            {/* Tooltip tail */}
            <div className="absolute bottom-[-6px] right-4 w-3 h-3 bg-slate-900 rotate-45" />
          </div>
        </div>
      )}

      {/* FLOAT BUTTON */}
      <button
        onClick={() => (open ? setOpen(false) : openChat())}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 bg-teal-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:bg-teal-600 transition-all duration-200"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-24 right-6 w-[360px] h-[480px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-[200]">
          {/* HEADER */}
          <div className="p-4 bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                <Sparkles size={14} className="text-teal-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">MedTracker AI</p>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl text-sm max-w-[82%] whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-teal-500 text-white ml-auto rounded-br-sm"
                    : "bg-white text-slate-900 shadow-sm border border-slate-100 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-white text-slate-400 p-3 rounded-2xl rounded-bl-sm text-sm shadow-sm border border-slate-100 max-w-[82%] flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-xs">Thinking...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 border-t border-slate-100 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) sendMessage();
              }}
              placeholder="Ask something..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-500 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-2 bg-teal-500 text-white rounded-xl disabled:opacity-40 hover:bg-teal-600 transition-colors"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
