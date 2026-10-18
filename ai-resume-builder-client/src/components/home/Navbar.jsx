import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HomeNavbar = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !loading && !!user;

  return (
    <>
      <nav className="z-50 flex items-center justify-between w-full py-4 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 bg-[#9400D3] shadow-lg shadow-[#9400D3]/20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-sm font-bold text-[#9400D3]">
            CV
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-white tracking-wide">CVPILOT</span>
            <span className="text-[10px] text-[#D3D3FF]">AI resume builder</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7 text-sm text-white">
          <a href="#features" className="hover:text-[#D3D3FF] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-[#D3D3FF] transition-colors">
            How it works
          </a>
          <Link to="/contact" className="hover:text-[#D3D3FF] transition-colors">
            Contact
          </Link>
        </div>

        {/* Desktop auth area */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-[#D3D3FF]">Hi, {user.name}</span>
              <Link
                to="/app"
                className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-white hover:bg-white/20 transition-all"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/app"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#9400D3] hover:bg-[#D3D3FF] transition-all"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="md:hidden rounded-full border border-white/30 bg-white/10 p-2.5 text-white transition hover:bg-white/20"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-[#9400D3]/97 backdrop-blur-sm flex flex-col items-center justify-center gap-7 md:hidden transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo in overlay */}
        <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center text-sm font-bold text-[#9400D3]">
            CV
          </div>
          <span className="text-xl font-semibold text-white tracking-wide">CVPILOT</span>
        </Link>

        <a href="#features" onClick={() => setMenuOpen(false)} className="text-lg text-white hover:text-[#D3D3FF] transition-colors">
          Features
        </a>
        <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-lg text-white hover:text-[#D3D3FF] transition-colors">
          How it works
        </a>
        <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-lg text-white hover:text-[#D3D3FF] transition-colors">
          Contact
        </Link>

        {/* Auth buttons */}
        {isLoggedIn ? (
          <Link
            to="/app"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#9400D3] transition hover:bg-[#D3D3FF]"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="mt-2 flex flex-col items-center gap-3 w-full px-10">
            <Link
              to="/app"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#9400D3] transition hover:bg-[#D3D3FF]"
            >
              Get started free
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center rounded-full border border-white/30 bg-white/10 px-8 py-3 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Sign in
            </Link>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          className="mt-4 flex items-center justify-center w-10 h-10 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 transition"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M2 2l14 14M16 2L2 16" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default HomeNavbar;
