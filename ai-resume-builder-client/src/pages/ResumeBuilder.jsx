import {
  ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight,
  DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon,
  GraduationCap, LayoutPanelLeft, Save, Share2Icon, Sparkles, User
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PersonalInfoForm from '../components/PersonalInfoForm'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import ResumePreview from '../components/ResumePreview'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api.js'
import { toast } from 'react-hot-toast'

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const { token } = useSelector((state) => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '', title: '',
    personal_info: {},
    professional_summary: '',
    experience: [], education: [], project: [], skills: [],
    template: 'classic',
    accent_color: '#3B82F6',
    public: false,
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  // Mobile: 'form' | 'preview'
  const [mobileTab, setMobileTab] = useState('form')

  const sections = [
    { id: 'personal_info', name: 'Info',       icon: User },
    { id: 'summary',       name: 'Summary',    icon: FileText },
    { id: 'experience',    name: 'Experience', icon: Briefcase },
    { id: 'education',     name: 'Education',  icon: GraduationCap },
    { id: 'projects',      name: 'Projects',   icon: FolderIcon },
    { id: 'skills',        name: 'Skills',     icon: Sparkles },
  ]
  const activeSection = sections[activeSectionIndex]

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } })
      if (data.resume) {
        // Ensure accent_color always has the # prefix
        const resume = { ...data.resume }
        if (resume.accent_color && !resume.accent_color.startsWith('#')) {
          resume.accent_color = '#' + resume.accent_color
        }
        setResumeData(resume)
        document.title = resume.title
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => { loadExistingResume() }, [])

  const saveResume = async () => {
    let updateResumeData = structuredClone(resumeData)
    if (typeof resumeData.personal_info.image === 'object') {
      delete updateResumeData.personal_info.image
    }

    const shouldUseFormData =
      typeof resumeData.personal_info.image === 'object' || removeBackground

    let response
    if (shouldUseFormData) {
      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify(updateResumeData))
      formData.append('removeBackground', removeBackground ? 'yes' : 'no')
      if (typeof resumeData.personal_info.image === 'object') {
        formData.append('image', resumeData.personal_info.image)
      }
      response = await api.put('/api/resumes/update', formData, { headers: { Authorization: token } })
    } else {
      response = await api.put('/api/resumes/update', {
        resumeId,
        resumeData: updateResumeData,
        removeBackground: removeBackground ? 'yes' : 'no',
      }, { headers: { Authorization: token } })
    }

    setResumeData(response.data.resume)
    return response.data
  }

  const handleSave = () => {
    toast.promise(saveResume(), {
      loading: 'Saving…',
      success: (d) => d?.message || 'Resume saved!',
      error: (e) => e?.response?.data?.message || 'Failed to save.',
    })
  }

  const changeResumeVisibility = async () => {
    try {
      const { data } = await api.put('/api/resumes/update', {
        resumeId,
        resumeData: { public: !resumeData.public },
      }, { headers: { Authorization: token } })
      setResumeData(prev => ({ ...prev, public: !prev.public }))
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update visibility.')
    }
  }

  const handleShare = () => {
    const resumeUrl = window.location.href.split('/app')[0] + '/view/' + resumeId
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: 'My Resume' })
    } else {
      navigator.clipboard?.writeText(resumeUrl)
      toast.success('Link copied to clipboard!')
    }
  }

  const downloadResume = () => window.print()

  const progress = (activeSectionIndex / (sections.length - 1)) * 100

  return (
    // pb-20 reserves space for the fixed bottom action bar on mobile
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">

      {/* ── Top bar ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link
            to="/app"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors shrink-0"
          >
            <ArrowLeftIcon className="size-4" /> Back
          </Link>

          {/* Title */}
          <p className="text-sm font-medium text-slate-700 truncate hidden sm:block">
            {resumeData.title || 'Untitled Resume'}
          </p>

          {/* Desktop action buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {resumeData.public && (
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <Share2Icon className="size-3.5" /> Share
              </button>
            )}
            <button
              onClick={changeResumeVisibility}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
            >
              {resumeData.public ? <EyeIcon className="size-3.5" /> : <EyeOffIcon className="size-3.5" />}
              {resumeData.public ? 'Public' : 'Private'}
            </button>
            <button
              onClick={downloadResume}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              <DownloadIcon className="size-3.5" /> Download
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#9400D3] text-white hover:bg-[#7a00b5] transition-colors"
            >
              <Save className="size-3.5" /> Save
            </button>
          </div>

          {/* Mobile: form/preview toggle */}
          <div className="lg:hidden flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setMobileTab('form')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mobileTab === 'form' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
            >
              Form
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-all ${mobileTab === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
            >
              <LayoutPanelLeft className="size-3" /> Preview
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-5 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">

        {/* ── FORM PANEL ────────────────────────────────────────────── */}
        <div className={`${mobileTab === 'form' ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">

            {/* Progress bar */}
            <div className="relative h-1 rounded-t-2xl bg-slate-100 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Toolbar */}
            <div className="px-4 pt-3 pb-3 border-b border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onChange={(t) => setResumeData(prev => ({ ...prev, template: t }))}
                />
                <ColorPicker
                  selectedColor={resumeData.accent_color}
                  onChange={(c) => setResumeData(prev => ({ ...prev, accent_color: c }))}
                />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveSectionIndex(i => Math.max(i - 1, 0))}
                  disabled={activeSectionIndex === 0}
                  className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="size-3.5" /> Prev
                </button>
                <button
                  onClick={() => setActiveSectionIndex(i => Math.min(i + 1, sections.length - 1))}
                  disabled={activeSectionIndex === sections.length - 1}
                  className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Section tab pills */}
            <div className="px-4 pt-3 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none">
              {sections.map((s, i) => {
                const Icon = s.icon
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSectionIndex(i)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                      activeSectionIndex === i
                        ? 'bg-[#9400D3] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="size-3" /> {s.name}
                  </button>
                )
              })}
            </div>

            {/* Form content */}
            <div className="px-5 py-5 space-y-5">
              {activeSection.id === 'personal_info' && (
                <PersonalInfoForm
                  data={resumeData.personal_info}
                  onChange={(d) => setResumeData(prev => ({ ...prev, personal_info: d }))}
                  removeBackground={removeBackground}
                  setRemoveBackground={setRemoveBackground}
                />
              )}
              {activeSection.id === 'summary' && (
                <ProfessionalSummaryForm
                  data={resumeData.professional_summary}
                  onChange={(d) => setResumeData(prev => ({ ...prev, professional_summary: d }))}
                  setResumeData={setResumeData}
                />
              )}
              {activeSection.id === 'experience' && (
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(d) => setResumeData(prev => ({ ...prev, experience: d }))}
                />
              )}
              {activeSection.id === 'education' && (
                <EducationForm
                  data={resumeData.education}
                  onChange={(d) => setResumeData(prev => ({ ...prev, education: d }))}
                />
              )}
              {activeSection.id === 'projects' && (
                <ProjectForm
                  data={resumeData.project}
                  onChange={(d) => setResumeData(prev => ({ ...prev, project: d }))}
                />
              )}
              {activeSection.id === 'skills' && (
                <SkillsForm
                  data={resumeData.skills}
                  onChange={(d) => setResumeData(prev => ({ ...prev, skills: d }))}
                />
              )}
            </div>

            {/* Save button inside card — desktop only (mobile uses bottom bar) */}
            <div className="px-5 pb-5 hidden lg:block">
              <button
                onClick={handleSave}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#9400D3] text-white text-sm font-semibold py-2.5 hover:bg-[#7a00b5] transition-colors"
              >
                <Save className="size-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* ── PREVIEW PANEL ─────────────────────────────────────────── */}
        <div className={`${mobileTab === 'preview' ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Preview header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">Live Preview</p>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${resumeData.public ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                  {resumeData.public ? 'Public' : 'Private'}
                </span>
              </div>
            </div>

            {/* Scaled resume — fits viewport width on mobile */}
            <div className="w-full overflow-hidden bg-slate-100">
              <ResumePreview
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
                classes="scale-resume"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile fixed bottom action bar ───────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-2 safe-bottom">
        <button
          onClick={handleSave}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#9400D3] text-white text-sm font-semibold py-2.5 hover:bg-[#7a00b5] transition-colors"
        >
          <Save className="size-4" /> Save
        </button>
        <button
          onClick={changeResumeVisibility}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
        </button>
        <button
          onClick={downloadResume}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <DownloadIcon className="size-4" />
        </button>
        {resumeData.public && (
          <button
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Share2Icon className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ResumeBuilder
