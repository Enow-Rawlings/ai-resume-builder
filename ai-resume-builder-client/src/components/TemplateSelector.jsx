import { Layout, Check } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'

const templates = [
  { id: "classic",       name: "Classic",       preview: "Clean, traditional format with centred header. Great for corporate roles." },
  { id: "modern",        name: "Modern",        preview: "Full-width coloured header band. Bold and contemporary." },
  { id: "minimal-image", name: "Minimal Image", preview: "Two-column layout with profile photo sidebar." },
  { id: "minimal",       name: "Minimal",       preview: "Ultra-clean single column. Content first, zero clutter." },
  { id: "executive",     name: "Executive",     preview: "Accent sidebar with initials avatar. Polished and senior." },
  { id: "tech",          name: "Tech",          preview: "Dark header, tech-stack pill badges. Built for developers." },
  { id: "creative",      name: "Creative",      preview: "Bold accent bars, timeline experience. Stands out for creative roles." },
]

const TemplateSelector = ({ selectedTemplate, onChange }) => {
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
        className="flex items-center gap-1.5 text-sm text-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 hover:ring ring-blue-300 transition-all px-3 py-2 rounded-lg"
      >
        <Layout size={14} />
        <span>Template</span>
      </button>

      {isOpen && (
        <div
          // fixed width, open upward on mobile to avoid bottom-bar overlap
          className="absolute left-0 z-50 mt-2 w-72 max-h-[60vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl p-2 space-y-1"
          // Ensure it doesn't overflow the right edge of the viewport
          style={{ maxWidth: 'calc(100vw - 2rem)' }}
        >
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { onChange(t.id); setIsOpen(false) }}
              className={`w-full text-left relative p-3 rounded-lg border transition-all ${
                selectedTemplate === t.id
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-transparent hover:bg-gray-50'
              }`}
            >
              {selectedTemplate === t.id && (
                <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <p className="text-sm font-medium text-gray-800 pr-6">{t.name}</p>
              <p className="mt-0.5 text-xs text-gray-500">{t.preview}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplateSelector
