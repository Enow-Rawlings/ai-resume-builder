import { Zap, SlidersHorizontal, LayoutTemplate } from "lucide-react";
import React from "react";
import featureImage from "../../assets/features-resume.jpg";
import useInView from "../../hooks/useInView";

const features = [
  {
    icon: <Zap className="text-white" size={20} />,
    title: "AI resume creation",
    description:
      "Start with a polished resume draft tailored to your experience, skills, and target role, generated in seconds.",
  },
  {
    icon: <SlidersHorizontal className="text-white" size={20} />,
    title: "Smart optimization",
    description:
      "Improve your resume with AI-guided wording, keyword suggestions, and structure built to pass recruiter screening.",
  },
  {
    icon: <LayoutTemplate className="text-white" size={20} />,
    title: "Polished templates",
    description:
      "Choose from curated templates that match modern hiring standards and keep your profile clean and easy to scan.",
  },
];

const Features = () => {
  const [headerRef, headerVisible] = useInView(0.15);
  const [gridRef, gridVisible] = useInView(0.1);

  return (
    <section
      id="features"
      className="scroll-mt-16 mx-auto max-w-6xl px-4 py-16 sm:px-6 md:px-10 lg:py-24"
    >
      {/* Section header */}
      <div
        ref={headerRef}
        className={`mb-12 flex flex-col items-center text-center fade-up ${headerVisible ? "visible" : ""}`}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-[#9400D3]/20 bg-[#D3D3FF]/30 px-4 py-1.5 text-xs font-medium text-[#9400D3]">
          <Zap size={12} />
          AI-Powered Resumes
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Create standout resumes in minutes
        </h2>
        <p className="mt-3 max-w-xl text-base text-slate-500">
          Generate tailored resumes with smart content suggestions, role-focused formatting, and
          professional templates built for every career stage.
        </p>
      </div>

      {/* Two-column grid */}
      <div ref={gridRef} className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className={`relative mx-auto w-full max-w-lg overflow-hidden rounded-[2rem] bg-[#9400D3] p-3 shadow-2xl shadow-[#9400D3]/20 sm:p-4 fade-up ${gridVisible ? "visible" : ""}`}>
          <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10 pointer-events-none" />
          <img
            className="w-full h-auto rounded-[1.5rem] object-cover"
            src={featureImage}
            alt="Resume editor preview"
          />
        </div>

        {/* Feature list */}
        <div className="flex flex-col gap-8">
          {features.map(({ icon, title, description }, i) => (
            <div
              key={title}
              className={`flex items-start gap-5 fade-up delay-${i + 1} ${gridVisible ? "visible" : ""}`}
            >
              <div className="shrink-0 rounded-2xl bg-[#D3D3FF]/60 p-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#9400D3]">
                  {icon}
                </div>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-semibold text-slate-800">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
