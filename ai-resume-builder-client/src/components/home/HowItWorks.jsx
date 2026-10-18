import React from "react";
import { UserCircle, Sparkles, Download } from "lucide-react";
import { Link } from "react-router-dom";
import useInView from "../../hooks/useInView";

const steps = [
  {
    number: "01",
    icon: <UserCircle className="text-[#9400D3]" size={28} />,
    title: "Enter your details",
    description:
      "Fill in your work history, skills, and education. Takes about 5 minutes, no formatting headaches.",
  },
  {
    number: "02",
    icon: <Sparkles className="text-[#9400D3]" size={28} />,
    title: "AI generates your content",
    description:
      "Our AI crafts role-specific summaries, bullet points, and keyword-rich phrasing tailored to your target job.",
  },
  {
    number: "03",
    icon: <Download className="text-[#9400D3]" size={28} />,
    title: "Download your resume",
    description:
      "Pick a template, tweak colours, and export a pixel-perfect PDF instantly. Ready to send to recruiters.",
  },
];

const HowItWorks = () => {
  const [headerRef, headerVisible] = useInView(0.15);
  const [stepsRef, stepsVisible] = useInView(0.1);

  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 bg-gradient-to-b from-white via-[#D3D3FF]/10 to-white py-16 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10">
        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-14 flex flex-col items-center text-center fade-up ${headerVisible ? "visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#9400D3]/20 bg-[#D3D3FF]/30 px-4 py-1.5 text-xs font-medium text-[#9400D3]">
            <Sparkles size={12} />
            Simple three-step process
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            From blank page to hired, in minutes
          </h2>
          <p className="mt-3 max-w-lg text-base text-slate-500">
            No design experience needed. Just answer a few questions and let the AI do the heavy lifting.
          </p>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="relative grid gap-8 sm:grid-cols-3"
        >
          {/* Connector line visible on sm+ */}
          <div
            className="pointer-events-none absolute top-10 left-[calc(16.67%)] right-[calc(16.67%)] hidden h-px bg-gradient-to-r from-[#9400D3]/20 via-[#9400D3]/40 to-[#9400D3]/20 sm:block"
            aria-hidden="true"
          />

          {steps.map(({ number, icon, title, description }, i) => (
            <div
              key={number}
              className={`relative flex flex-col items-center text-center fade-up delay-${i + 1} ${stepsVisible ? "visible" : ""}`}
            >
              {/* Step circle */}
              <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#9400D3]/15 bg-white shadow-lg shadow-[#9400D3]/10">
                {/* Number badge */}
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#9400D3] text-[10px] font-bold text-white shadow">
                  {number}
                </span>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D3D3FF]/40">
                  {icon}
                </div>
              </div>

              <h3 className="text-base font-semibold text-slate-800">{title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA nudge */}
        <div className={`mt-12 flex justify-center fade-up delay-4 ${stepsVisible ? "visible" : ""}`}>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-full bg-[#9400D3] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#9400D3]/25 transition hover:bg-[#7a00b5] active:scale-95"
          >
            Build my resume now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
