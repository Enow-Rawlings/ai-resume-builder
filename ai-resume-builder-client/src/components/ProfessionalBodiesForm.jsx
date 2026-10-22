import { Award, Plus, Trash } from 'lucide-react'
import React from 'react'

const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors bg-white"

const ProfessionalBodiesForm = ({ data = [], onChange }) => {
  const add = () =>
    onChange([...data, { organization: '', membership_type: '', year_joined: '' }])

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
          <h3 className="text-base font-semibold text-gray-900">Professional Bodies</h3>
          <p className="text-xs text-gray-500 mt-0.5">Memberships, certifications, and professional associations</p>
        </div>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
        >
          <Plus className="size-3.5" /> Add Membership
        </button>
      </div>

      {data.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <Award className="w-10 h-10 mx-auto mb-2 text-gray-200" />
          <p className="text-sm">No memberships added yet</p>
          <p className="text-xs mt-1">Click "Add Membership" to get started</p>
        </div>
      )}

      <div className="space-y-4">
        {data.map((body, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-xl space-y-3 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Membership {i + 1}</span>
              <button type="button" onClick={() => remove(i)} className="p-1 text-red-400 hover:text-red-600 transition-colors">
                <Trash className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-500 font-medium">Organisation Name *</label>
                <input type="text" value={body.organization || ''} onChange={(e) => update(i, 'organization', e.target.value)} placeholder="e.g. IEEE, ACCA, ICE" className={`mt-1 ${inputCls}`} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Membership Type</label>
                <input type="text" value={body.membership_type || ''} onChange={(e) => update(i, 'membership_type', e.target.value)} placeholder="e.g. Full Member, Fellow, Associate" className={`mt-1 ${inputCls}`} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Year Joined</label>
                <input type="text" value={body.year_joined || ''} onChange={(e) => update(i, 'year_joined', e.target.value)} placeholder="e.g. 2019" className={`mt-1 ${inputCls}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProfessionalBodiesForm
