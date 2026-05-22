import React from "react";

const CallToAction = () => {
  return (
    <section id="cta" className="mx-auto mt-12 mb-20 max-w-6xl px-6 sm:px-8 lg:px-10">
      <div className="rounded-[2rem] bg-gradient-to-r from-[#9400D3] via-[#7b00c5] to-[#5f00b0] px-6 py-10 shadow-2xl shadow-[#9400D3]/30 ring-1 ring-[#D3D3FF]/20 sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
        <div className="max-w-2xl text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D3D3FF] opacity-90">Ready to get hired?</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Build your resume faster with AI-crafted designs and instant exports.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#F3E9FF]">
            Start from a polished resume template, personalize your story, and download a resume that stands out in every applicant pool.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:mt-0 lg:items-start">
          <a href="/app" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#9400D3] transition hover:bg-[#D3D3FF]">
            Start building
          </a>
          <a href="#features" className="inline-flex items-center justify-center rounded-full border border-[#D3D3FF]/30 bg-[#D3D3FF]/10 px-7 py-3 text-sm font-semibold text-[#F3E9FF] transition hover:border-white hover:bg-[#D3D3FF]/20 hover:text-[#14002d]">
            Explore features
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
