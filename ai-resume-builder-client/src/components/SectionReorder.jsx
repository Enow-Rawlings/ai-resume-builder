import { ChevronDown, ChevronUp, GripVertical, X } from 'lucide-react'
import React, { useRef, useState } from 'react'

/**
 * SectionReorder
 *
 * Props:
 *   sections   — array of { key, label, icon: LucideComponent }
 *   order      — array of section keys in current display order
 *   onChange   — (newOrder: string[]) => void
 *   onClose    — () => void — closes the panel
 *
 * Supports both:
 *  - Up/Down arrow buttons (touch + mouse friendly)
 *  - Mouse drag-and-drop via HTML5 drag events
 */
const SectionReorder = ({ sections, order, onChange, onClose }) => {
  const [dragIndex, setDragIndex] = useState(null)
  const dragOverIndex = useRef(null)

  // Build a display list: only include keys that exist in sections
  const sectionMap = Object.fromEntries(sections.map(s => [s.key, s]))
  const validOrder = order.filter(k => sectionMap[k])

  const move = (from, to) => {
    if (to < 0 || to >= validOrder.length) return
    const next = [...validOrder]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  // ── Drag handlers ──────────────────────────────────────────────────
  const handleDragStart = (i) => setDragIndex(i)
  const handleDragEnter = (i) => { dragOverIndex.current = i }
  const handleDragEnd = () => {
    if (dragIndex !== null && dragOverIndex.current !== null && dragIndex !== dragOverIndex.current) {
      move(dragIndex, dragOverIndex.current)
    }
    setDragIndex(null)
    dragOverIndex.current = null
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">Section Order</p>
          <p className="text-xs text-slate-400 mt-0.5">Drag or use arrows to reorder</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Section list */}
      <ul className="space-y-1.5">
        {validOrder.map((key, i) => {
          const section = sectionMap[key]
          const Icon = section?.icon
          const isDragging = dragIndex === i

          return (
            <li
              key={key}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 px-2 py-2 rounded-xl border transition-all cursor-grab active:cursor-grabbing select-none ${
                isDragging
                  ? 'opacity-40 border-[#9400D3]/40 bg-[#9400D3]/5'
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200 hover:bg-white'
              }`}
            >
              {/* Grip handle */}
              <GripVertical className="size-4 text-slate-300 shrink-0" />

              {/* Icon + label */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {Icon && <Icon className="size-3.5 text-slate-400 shrink-0" />}
                <span className="text-xs font-medium text-slate-700 truncate">{section.label}</span>
              </div>

              {/* Up/Down buttons */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  className="p-1 rounded text-slate-400 hover:text-[#9400D3] hover:bg-[#9400D3]/8 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move up"
                >
                  <ChevronUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === validOrder.length - 1}
                  className="p-1 rounded text-slate-400 hover:text-[#9400D3] hover:bg-[#9400D3]/8 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move down"
                >
                  <ChevronDown className="size-3.5" />
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <p className="text-[10px] text-slate-400 text-center mt-3">
        Changes apply to the live preview immediately
      </p>
    </div>
  )
}

export default SectionReorder
