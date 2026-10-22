import { Globe, Plus, Trash } from 'lucide-react'
import React from 'react'

const PROFICIENCY_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']

const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors bg-white"

const LanguagesForm = ({ data = [], onChange }) => {
  const add = () => onChange([...data, { language: '', proficiency: '' }])

  const update = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const remove = (index) => onChange(data.filter((_, i) => i !== index))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Languages</h3>
          <p className="text-xs text-gray-500 mt-0.5">List languages you speak and your proficiency level</p>
        </div>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
        >
          <Plus className="size-3.5" /> Add Language
        </button>
      </div>

      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <Globe className="w-10 h-10 mx-auto mb-2 text-gray-200" />
          <p className="text-sm">No languages added yet</p>
          <p className="text-xs mt-1">Click "Add Language" to get started</p>
        </div>
      )}

      <div className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="grid grid-cols-[1fr_160px_auto] gap-3 items-center p-3 bg-gray-50/60 border border-gray-200 rounded-xl">
            <input
              type="text"
              value={item.language || ''}
              onChange={(e) => update(i, 'language', e.target.value)}
              placeholder="e.g. English, French, Spanish"
              className={inputCls}
            />
            <select
              value={item.proficiency || ''}
              onChange={(e) => update(i, 'proficiency', e.target.value)}
              className={inputCls}
            >
              <option value="">Proficiency</option>
              {PROFICIENCY_LEVELS.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2 text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash className="size-4" />
            </button>
          </div>
        ))}
      </div>

      {data.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> Always list your native language first. Europass uses A1–C2 scale — Native, Fluent ≈ C1/C2, Advanced ≈ B2, Intermediate ≈ B1, Basic ≈ A2.
          </p>
        </div>
      )}
    </div>
  )
}

export default LanguagesForm
