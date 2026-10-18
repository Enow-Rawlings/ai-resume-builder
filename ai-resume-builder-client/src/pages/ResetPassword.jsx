import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../configs/api.js'
import { toast } from 'react-hot-toast'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      toast.error('Please enter and confirm your new password.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      const { data } = await api.post('/api/users/reset-password', {
        token,
        password,
      })

      toast.success(data.message)
      navigate('/login')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-md bg-white border border-purple-100 rounded-3xl px-6 sm:px-8 py-8 sm:py-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-[#9400D3] flex items-center justify-center text-white font-bold text-lg shadow-md">
            CV
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
            <p className="text-xs text-slate-500 mt-1">Enter a new password to continue.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center w-full bg-gray-50 border border-gray-200 h-12 rounded-xl overflow-hidden pl-4 gap-3 focus-within:border-[#9400D3] focus-within:bg-white transition-all">
            <input
              type="password"
              name="password"
              placeholder="New password"
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 border-none outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center w-full bg-gray-50 border border-gray-200 h-12 rounded-xl overflow-hidden pl-4 gap-3 focus-within:border-[#9400D3] focus-within:bg-white transition-all">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              className="w-full bg-transparent text-gray-700 placeholder-gray-400 border-none outline-none text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl text-white bg-[#9400D3] hover:bg-purple-800 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
