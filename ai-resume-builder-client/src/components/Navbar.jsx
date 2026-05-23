import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../app/features/authSlice.js";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = () => {
    navigate("/");
    dispatch(logout());
  };

  const colors = [
    "#9400D3",
    "#0860c4"
  ]
  return (
    <div className="shadow-sm border-b border-[#9400D3]/10 bg-white/95 backdrop-blur-sm">
      <nav className="flex items-center justify-between max-w-7xl mx-auto w-full px-4 py-4 text-slate-900 transition-all">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#9400D3] flex items-center justify-center text-white font-semibold">
            CV
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-slate-900">CVPILOT</span>
            <span className="text-xs text-slate-500">AI resume builder</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <Link to="#features" className="hover:text-[#9400D3] transition-colors">
            Features
          </Link>
          <Link to="#testimonials" className="hover:text-[#9400D3] transition-colors">
            Testimonials
          </Link>
          <Link to="#contact" className="hover:text-[#9400D3] transition-colors">
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <p className="text-sm text-slate-600">Hi, {user?.name ?? "Guest"}</p>
          <button
            onClick={logoutUser}
            className="rounded-full border border-[#9400D3]/30 bg-[#9400D3]/10 px-6 py-2 text-sm font-medium text-[#4c0fa3] hover:bg-[#9400D3]/15 active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 hover:text-[#9400D3] transition-colors"
          >
            Home
          </Link>
          <button
            onClick={logoutUser}
            className="rounded-full border border-[#9400D3]/30 bg-[#9400D3]/10 px-4 py-2 text-sm font-medium text-[#4c0fa3] hover:bg-[#9400D3]/15 active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
