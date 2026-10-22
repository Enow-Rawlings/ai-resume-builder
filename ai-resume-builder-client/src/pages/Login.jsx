import { Eye, EyeOff, Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import api from '../configs/api.js'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice.js'
import { toast } from 'react-hot-toast'
import { useGoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'

// Google "G" SVG icon — no external image needed
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const Login = () => {
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [state, setState] = React.useState(urlState || "login");
  const [showPassword, setShowPassword] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ── Email/password submit ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state === "forgot") {
        const { data } = await api.post(`/api/users/forgot-password`, {
          email: formData.email,
        })
        toast.success(data.message)
        return
      }

      const { data } = await api.post(`/api/users/${state}`, formData)
      if (data.token) {
        localStorage.setItem("token", data.token);
        dispatch(login(data));
        toast.success(data.message)
        navigate('/app')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Google OAuth ───────────────────────────────────────────────────
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const googleEnabled = !!googleClientId

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      try {
        const { data } = await api.post('/api/users/google-auth', {
          access_token: tokenResponse.access_token,
        })
        if (data.token) {
          localStorage.setItem('token', data.token)
          dispatch(login(data))
          toast.success(data.message || 'Signed in with Google')
          navigate('/app')
        }
      } catch (error) {
        const status = error?.response?.status
        const msg = error?.response?.data?.message
        if (status === 404) {
          toast.error('Google sign-in is not yet enabled. Please sign in with email.')
        } else {
          toast.error(msg || 'Google sign-in failed')
        }
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => {
      toast.error('Google sign-in was cancelled or failed')
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9400D3]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#9400D3]/5 rounded-full blur-3xl" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white border border-purple-100 rounded-3xl px-6 sm:px-8 py-8 sm:py-10 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-[#9400D3] flex items-center justify-center text-white font-bold text-lg shadow-md">
            CV
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">CVPILOT</h2>
            <p className="text-xs text-slate-500 mt-1">AI-Powered Resume Builder</p>
          </div>
        </div>

        {/* Form title */}
        <h1 className="text-[#9400D3] text-2xl sm:text-3xl font-bold text-center mb-2">
          {state === "login" ? "Welcome Back"
            : state === "register" ? "Create Account"
            : "Reset Your Password"}
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          {state === "login" ? "Sign in to continue building your perfect resume"
            : state === "register" ? "Join thousands using CVPILOT to create stunning resumes"
            : "Enter your email to receive password reset instructions."}
        </p>

        {/* ── Google Sign-In (login + register only) ─────────────────── */}
        {state !== "forgot" && (
          <>
            <button
              type="button"
              onClick={() => {
                if (!googleEnabled) {
                  toast.error('Google sign-in is not configured yet.')
                  return
                }
                handleGoogleLogin()
              }}
              disabled={googleLoading}
              className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 mb-4 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              ) : (
                <GoogleIcon />
              )}
              {googleLoading ? "Signing in..." : `Continue with Google`}            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          </>
        )}

        {/* Name field — register only */}
        {state === "register" && (
          <div className="flex items-center w-full mb-4 bg-gray-50 border border-gray-200 h-12 rounded-xl overflow-hidden pl-4 gap-3 focus-within:border-[#9400D3] focus-within:bg-white transition-all">
            <User2Icon size={18} color="#9400D3" className="flex-shrink-0" />
            <input
              type="text"
              name="name"
              placeholder="Full name"
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 border-none outline-none text-sm"
              value={formData.name}
              onChange={handleChange}
              required={state === "register"}
            />
          </div>
        )}

        {/* Email */}
        <div className="flex items-center w-full mb-4 bg-gray-50 border border-gray-200 h-12 rounded-xl overflow-hidden pl-4 gap-3 focus-within:border-[#9400D3] focus-within:bg-white transition-all">
          <Mail size={18} color="#9400D3" className="flex-shrink-0" />
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

        {/* Password with visibility toggle */}
        {state !== "forgot" && (
          <div className="flex items-center w-full mb-2 bg-gray-50 border border-gray-200 h-12 rounded-xl overflow-hidden pl-4 pr-3 gap-3 focus-within:border-[#9400D3] focus-within:bg-white transition-all">
            <Lock size={18} color="#9400D3" className="flex-shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 border-none outline-none text-sm"
              value={formData.password}
              onChange={handleChange}
              required={state !== "forgot"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="flex-shrink-0 text-gray-400 hover:text-[#9400D3] transition-colors p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        )}

        {/* Forgot password link — login only */}
        <div className="mb-5 text-right">
          {state === "login" && (
            <button
              type="button"
              onClick={() => setState('forgot')}
              className="text-xs text-[#9400D3] hover:text-purple-700 font-medium transition-colors"
            >
              Forgot password?
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-12 rounded-xl text-white bg-[#9400D3] hover:bg-purple-800 font-semibold shadow-md hover:shadow-lg transition-all duration-200 mb-5"
        >
          {state === "login" ? "Sign In"
            : state === "register" ? "Create Account"
            : "Send reset link"}
        </button>

        {/* Toggle login / register / forgot */}
        <div className="text-center">
          {state === "forgot" ? (
            <>
              <p className="text-gray-600 text-sm">Remembered your password?</p>
              <button
                type="button"
                onClick={() => setState('login')}
                className="text-[#9400D3] hover:text-purple-800 font-semibold text-sm mt-1 transition-colors"
              >
                Sign in here
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-sm">
                {state === "login" ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                type="button"
                onClick={() => setState((prev) => (prev === "login" ? "register" : "login"))}
                className="text-[#9400D3] hover:text-purple-800 font-semibold text-sm mt-1 transition-colors"
              >
                {state === "login" ? "Sign up here" : "Sign in here"}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
