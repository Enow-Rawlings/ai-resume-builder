import React from "react";
import { FileText, Palette, Download, Zap } from "lucide-react";
import useInView from "../../hooks/useInView";

const callouts = [
  {
    icon: <FileText className="text-[#9400D3]" size={22} />,
    value: "AI-generated",
    label: "Resume content",
  },
  {
    icon: <Palette className="text-[#9400D3]" size={22} />,
    value: "4 templates",
    label: "Professional designs",
  },
  {
    icon: <Download className="text-[#9400D3]" size={22} />,
    value: "PDF export",
    label: "Instant download",
  },
  {
    icon: <Zap className="text-[#9400D3]" size={22} />,
    value: "< 5 minutes",
    label: "From start to finish",
  },
];

const StatsStrip = () => {
  const [ref, visible] = useInView(0.1);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:px-10">
      <div
        ref={ref}
        className="rounded-[2rem] border border-[#9400D3]/10 bg-gradient-to-br from-[#9400D3]/6 via-[#D3D3FF]/25 to-[#9400D3]/4 px-6 py-10 sm:px-10 sm:py-12"
      >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
          {callouts.map(({ icon, value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center gap-3 text-center fade-up delay-${i + 1} ${visible ? "visible" : ""}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3D3FF]/60">
                {icon}
              </div>
              <div>
                <p className="text-xl font-semibold text-[#9400D3] sm:text-2xl">{value}</p>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
