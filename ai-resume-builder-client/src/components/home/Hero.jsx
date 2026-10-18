import React from "react";
import { Link } from "react-router-dom";
import HomeNavbar from "./Navbar";
import ModernTemplate from "../../assets/templates/ModernTemplate";
import { dummyResumeData } from "../../assets/assets";
import useInView from "../../hooks/useInView";

// Use the first dummy resume with a purple accent
const previewData = dummyResumeData[0];
const previewAccent = "#9400D3";

const Hero = () => {
  const [headRef, headVisible] = useInView(0.1);
  const [previewRef, previewVisible] = useInView(0.05);

  return (
    <div className="relative overflow-hidden bg-white">
      <HomeNavbar />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#9400D3]/8 blur-3xl" />
        <div className="absolute top-0 -right-32 h-64 w-64 rounded-full bg-[#D3D3FF]/40 blur-3xl" />
        <div className="absolute bottom-0 -left-20 h-48 w-48 rounded-full bg-[#9400D3]/6 blur-2xl" />
      </div>

      {/* ── Text + CTAs ───────────────────────────────────────────────── */}
      <div
        ref={headRef}
        className={`mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-20 md:px-10 lg:pt-28 fade-up ${headVisible ? "visible" : ""}`}
      >
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-[#9400D3]/20 bg-[#D3D3FF]/30 px-4 py-1.5 text-xs font-medium text-[#9400D3]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#9400D3]" />
          AI-powered resume builder
        </span>

        {/* Headline */}
        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl md:leading-[1.15]">
          Land your dream job with{" "}
          <span className="bg-gradient-to-r from-[#9400D3] to-[#c44dff] bg-clip-text text-transparent">
            AI-powered
          </span>{" "}
          resumes
        </h1>

        {/* Sub-copy */}
        <p className="max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
          Create polished, recruiter-ready resumes in minutes with smart content suggestions,
          role-focused formatting, and beautiful templates.
        </p>

        {/* CTAs */}
        <div className="mt-1 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/app"
            className="w-full max-w-xs rounded-full bg-[#9400D3] px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-[#9400D3]/25 transition hover:bg-[#7a00b5] active:scale-95 sm:w-auto"
          >
            Get started free
          </Link>
          <a
            href="#how-it-works"
            className="w-full max-w-xs rounded-full border border-[#9400D3]/25 bg-white px-8 py-3.5 text-center text-sm font-semibold text-[#9400D3] transition hover:bg-[#9400D3]/5 active:scale-95 sm:w-auto"
          >
            See how it works
          </a>
        </div>

        {/* Trust micro-line */}
        <p className="text-xs text-slate-400">
          No credit card required &nbsp;·&nbsp; Download as PDF instantly
        </p>
      </div>

      {/* ── Product preview ───────────────────────────────────────────── */}
      <div
        ref={previewRef}
        className={`mx-auto mb-4 max-w-5xl px-4 sm:px-6 md:px-10 pb-10 fade-up delay-2 ${previewVisible ? "visible" : ""}`}
      >
        {/* Browser chrome */}
        <div className="rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl shadow-[#9400D3]/10 overflow-hidden">
          {/* Fake browser bar */}
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
            <span className="h-3 w-3 rounded-full bg-green-400/70" />
            <div className="mx-auto flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-1 text-xs text-slate-400 w-48 sm:w-64">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              cvpilot.app/builder
            </div>
          </div>

          {/* Scaled-down resume; the outer div clips it so it never overflows */}
          <div className="relative w-full overflow-hidden bg-white" style={{ height: "420px" }}>
            {/* The template renders at full width inside a scaled wrapper */}
            <div
              className="absolute top-0 left-0 origin-top-left"
              style={{
                width: "960px",          // natural template width
                transform: "scale(var(--preview-scale, 0.52))",
                // dynamically scale via CSS custom property overridden at each breakpoint
              }}
            >
              <style>{`
                @media (min-width: 1024px) { :root { --preview-scale: 0.62; } }
                @media (min-width: 640px) and (max-width: 1023px) { :root { --preview-scale: 0.48; } }
                @media (max-width: 639px) { :root { --preview-scale: 0.34; } }
              `}</style>
              <ModernTemplate data={previewData} accentColor={previewAccent} />
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="mt-4 text-center text-xs text-slate-400">
          Live preview of the Modern template, one of{" "}
          <a href="#features" className="text-[#9400D3] hover:underline">4 available templates</a>
        </p>
      </div>
    </div>
  );
};

export default Hero;
