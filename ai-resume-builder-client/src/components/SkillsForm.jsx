import { Plus, Sparkles, X } from "lucide-react"
import React, { useState } from "react"

const SkillsForm = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    const trimmed = newSkill.trim()
    if (trimmed && !data.includes(trimmed)) {
      onChange([...data, trimmed])
      setNewSkill("")
    }
  }

  const removeSkill = (index) => onChange(data.filter((_, i) => i !== index))

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill() }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Skills</h3>
        <p className="text-xs text-gray-500 mt-0.5">Add your technical and soft skills</p>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. JavaScript, Leadership, Figma"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors bg-white"
        />
        <button
          onClick={addSkill}
          disabled={!newSkill.trim()}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>

      {/* Pills */}
      {data.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {data.map((skill, index) => (
            <span key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-sm">
              {skill}
              <button onClick={() => removeSkill(index)} className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-200" />
          <p className="text-sm">No skills added yet</p>
          <p className="text-xs mt-1">Add your technical and soft skills above</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Add 8–12 relevant skills. Mix technical skills (languages, tools) with soft skills (leadership, communication).
        </p>
      </div>
    </div>
  )
}

export default SkillsForm
