import { Mail, Phone, Plus, Trash, Users } from 'lucide-react'
import React from 'react'

const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors bg-white"

const ReferencesForm = ({ data = [], onChange }) => {
  const add = () =>
    onChange([...data, { name: '', title: '', company: '', email: '', phone: '', relationship: '' }])

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
          <h3 className="text-base font-semibold text-gray-900">References</h3>
          <p className="text-xs text-gray-500 mt-0.5">Professional contacts who can vouch for your work</p>
        </div>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
        >
          <Plus className="size-3.5" /> Add Reference
        </button>
      </div>

      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <Users className="w-10 h-10 mx-auto mb-2 text-gray-200" />
          <p className="text-sm">No references added yet</p>
          <p className="text-xs mt-1">Click "Add Reference" to get started</p>
        </div>
      )}

      <div className="space-y-4">
        {data.map((ref, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-xl space-y-3 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reference {i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600 transition-colors">
                <Trash className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 font-medium">Full Name *</label>
                <input type="text" value={ref.name || ''} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Dr. Jane Smith" className={`mt-1 ${inputCls}`} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Job Title</label>
                <input type="text" value={ref.title || ''} onChange={(e) => update(i, 'title', e.target.value)} placeholder="Senior Manager" className={`mt-1 ${inputCls}`} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Company / Organisation</label>
                <input type="text" value={ref.company || ''} onChange={(e) => update(i, 'company', e.target.value)} placeholder="Acme Corp" className={`mt-1 ${inputCls}`} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Relationship</label>
                <input type="text" value={ref.relationship || ''} onChange={(e) => update(i, 'relationship', e.target.value)} placeholder="e.g. Former Manager" className={`mt-1 ${inputCls}`} />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs text-gray-500 font-medium"><Mail className="size-3" /> Email</label>
                <input type="email" value={ref.email || ''} onChange={(e) => update(i, 'email', e.target.value)} placeholder="jane@example.com" className={`mt-1 ${inputCls}`} />
              </div>
              <div>
                <label className="flex items-center gap-1 text-xs text-gray-500 font-medium"><Phone className="size-3" /> Phone</label>
                <input type="tel" value={ref.phone || ''} onChange={(e) => update(i, 'phone', e.target.value)} placeholder="+1 234 567 8900" className={`mt-1 ${inputCls}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length > 0 && (
        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
          <p className="text-xs text-amber-700">
            <strong>Tip:</strong> Always get permission before listing someone as a reference. Some employers prefer "Available upon request" — you can leave this section empty in that case.
          </p>
        </div>
      )}
    </div>
  )
}

export default ReferencesForm
