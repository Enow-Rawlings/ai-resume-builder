import { Zap } from "lucide-react";
import React from "react";
import Title from "./Title";
import featureImage from "../../assets/featues-resume.jpg";

const Features = () => {
  return (
    <div
      id="features"
      className="flex flex-col items-center mt-0 mb-16 scroll-mt-12 md:mt-0 lg:mb-24"
    >
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

      <div className="flex items-center gap-2 text-sm text-[#9400D3] bg-[#D3D3FF]/30 border border-[#9400D3]/20 rounded-full px-6 py-1.5">
        <Zap width={14} />
        <span>AI-Powered Resumes</span>
      </div>
      <Title
        title="Create standout resumes in minutes"
        description="Generate tailored resumes with smart content suggestions, role-focused formatting, and professional templates built for every career stage."
      />
      <div className="grid w-full max-w-6xl gap-8 md:grid-cols-2 items-center mt-8">
        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#9400D3]/100 p-4 shadow-2xl shadow-[#9400D3]/10 sm:p-6">
          <img
            className="w-full h-auto rounded-[2rem] object-cover"
            src={featureImage}
            alt="Resume editor preview"
          />
        </div>

        <div className="space-y-8 px-2 md:px-8">
          <div className="flex items-start gap-5 max-w-md">
            <div className="p-5 bg-[#D3D3FF] rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#9400D3] flex items-center justify-center">
                <Zap className="text-white" size={20} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-slate-800">
                AI resume creation
              </h3>
              <p className="text-sm text-slate-600">
                Start with a polished resume draft tailored to your experience, skills, and role in seconds.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-5 max-w-md">
            <div className="p-5 bg-[#D3D3FF] rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#9400D3] flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-slate-800">
                Smart optimization
              </h3>
              <p className="text-sm text-slate-600">
                Improve your resume with AI-guided wording, keyword suggestions, and structure designed to impress recruiters.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-5 max-w-md">
            <div className="p-5 bg-[#D3D3FF] rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[#9400D3] flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6h16M4 12h16M4 18h10"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-slate-800">
                Polished templates
              </h3>
              <p className="text-sm text-slate-600">
                Choose from curated resume templates that match modern hiring standards and keep your profile easy to scan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
