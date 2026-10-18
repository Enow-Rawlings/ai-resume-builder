import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import api from "../configs/api.js";

const inputCls =
  "mt-2 block w-full rounded-2xl border border-slate-200 bg-[#F7F2FF] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#9400D3] focus:ring-2 focus:ring-[#9400D3]/20";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/contact", form);
      toast.success(data.message);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F0FF] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-[2rem] border border-[#9400D3]/10 bg-white shadow-2xl shadow-[#9400D3]/10">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">

            {/* ── Left panel ─────────────────────────────────────────── */}
            <section className="bg-[#9400D3] px-8 py-10 text-white sm:px-10 sm:py-12">
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#D3D3FF]">
                Contact
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
                Let's build your next career story.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#E8DBFF] sm:text-lg">
                Need help with your resume, templates, or account? Send us a message and we'll respond within one business day.
              </p>

              <div className="mt-10 space-y-6 rounded-[2rem] bg-white/10 p-6 text-sm text-[#F3E9FF] shadow-lg">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#D3D3FF]/80">Email</p>
                  <p className="mt-2 font-medium">akohenow91@gmail.com</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#D3D3FF]/80">Phone</p>
                  <p className="mt-2 font-medium">+237 672 080 490</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#D3D3FF]/80">Office</p>
                  <p className="mt-2 font-medium">Remote-first, global support</p>
                </div>
              </div>

              <Link
                to="/"
                className="mt-10 inline-flex rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Back to home
              </Link>
            </section>

            {/* ── Right panel — form ─────────────────────────────────── */}
            <section className="px-8 py-10 sm:px-10 sm:py-12">
              <div className="max-w-xl space-y-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#9400D3]">
                    Send a message
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                    Quick support form
                  </h2>
                  <p className="mt-4 text-base leading-7 text-slate-600">
                    Share your details and we'll follow up with a personalised response.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Name
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                        className={inputCls}
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Email
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className={inputCls}
                      />
                    </label>
                  </div>

                  <label className="block text-sm font-medium text-slate-700">
                    Subject
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What can we help with?"
                      required
                      className={inputCls}
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-700">
                    Message
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Tell us about your issue or question..."
                      required
                      className={`${inputCls} resize-none`}
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#9400D3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7b00c5] disabled:opacity-60 disabled:cursor-not-allowed sm:w-auto active:scale-95"
                  >
                    {loading && <Loader2 className="size-4 animate-spin" />}
                    {loading ? "Sending..." : "Send message"}
                  </button>
                </form>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
