import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setStatus("Please enter a valid email address.");
      return;
    }
    setStatus("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <footer className="bg-[#9400D3] mt-4">
      {/* Main footer body */}
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-sm font-bold text-white">
                CV
              </div>
              <span className="text-lg font-semibold text-white tracking-wide">CVPILOT</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              CVPILOT helps professionals build polished, interview-ready resumes faster with
              AI guidance, smart formatting, and role-specific suggestions.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Explore
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {["Resume Builder", "Templates", "Editor", "Guides"].map((item) => (
                <li key={item}>
                  <Link
                    to="/app"
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                { label: "Contact", to: "/contact" },
                { label: "About", to: "/" },
                { label: "Blog", to: "/" },
                { label: "Support", to: "/" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Stay updated
            </h3>
            <p className="mt-3 text-sm text-white/60">
              Get tips on resume writing and job hunting, straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <div className="flex overflow-hidden rounded-full border border-white/20 bg-white/10 focus-within:border-white/40 transition">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none border-none focus:ring-0"
                  required
                />
                <button
                  type="submit"
                  className="shrink-0 bg-white px-4 py-2 text-xs font-semibold text-[#9400D3] transition hover:bg-[#D3D3FF] active:scale-95"
                >
                  Subscribe
                </button>
              </div>
              {status && (
                <p className="mt-2 text-xs text-white/70">{status}</p>
              )}
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-white/15" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} CVPILOT. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-xs text-white/50 transition-colors hover:text-white">
              Terms
            </a>
            <span className="h-3.5 w-px bg-white/20" />
            <a href="#" className="text-xs text-white/50 transition-colors hover:text-white">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
