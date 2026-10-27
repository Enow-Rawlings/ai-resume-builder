import {
  ArrowLeftIcon, Award, Briefcase, ChevronLeft, ChevronRight,
  DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon,
  Globe, GraduationCap, LayoutPanelLeft, ListOrdered, Save,
  Share2Icon, Sparkles, User, Users,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'

import api from '../configs/api.js'
import PersonalInfoForm        from '../components/PersonalInfoForm'
import TemplateSelector        from '../components/TemplateSelector'
import ColorPicker             from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm          from '../components/ExperienceForm'
import EducationForm           from '../components/EducationForm'
import ProjectForm             from '../components/ProjectForm'
import SkillsForm              from '../components/SkillsForm'
import LanguagesForm           from '../components/LanguagesForm'
import ReferencesForm          from '../components/ReferencesForm'
import ProfessionalBodiesForm  from '../components/ProfessionalBodiesForm'
import SectionReorder          from '../components/SectionReorder'
import ResumePreview           from '../components/ResumePreview'

// ── Default section order ──────────────────────────────────────────────────
const DEFAULT_SECTION_ORDER = [
  'professional_summary',
  'experience',
  'education',
  'project',
  'skills',
  'languages',
  'professional_bodies',
  'references',
]

// ── All sections definition ────────────────────────────────────────────────
// id          = section pill id (used to switch forms)
// key         = data key in resumeData (used in section_order)
// name        = display label
// icon        = lucide icon component
const ALL_SECTIONS = [
  { id: 'personal_info',      key: null,                   name: 'Personal Info',   icon: User },
  { id: 'summary',            key: 'professional_summary', name: 'Summary',         icon: FileText },
  { id: 'experience',         key: 'experience',           name: 'Experience',      icon: Briefcase },
  { id: 'education',          key: 'education',            name: 'Education',       icon: GraduationCap },
  { id: 'projects',           key: 'project',              name: 'Projects',        icon: FolderIcon },
  { id: 'skills',             key: 'skills',               name: 'Skills',          icon: Sparkles },
  { id: 'languages',          key: 'languages',            name: 'Languages',       icon: Globe },
  { id: 'professional_bodies',key: 'professional_bodies',  name: 'Memberships',     icon: Award },
  { id: 'references',         key: 'references',           name: 'References',      icon: Users },
]

// Sections that appear in the reorder panel (personal_info is always first — not reorderable)
const REORDERABLE_SECTIONS = ALL_SECTIONS
  .filter(s => s.key !== null)
  .map(s => ({ key: s.key, label: s.name, icon: s.icon }))

// ── Initial data state ─────────────────────────────────────────────────────
const INITIAL_DATA = {
  _id: '', title: '',
  personal_info: {},
  professional_summary: '',
  experience: [], education: [], project: [], skills: [],
  skills_categorized: { core: [], technical: [], soft: [] },
  languages: [], references: [], professional_bodies: [],
  section_order: DEFAULT_SECTION_ORDER,
  template: 'classic',
  accent_color: '#3B82F6',
  public: false,
}

// ──────────────────────────────────────────────────────────────────────────
const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const { token }    = useSelector(s => s.auth)

  const [resumeData,        setResumeData]        = useState(INITIAL_DATA)
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground,  setRemoveBackground]  = useState(false)
  const [mobileTab,         setMobileTab]         = useState('form')   // 'form' | 'preview'
  const [showReorder,       setShowReorder]       = useState(false)
  const reorderBtnRef = useRef(null)

  // ── Load resume ──────────────────────────────────────────────────────────
  const loadExistingResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } })
      if (data.resume) {
        const resume = { ...data.resume }
        if (resume.accent_color && !resume.accent_color.startsWith('#')) {
          resume.accent_color = '#' + resume.accent_color
        }
        // Back-fill new array fields for older resumes
        if (!Array.isArray(resume.languages))          resume.languages          = []
        if (!Array.isArray(resume.references))         resume.references         = []
        if (!Array.isArray(resume.professional_bodies))resume.professional_bodies = []
        if (!Array.isArray(resume.section_order) || resume.section_order.length === 0) {
          resume.section_order = DEFAULT_SECTION_ORDER
        }
        // Back-fill skills_categorized for older resumes that only have flat skills.
        // Existing flat skills migrate into "core" so nothing is lost.
        const hasCategorized = resume.skills_categorized &&
          (resume.skills_categorized.core?.length > 0 ||
           resume.skills_categorized.technical?.length > 0 ||
           resume.skills_categorized.soft?.length > 0)
        if (!hasCategorized) {
          resume.skills_categorized = {
            core: Array.isArray(resume.skills) ? [...resume.skills] : [],
            technical: [],
            soft: [],
          }
        } else {
          // Ensure all three keys exist even if the DB doc is missing some
          resume.skills_categorized = {
            core:      Array.isArray(resume.skills_categorized.core)      ? resume.skills_categorized.core      : [],
            technical: Array.isArray(resume.skills_categorized.technical) ? resume.skills_categorized.technical : [],
            soft:      Array.isArray(resume.skills_categorized.soft)      ? resume.skills_categorized.soft      : [],
          }
        }
        setResumeData(resume)
        document.title = resume.title
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => { loadExistingResume() }, [])

  // ── Save ─────────────────────────────────────────────────────────────────
  const saveResume = async () => {
    let payload = structuredClone(resumeData)
    if (typeof resumeData.personal_info.image === 'object') {
      delete payload.personal_info.image
    }

    // Keep flat skills in sync — merge all categories so templates keep working
    const sc = payload.skills_categorized || { core: [], technical: [], soft: [] }
    payload.skills = [
      ...(sc.core      || []),
      ...(sc.technical || []),
      ...(sc.soft      || []),
    ]

    const useFormData = typeof resumeData.personal_info.image === 'object' || removeBackground

    let response
    if (useFormData) {
      const fd = new FormData()
      fd.append('resumeId', resumeId)
      fd.append('resumeData', JSON.stringify(payload))
      fd.append('removeBackground', removeBackground ? 'yes' : 'no')
      if (typeof resumeData.personal_info.image === 'object') {
        fd.append('image', resumeData.personal_info.image)
      }
      response = await api.put('/api/resumes/update', fd, { headers: { Authorization: token } })
    } else {
      response = await api.put('/api/resumes/update', {
        resumeId,
        resumeData: payload,
        removeBackground: removeBackground ? 'yes' : 'no',
      }, { headers: { Authorization: token } })
    }

    setResumeData(response.data.resume)
    return response.data
  }

  const handleSave = () => {
    toast.promise(saveResume(), {
      loading: 'Saving…',
      success: d => d?.message || 'Resume saved!',
      error:   e => e?.response?.data?.message || 'Failed to save.',
    })
  }

  // ── Visibility / share / download ────────────────────────────────────────
  const changeVisibility = async () => {
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
    const url = window.location.href.split('/app')[0] + '/view/' + resumeId
    if (navigator.share) { navigator.share({ url, text: 'My Resume' }) }
    else { navigator.clipboard?.writeText(url); toast.success('Link copied!') }
  }

  const downloadResume = () => {
    const title = resumeData.title || 'resume'
    toast.promise(
      import('../utils/downloadPdf.js').then(m => m.downloadPdf(title)),
      {
        loading: 'Generating PDF…',
        success: 'PDF downloaded!',
        error:   'Failed to generate PDF. Please try again.',
      }
    )
  }

  // ── Section order helpers ────────────────────────────────────────────────
  const sectionOrder = resumeData.section_order?.length ? resumeData.section_order : DEFAULT_SECTION_ORDER

  const updateSectionOrder = (newOrder) => {
    setResumeData(prev => ({ ...prev, section_order: newOrder }))
  }

  // ── Progress ─────────────────────────────────────────────────────────────
  const progress = (activeSectionIndex / (ALL_SECTIONS.length - 1)) * 100
  const activeSection = ALL_SECTIONS[activeSectionIndex]

  // ── Form renderer ─────────────────────────────────────────────────────────
  const renderForm = () => {
    switch (activeSection.id) {
      case 'personal_info':
        return <PersonalInfoForm data={resumeData.personal_info}
          onChange={d => setResumeData(p => ({ ...p, personal_info: d }))}
          removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
      case 'summary':
        return <ProfessionalSummaryForm data={resumeData.professional_summary}
          onChange={d => setResumeData(p => ({ ...p, professional_summary: d }))}
          setResumeData={setResumeData} />
      case 'experience':
        return <ExperienceForm data={resumeData.experience}
          onChange={d => setResumeData(p => ({ ...p, experience: d }))} />
      case 'education':
        return <EducationForm data={resumeData.education}
          onChange={d => setResumeData(p => ({ ...p, education: d }))} />
      case 'projects':
        return <ProjectForm data={resumeData.project}
          onChange={d => setResumeData(p => ({ ...p, project: d }))} />
      case 'skills':
        return <SkillsForm data={resumeData.skills_categorized}
          onChange={d => setResumeData(p => ({ ...p, skills_categorized: d }))} />
      case 'languages':
        return <LanguagesForm data={resumeData.languages}
          onChange={d => setResumeData(p => ({ ...p, languages: d }))} />
      case 'professional_bodies':
        return <ProfessionalBodiesForm data={resumeData.professional_bodies}
          onChange={d => setResumeData(p => ({ ...p, professional_bodies: d }))} />
      case 'references':
        return <ReferencesForm data={resumeData.references}
          onChange={d => setResumeData(p => ({ ...p, references: d }))} />
      default: return null
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">

      {/* ── Sticky top bar ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link to="/app" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors shrink-0">
            <ArrowLeftIcon className="size-4" /> Back
          </Link>

          <p className="text-sm font-medium text-slate-700 truncate hidden sm:block">
            {resumeData.title || 'Untitled Resume'}
          </p>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">
            {resumeData.public && (
              <button onClick={handleShare} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                <Share2Icon className="size-3.5" /> Share
              </button>
            )}
            <button onClick={changeVisibility} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
              {resumeData.public ? <EyeIcon className="size-3.5" /> : <EyeOffIcon className="size-3.5" />}
              {resumeData.public ? 'Public' : 'Private'}
            </button>
            <button onClick={downloadResume} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
              <DownloadIcon className="size-3.5" /> Download
            </button>
            <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#9400D3] text-white hover:bg-[#7a00b5] transition-colors">
              <Save className="size-3.5" /> Save
            </button>
          </div>

          {/* Mobile form/preview toggle */}
          <div className="lg:hidden flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button onClick={() => setMobileTab('form')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mobileTab === 'form' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
              Form
            </button>
            <button onClick={() => setMobileTab('preview')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-all ${mobileTab === 'preview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}>
              <LayoutPanelLeft className="size-3" /> Preview
            </button>
          </div>
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-5 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">

        {/* ── FORM PANEL ──────────────────────────────────────────── */}
        <div className={`${mobileTab === 'form' ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-visible">

            {/* Progress bar */}
            <div className="relative h-1 rounded-t-2xl bg-slate-100 overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }} />
            </div>

            {/* Toolbar */}
            <div className="px-4 pt-3 pb-3 border-b border-slate-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <TemplateSelector selectedTemplate={resumeData.template}
                  onChange={t => setResumeData(p => ({ ...p, template: t }))} />
                <ColorPicker selectedColor={resumeData.accent_color}
                  onChange={c => setResumeData(p => ({ ...p, accent_color: c }))} />

                {/* Section reorder button */}
                <div className="relative">
                  <button
                    ref={reorderBtnRef}
                    type="button"
                    onClick={() => setShowReorder(v => !v)}
                    title="Reorder sections"
                    className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-all ${showReorder ? 'bg-[#9400D3] text-white' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}
                  >
                    <ListOrdered size={14} />
                    <span className="hidden sm:inline text-xs font-medium">Reorder</span>
                  </button>

                  {showReorder && (
                    <div className="absolute top-full left-0 mt-2 z-50">
                      <SectionReorder
                        sections={REORDERABLE_SECTIONS}
                        order={sectionOrder}
                        onChange={updateSectionOrder}
                        onClose={() => setShowReorder(false)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Prev / Next */}
              <div className="flex items-center gap-1">
                <button onClick={() => setActiveSectionIndex(i => Math.max(i - 1, 0))}
                  disabled={activeSectionIndex === 0}
                  className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft className="size-3.5" /> Prev
                </button>
                <button onClick={() => setActiveSectionIndex(i => Math.min(i + 1, ALL_SECTIONS.length - 1))}
                  disabled={activeSectionIndex === ALL_SECTIONS.length - 1}
                  className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  Next <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Section tab pills — horizontally scrollable */}
            <div className="px-4 pt-3 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none">
              {ALL_SECTIONS.map((s, i) => {
                const Icon = s.icon
                return (
                  <button key={s.id} onClick={() => setActiveSectionIndex(i)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                      activeSectionIndex === i
                        ? 'bg-[#9400D3] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}>
                    <Icon className="size-3" /> {s.name}
                  </button>
                )
              })}
            </div>

            {/* Active form */}
            <div className="px-5 py-5">
              {renderForm()}
            </div>

            {/* Save button — desktop only */}
            <div className="px-5 pb-5 hidden lg:block">
              <button onClick={handleSave}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#9400D3] text-white text-sm font-semibold py-2.5 hover:bg-[#7a00b5] transition-colors">
                <Save className="size-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* ── PREVIEW PANEL ───────────────────────────────────────── */}
        <div className={`${mobileTab === 'preview' ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">Live Preview</p>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${resumeData.public ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                {resumeData.public ? 'Public' : 'Private'}
              </span>
            </div>
            <div className="w-full overflow-hidden bg-slate-100">
              <ResumePreview
                data={resumeData}
                template={resumeData.template}
                accentColor={resumeData.accent_color}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile fixed bottom action bar ──────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-2">
        <button onClick={handleSave}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#9400D3] text-white text-sm font-semibold py-2.5 hover:bg-[#7a00b5] transition-colors">
          <Save className="size-4" /> Save
        </button>
        <button onClick={changeVisibility}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
        </button>
        <button onClick={downloadResume}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <DownloadIcon className="size-4" />
        </button>
        {resumeData.public && (
          <button onClick={handleShare}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Share2Icon className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ResumeBuilder
