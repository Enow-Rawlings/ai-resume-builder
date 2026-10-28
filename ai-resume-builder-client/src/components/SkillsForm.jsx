import { Check, Pencil, Plus, Sparkles, Trash2, X } from "lucide-react"
import React, { useState } from "react"

/**
 * SkillsForm
 *
 * Manages skills_categorized: Array<{ name: string, skills: string[] }>
 * Categories are fully user-defined — users create, rename, and delete them.
 *
 * Props:
 *   data     — array of category objects: [{ name, skills }]
 *   onChange — (newCategories) => void
 */

// Suggested category names shown as quick-add chips — generic enough for any field
const SUGGESTIONS = [
  "Core Skills", "Technical Skills", "Soft Skills",
  "Tools & Software", "Languages", "Design",
  "Management", "Clinical Skills", "Research",
  "Communication", "Creative", "Finance",
]

const PILL_COLORS = [
  { bg: "bg-purple-50",  border: "border-purple-200", text: "text-purple-700",  dot: "bg-purple-500",  btn: "#9400D3" },
  { bg: "bg-blue-50",    border: "border-blue-200",   text: "text-blue-700",    dot: "bg-blue-500",    btn: "#3B82F6" },
  { bg: "bg-emerald-50", border: "border-emerald-200",text: "text-emerald-700", dot: "bg-emerald-500", btn: "#10B981" },
  { bg: "bg-orange-50",  border: "border-orange-200", text: "text-orange-700",  dot: "bg-orange-500",  btn: "#F97316" },
  { bg: "bg-rose-50",    border: "border-rose-200",   text: "text-rose-700",    dot: "bg-rose-500",    btn: "#F43F5E" },
  { bg: "bg-cyan-50",    border: "border-cyan-200",   text: "text-cyan-700",    dot: "bg-cyan-500",    btn: "#06B6D4" },
  { bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-700",   dot: "bg-amber-500",   btn: "#F59E0B" },
  { bg: "bg-indigo-50",  border: "border-indigo-200", text: "text-indigo-700",  dot: "bg-indigo-500",  btn: "#6366F1" },
]

const normalise = (raw) => {
  if (!raw) return []
  // Legacy shape: { core, technical, soft }
  if (!Array.isArray(raw)) {
    const out = []
    if (raw.core?.length)      out.push({ name: "Core Skills",      skills: raw.core })
    if (raw.technical?.length) out.push({ name: "Technical Skills", skills: raw.technical })
    if (raw.soft?.length)      out.push({ name: "Soft Skills",      skills: raw.soft })
    return out
  }
  return raw
}

const SkillsForm = ({ data, onChange }) => {
  const categories = normalise(data)

  const [activeIdx,    setActiveIdx]    = useState(0)
  const [input,        setInput]        = useState("")
  const [newCatName,   setNewCatName]   = useState("")
  const [addingCat,    setAddingCat]    = useState(false)
  const [editingIdx,   setEditingIdx]   = useState(null)
  const [editingName,  setEditingName]  = useState("")

  const active = categories[activeIdx] || null
  const color  = PILL_COLORS[activeIdx % PILL_COLORS.length]

  // ── Category CRUD ────────────────────────────────────────────────────────
  const addCategory = () => {
    const name = newCatName.trim()
    if (!name) return
    const updated = [...categories, { name, skills: [] }]
    onChange(updated)
    setActiveIdx(updated.length - 1)
    setNewCatName("")
    setAddingCat(false)
    setInput("")
  }

  const deleteCategory = (idx) => {
    const updated = categories.filter((_, i) => i !== idx)
    onChange(updated)
    setActiveIdx(Math.min(activeIdx, updated.length - 1))
  }

  const renameCategory = (idx) => {
    const name = editingName.trim()
    if (!name) { setEditingIdx(null); return }
    const updated = categories.map((c, i) => i === idx ? { ...c, name } : c)
    onChange(updated)
    setEditingIdx(null)
  }

  // ── Skill CRUD ───────────────────────────────────────────────────────────
  const addSkill = () => {
    const trimmed = input.trim()
    if (!trimmed || !active) return
    if (active.skills.includes(trimmed)) { setInput(""); return }
    const updated = categories.map((c, i) =>
      i === activeIdx ? { ...c, skills: [...c.skills, trimmed] } : c
    )
    onChange(updated)
    setInput("")
  }

  const removeSkill = (catIdx, skillIdx) => {
    const updated = categories.map((c, i) =>
      i === catIdx ? { ...c, skills: c.skills.filter((_, si) => si !== skillIdx) } : c
    )
    onChange(updated)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill() }
  }

  const totalCount = categories.reduce((sum, c) => sum + (c.skills?.length || 0), 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-semibold text-gray-900">Skills</h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Create your own skill categories — name them anything that fits your field
        </p>
      </div>

      {/* Category tabs + add button */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat, idx) => {
            const c = PILL_COLORS[idx % PILL_COLORS.length]
            const isActive = idx === activeIdx
            return (
              <div key={idx} className="flex items-center gap-0.5">
                {editingIdx === idx ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") renameCategory(idx); if (e.key === "Escape") setEditingIdx(null) }}
                      className="text-xs px-2 py-1.5 border border-blue-400 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button type="button" onClick={() => renameCategory(idx)} className="p-1 rounded text-emerald-600 hover:bg-emerald-50">
                      <Check className="size-3.5" />
                    </button>
                    <button type="button" onClick={() => setEditingIdx(null)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setActiveIdx(idx); setInput("") }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      isActive
                        ? `text-white border-transparent shadow-sm`
                        : `${c.bg} ${c.border} ${c.text} hover:opacity-80`
                    }`}
                    style={isActive ? { backgroundColor: c.btn, borderColor: c.btn } : {}}
                  >
                    {cat.name}
                    {cat.skills.length > 0 && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25" : "bg-white/70"}`}>
                        {cat.skills.length}
                      </span>
                    )}
                  </button>
                )}
                {/* Rename / delete only when this tab is active and not being edited */}
                {isActive && editingIdx !== idx && (
                  <div className="flex items-center gap-0.5 ml-0.5">
                    <button
                      type="button"
                      title="Rename category"
                      onClick={() => { setEditingIdx(idx); setEditingName(cat.name) }}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      type="button"
                      title="Delete category"
                      onClick={() => deleteCategory(idx)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {/* Add category button */}
          <button
            type="button"
            onClick={() => setAddingCat(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 border border-dashed border-slate-300 hover:border-slate-400 hover:text-slate-700 transition-all"
          >
            <Plus className="size-3" /> Add
          </button>
        </div>
      )}

      {/* New category input */}
      {addingCat && (
        <div className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addCategory(); if (e.key === "Escape") { setAddingCat(false); setNewCatName("") } }}
            placeholder="Category name, e.g. Frontend, Clinical Skills…"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9400D3]/30 focus:border-[#9400D3] transition-colors bg-white"
          />
          <button type="button" onClick={addCategory} disabled={!newCatName.trim()}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#9400D3] hover:bg-[#7a00b5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Create
          </button>
          <button type="button" onClick={() => { setAddingCat(false); setNewCatName("") }}
            className="px-3 py-2 text-sm text-slate-500 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
        </div>
      )}

      {/* Suggestion chips — shown when no categories yet */}
      {categories.length === 0 && !addingCat && (
        <div className="rounded-xl border-2 border-dashed border-slate-200 p-5 text-center space-y-3">
          <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No skill categories yet</p>
          <p className="text-xs text-slate-400">Start from a suggestion or create your own</p>
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => { onChange([...categories, { name: s, skills: [] }]); setActiveIdx(categories.length) }}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-[#9400D3]/10 hover:text-[#9400D3] border border-slate-200 hover:border-[#9400D3]/30 transition-all"
              >
                + {s}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAddingCat(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg bg-[#9400D3] hover:bg-[#7a00b5] transition-colors"
          >
            <Plus className="size-4" /> Create custom category
          </button>
        </div>
      )}

      {/* Skill input — only when a category is active */}
      {active && (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Add a skill to "${active.name}"…`}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9400D3]/30 focus:border-[#9400D3] transition-colors bg-white"
            />
            <button
              type="button"
              onClick={addSkill}
              disabled={!input.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: color.btn }}
            >
              <Plus className="size-4" /> Add
            </button>
          </div>

          {/* Skills pills */}
          {active.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {active.skills.map((skill, i) => (
                <span key={i} className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border ${color.bg} ${color.border} ${color.text}`}>
                  {skill}
                  <button type="button" onClick={() => removeSkill(activeIdx, i)}
                    className={`ml-1 rounded-full p-0.5 hover:opacity-70 transition-opacity`}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl text-gray-400">
              <p className="text-sm">No skills in "{active.name}" yet</p>
              <p className="text-xs mt-0.5">Type a skill above and press Enter or Add</p>
            </div>
          )}
        </>
      )}

      {/* Overview */}
      {totalCount > 0 && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">All skills ({totalCount})</p>
          {categories.map((cat, idx) => {
            if (!cat.skills?.length) return null
            const c = PILL_COLORS[idx % PILL_COLORS.length]
            return (
              <div key={idx} className="flex items-start gap-2">
                <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${c.dot}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mr-2">{cat.name}</span>
                  <span className="text-xs text-slate-600">{cat.skills.join(", ")}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Name categories anything that fits your field — "Cybersecurity", "Clinical Skills", "Design Tools", "Soft Skills". 8–12 skills total is ideal.
        </p>
      </div>
    </div>
  )
}

export default SkillsForm
