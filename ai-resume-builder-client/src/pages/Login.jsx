import { Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import api from '../configs/api.js'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice.js'
import { toast } from 'react-hot-toast'

const Login = () => {

  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state"); 
  const [state, setState] = React.useState(urlState || "login");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/api/users/${state}`, formData)
      if (data.token) {
        localStorage.setItem("token", data.token);
        dispatch(login(data));
        toast.success(data.message)
      }
    } catch (error) {
      // console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9400D3]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#9400D3]/5 rounded-full blur-3xl"></div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white border border-purple-100 rounded-3xl px-6 sm:px-8 py-8 sm:py-10 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        {/* Logo and Branding */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-[#9400D3] flex items-center justify-center text-white font-bold text-lg shadow-md">
            CV
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">CVPILOT</h2>
            <p className="text-xs text-slate-500 mt-1">AI-Powered Resume Builder</p>
          </div>
        </div>

        {/* Form Title */}
        <h1 className="text-[#9400D3] text-2xl sm:text-3xl font-bold text-center mb-2">
          {state === "login" ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="text-gray-500 text-sm text-center mb-6">
          {state === "login" 
            ? "Sign in to continue building your perfect resume" 
            : "Join thousands using CVPILOT to create stunning resumes"}
        </p>

        {/* Name Field (Sign up only) */}
        {state !== "login" && (
          <div className="flex items-center w-full mb-4 bg-gray-50 border border-gray-200 h-12 rounded-xl overflow-hidden pl-4 gap-3 focus-within:border-[#9400D3] focus-within:bg-white transition-all">
           <User2Icon size={18} color="#9400D3" className="flex-shrink-0" />
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 border-none outline-none text-sm"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Email Field */}
        <div className="flex items-center w-full mb-4 bg-gray-50 border border-gray-200 h-12 rounded-xl overflow-hidden pl-4 gap-3 focus-within:border-[#9400D3] focus-within:bg-white transition-all">
         <Mail size={18} color="#9400D3" className="flex-shrink-0"/>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full bg-transparent text-gray-700 placeholder-gray-400 border-none outline-none text-sm"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="flex items-center w-full mb-6 bg-gray-50 border border-gray-200 h-12 rounded-xl overflow-hidden pl-4 gap-3 focus-within:border-[#9400D3] focus-within:bg-white transition-all">
          <Lock size={18} color="#9400D3" className="flex-shrink-0"/>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-transparent text-gray-700 placeholder-gray-400 border-none outline-none text-sm"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Forgot Password (Login only) */}
        <div className="mb-6 text-right">
          {state === "login" && (
            <button type="button" className="text-sm text-[#9400D3] hover:text-purple-700 font-medium transition-colors">
              Forgot password?
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-12 rounded-xl text-white bg-[#9400D3] hover:bg-purple-800 font-semibold shadow-md hover:shadow-lg transition-all duration-200 mb-4"
        >
          {state === "login" ? "Sign In" : "Create Account"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Toggle Form */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={() =>
              setState((prev) => (prev === "login" ? "register" : "login"))
            }
            className="text-[#9400D3] hover:text-purple-800 font-semibold text-sm mt-1 transition-colors"
          >
            {state === "login"
              ? "Sign up here"
              : "Sign in here"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
