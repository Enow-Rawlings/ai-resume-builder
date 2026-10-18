import { GraduationCap, Plus, Trash } from 'lucide-react'
import React from 'react'

const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors bg-white"

const EducationForm = ({ data, onChange }) => {
  const addEducation = () => {
    onChange([...data, { institution: "", degree: "", field: "", graduation_date: "", gpa: "" }])
  }

  const removeEducation = (index) => onChange(data.filter((_, i) => i !== index))

  const updateEducation = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Education</h3>
          <p className="text-xs text-gray-500 mt-0.5">Add your education details</p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
        >
          <Plus className="size-3.5" /> Add Education
        </button>
      </div>

      {/* Empty state */}
      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <GraduationCap className="w-10 h-10 mx-auto mb-2 text-gray-200" />
          <p className="text-sm">No education added yet</p>
          <p className="text-xs mt-1">Click "Add Education" to get started</p>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {data.map((edu, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-xl space-y-3 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Education {index + 1}</span>
              <button onClick={() => removeEducation(index)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                <Trash className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={edu.institution || ""} onChange={(e) => updateEducation(index, "institution", e.target.value)} type="text" placeholder="Institution Name" className={inputCls} />
              <input value={edu.degree || ""} onChange={(e) => updateEducation(index, "degree", e.target.value)} type="text" placeholder="Degree (e.g. Bachelor's)" className={inputCls} />
              <input value={edu.field || ""} onChange={(e) => updateEducation(index, "field", e.target.value)} type="text" placeholder="Field of Study" className={inputCls} />
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Graduation date</label>
                <input value={edu.graduation_date || ""} onChange={(e) => updateEducation(index, "graduation_date", e.target.value)} type="month" className={inputCls} />
              </div>
            </div>

            <input value={edu.gpa || ""} onChange={(e) => updateEducation(index, "gpa", e.target.value)} type="text" placeholder="GPA (optional)" className={inputCls} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default EducationForm
