import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../configs/api.js'
import { ArrowLeftIcon, DownloadIcon, Loader2 } from 'lucide-react'
import ResumePreview from '../components/ResumePreview'

const Preview = () => {
  const { resumeId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)

  const loadResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/public/' + resumeId)
      setResumeData(data.resume)
    } catch (error) {
      console.log(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadResume() }, [])

  const downloadResume = () => {
    const filename = resumeData?.personal_info?.full_name || resumeData?.title || 'resume'
    import('../utils/downloadPdf.js').then(m => m.downloadPdf(filename))
  }

  // ── Loading ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#9400D3]" />
      </div>
    )
  }

  // ── Not found ────────────────────────────────────────────────────────
  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 px-6 text-center">
        <p className="text-5xl sm:text-6xl font-semibold text-slate-300 mb-4">404</p>
        <p className="text-lg font-medium text-slate-500 mb-2">Resume not found</p>
        <p className="text-sm text-slate-400 mb-8">
          This resume may be private or the link is incorrect.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9400D3] text-white text-sm font-semibold hover:bg-[#7a00b5] transition-colors"
        >
          <ArrowLeftIcon className="size-4" /> Go to homepage
        </a>
      </div>
    )
  }

  // ── Resume found ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeftIcon className="size-4" /> Home
        </a>

        {resumeData.personal_info?.full_name && (
          <p className="text-sm font-medium text-slate-700 truncate">
            {resumeData.personal_info.full_name}
          </p>
        )}

        <button
          onClick={downloadResume}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#9400D3] text-white text-xs font-semibold hover:bg-[#7a00b5] transition-colors shrink-0"
        >
          <DownloadIcon className="size-3.5" /> Download
        </button>
      </div>

      {/* Resume container — scales to fit on mobile */}
      <div className="px-4 py-6 sm:py-10">
        <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl shadow-xl bg-white">
          <ResumePreview
            data={resumeData}
            template={resumeData.template}
            accentColor={resumeData.accent_color}
          />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Created with{' '}
          <a href="/" className="text-[#9400D3] hover:underline font-medium">CVPILOT</a>
        </p>
      </div>
    </div>
  )
}

export default Preview
