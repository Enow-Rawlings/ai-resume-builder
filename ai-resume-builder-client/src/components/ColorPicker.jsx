import { Check, Palette } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

const COLORS = [
  { name: "Blue",   value: "#3B82F6" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Violet", value: "#9400D3" },
  { name: "Green",  value: "#10B981" },
  { name: "Teal",   value: "#14B8A6" },
  { name: "Red",    value: "#EF4444" },
  { name: "Orange", value: "#F97316" },
  { name: "Pink",   value: "#EC4899" },
  { name: "Slate",  value: "#1F2937" },
]

const ColorPicker = ({ selectedColor = "#3B82F6", onChange = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setIsOpen(o => !o)}
        className="flex items-center gap-1.5 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 hover:ring ring-purple-300 transition-all px-3 py-2 rounded-lg"
      >
        {/* Live colour dot */}
        <span
          className="h-3.5 w-3.5 rounded-full border border-white shadow-sm shrink-0"
          style={{ backgroundColor: selectedColor }}
        />
        <Palette size={14} />
        <span>Colour</span>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-xl p-3"
          style={{ maxWidth: 'calc(100vw - 2rem)' }}
        >
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Accent colour</p>
          <div className="grid grid-cols-5 gap-2">
            {COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.name}
                onClick={() => { onChange(color.value); setIsOpen(false) }}
                className="relative h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundColor: color.value,
                  borderColor: selectedColor === color.value ? '#1e293b' : 'transparent',
                }}
              >
                {selectedColor === color.value && (
                  <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPicker
