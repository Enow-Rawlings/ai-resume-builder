import { Plus, Sparkles, X } from "lucide-react"
import React, { useState } from "react"

/**
 * SkillsForm
 *
 * Manages skills_categorized: { core, technical, soft }
 * Each category is optional — users only fill what applies to them.
 *
 * Props:
 *   data     — skills_categorized object: { core: [], technical: [], soft: [] }
 *   onChange — (newSkillsCategorized) => void
 */

const CATEGORIES = [
  {
    key: "core",
    label: "Core Skills",
    color: "purple",
    description: "Fundamental abilities central to your profession",
    placeholder: "e.g. Project Management, Problem Solving",
    pillBg: "bg-[#9400D3]/8",
    pillBorder: "border-[#9400D3]/30",
    pillText: "text-[#9400D3]",
    pillHover: "hover:bg-[#9400D3]/15",
    activeBg: "bg-[#9400D3]",
    activeText: "text-white",
    inactiveBg: "bg-slate-100",
    inactiveText: "text-slate-500",
    dotColor: "bg-[#9400D3]",
  },
  {
    key: "technical",
    label: "Technical Skills",
    color: "blue",
    description: "Tools, languages, frameworks and platforms",
    placeholder: "e.g. JavaScript, Python, Figma, AWS",
    pillBg: "bg-blue-50",
    pillBorder: "border-blue-200",
    pillText: "text-blue-700",
    pillHover: "hover:bg-blue-100",
    activeBg: "bg-blue-600",
    activeText: "text-white",
    inactiveBg: "bg-slate-100",
    inactiveText: "text-slate-500",
    dotColor: "bg-blue-500",
  },
  {
    key: "soft",
    label: "Soft Skills",
    color: "emerald",
    description: "Interpersonal and workplace strengths",
    placeholder: "e.g. Leadership, Communication, Teamwork",
    pillBg: "bg-emerald-50",
    pillBorder: "border-emerald-200",
    pillText: "text-emerald-700",
    pillHover: "hover:bg-emerald-100",
    activeBg: "bg-emerald-600",
    activeText: "text-white",
    inactiveBg: "bg-slate-100",
    inactiveText: "text-slate-500",
    dotColor: "bg-emerald-500",
  },
]

const EMPTY = { core: [], technical: [], soft: [] }

const SkillsForm = ({ data, onChange }) => {
  // Normalise — data may be the old flat array (migration) or the new object
  const normalise = (raw) => {
    if (!raw || Array.isArray(raw)) return EMPTY
    return {
      core:      Array.isArray(raw.core)      ? raw.core      : [],
      technical: Array.isArray(raw.technical) ? raw.technical : [],
      soft:      Array.isArray(raw.soft)      ? raw.soft      : [],
    }
  }

  const skills = normalise(data)
  const [activeTab, setActiveTab] = useState("core")
  const [input, setInput]         = useState("")

  const activeCat = CATEGORIES.find(c => c.key === activeTab)
  const currentList = skills[activeTab] || []

  const add = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    if (currentList.includes(trimmed)) { setInput(""); return }
    onChange({ ...skills, [activeTab]: [...currentList, trimmed] })
    setInput("")
  }

  const remove = (category, index) => {
    onChange({ ...skills, [category]: skills[category].filter((_, i) => i !== index) })
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); add() }
  }

  const totalCount = (skills.core?.length || 0) + (skills.technical?.length || 0) + (skills.soft?.length || 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-semibold text-gray-900">Skills</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Add skills under each category — only fill the ones that apply to you
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
        {CATEGORIES.map(cat => {
          const count = skills[cat.key]?.length || 0
          const isActive = activeTab === cat.key
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => { setActiveTab(cat.key); setInput("") }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive ? `${cat.activeBg} ${cat.activeText} shadow-sm` : `${cat.inactiveBg} ${cat.inactiveText} hover:bg-slate-200`
              }`}
            >
              {cat.label.split(" ")[0]}
              {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25" : "bg-white text-slate-600"}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Active category description */}
      <p className="text-xs text-slate-400 -mt-1">{activeCat.description}</p>

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={activeCat.placeholder}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors bg-white"
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${activeCat.activeBg} hover:opacity-90`}
        >
          <Plus className="size-4" /> Add
        </button>
      </div>

      {/* Skills pills for active category */}
      {currentList.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {currentList.map((skill, i) => (
            <span
              key={i}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${activeCat.pillBg} ${activeCat.pillBorder} ${activeCat.pillText}`}
            >
              {skill}
              <button
                type="button"
                onClick={() => remove(activeTab, i)}
                className={`ml-1 rounded-full p-0.5 transition-colors ${activeCat.pillHover}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-7 border-2 border-dashed border-slate-100 rounded-xl text-gray-400">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-200" />
          <p className="text-sm">No {activeCat.label.toLowerCase()} added yet</p>
          <p className="text-xs mt-0.5">Type a skill above and press Enter or Add</p>
        </div>
      )}

      {/* Overview — all categories with skills */}
      {totalCount > 0 && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">All skills ({totalCount})</p>
          {CATEGORIES.map(cat => {
            const list = skills[cat.key] || []
            if (list.length === 0) return null
            return (
              <div key={cat.key} className="flex items-start gap-2">
                <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${cat.dotColor}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mr-2">{cat.label}</span>
                  <span className="text-xs text-slate-600">{list.join(", ")}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> You don't need to fill every category. Add only what's relevant — 8–12 skills total is ideal.
        </p>
      </div>
    </div>
  )
}

export default SkillsForm
