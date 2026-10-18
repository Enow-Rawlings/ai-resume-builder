import { Briefcase, Loader2, Plus, Sparkles, Trash } from "lucide-react"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import api from "../configs/api.js"
import { toast } from "react-hot-toast"

// Shared input class
const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors bg-white"

const ExperienceForm = ({ data, onChange }) => {
  const { token } = useSelector(state => state.auth)
  const [generatingIndex, setGeneratingIndex] = useState(-1)

  const addExperience = () => {
    onChange([...data, { company: "", position: "", start_date: "", end_date: "", description: "", is_current: false }])
  }

  const removeExperience = (index) => onChange(data.filter((_, i) => i !== index))

  const updateExperience = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const generateDescription = async (index) => {
    setGeneratingIndex(index)
    const exp = data[index]
    const prompt = `Enhance this job description: "${exp.description}" for the position of ${exp.position} at ${exp.company}.`
    try {
      const { data: res } = await api.post('/api/ai/enhance-job-desc', { userContent: prompt }, { headers: { Authorization: token } })
      updateExperience(index, "description", res.enhancedContent)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setGeneratingIndex(-1)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Professional Experience</h3>
          <p className="text-xs text-gray-500 mt-0.5">Add your work history</p>
        </div>
        <button
          onClick={addExperience}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
        >
          <Plus className="size-3.5" /> Add Experience
        </button>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <Briefcase className="w-10 h-10 mx-auto mb-2 text-gray-200" />
          <p className="text-sm">No experience added yet</p>
          <p className="text-xs mt-1">Click "Add Experience" to get started</p>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {data.map((exp, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-xl space-y-3 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Experience {index + 1}</span>
              <button onClick={() => removeExperience(index)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                <Trash className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={exp.company || ""} onChange={(e) => updateExperience(index, "company", e.target.value)} type="text" placeholder="Company Name" className={inputCls} />
              <input value={exp.position || ""} onChange={(e) => updateExperience(index, "position", e.target.value)} type="text" placeholder="Job Title" className={inputCls} />
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Start date</label>
                <input value={exp.start_date || ""} onChange={(e) => updateExperience(index, "start_date", e.target.value)} type="month" className={inputCls} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">End date</label>
                <input value={exp.end_date || ""} onChange={(e) => updateExperience(index, "end_date", e.target.value)} type="month" disabled={exp.is_current} className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400`} />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={exp.is_current || false} onChange={(e) => updateExperience(index, "is_current", e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm text-gray-600">Currently working here</span>
            </label>

            {/* Description + AI enhance */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600">Job Description</label>
                <button
                  onClick={() => generateDescription(index)}
                  disabled={generatingIndex === index || !exp.position?.trim() || !exp.company?.trim()}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-purple-200"
                >
                  {generatingIndex === index
                    ? <><Loader2 className="w-3 h-3 animate-spin" /> Generating…</>
                    : <><Sparkles className="w-3 h-3" /> AI Enhance</>
                  }
                </button>
              </div>
              <textarea
                value={exp.description || ""}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
                rows={4}
                placeholder="Describe your key responsibilities and achievements…"
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExperienceForm
