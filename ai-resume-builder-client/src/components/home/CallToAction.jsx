import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useInView from "../../hooks/useInView";

const CallToAction = () => {
  const [ref, visible] = useInView(0.1);

  return (
    <section
      id="cta"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:px-10 lg:py-24"
    >
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-[2rem] bg-[#9400D3] px-8 py-14 shadow-2xl shadow-[#9400D3]/30 sm:px-12 lg:px-16 fade-up ${visible ? "visible" : ""}`}
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#D3D3FF]/10 blur-2xl" />

        <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          {/* Copy */}
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D3D3FF]/80">
              Ready to get hired?
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Build your resume faster with{" "}
              <span className="text-[#D3D3FF]">AI-crafted designs</span> and instant exports.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 lg:text-base">
              Start from a polished template, personalise your story, and download a resume
              that stands out in every applicant pool.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex shrink-0 flex-col items-center gap-3 sm:flex-row lg:flex-col lg:items-stretch xl:flex-row">
            <Link
              to="/app"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#9400D3] transition hover:bg-[#D3D3FF] active:scale-95"
            >
              Start building
              <ArrowRight size={15} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-95"
            >
              Explore features
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
