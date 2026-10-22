import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { Loader2 } from 'lucide-react'

const Layout = () => {
  const { user, loading } = useSelector((state) => state.auth)

  // Still resolving the session from localStorage — show a spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#9400D3]" />
      </div>
    )
  }

  // Not authenticated — redirect to /login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Authenticated — render the app shell
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Layout
