import { BriefcaseBusiness, Calendar, Flag, Globe, Mail, MapPin, Phone, Plus, Trash, User } from 'lucide-react'
import React from 'react'

const inputCls = "mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors text-sm bg-white"

const SOCIAL_PLATFORMS = ['LinkedIn', 'GitHub', 'Twitter/X', 'Instagram', 'Facebook', 'YouTube', 'Portfolio', 'Other']

const baseFields = [
  { key: 'full_name',  label: 'Full Name',        icon: User,            type: 'text',  required: true },
  { key: 'email',      label: 'Email Address',    icon: Mail,            type: 'email', required: true },
  { key: 'phone',      label: 'Phone Number',     icon: Phone,           type: 'tel' },
  { key: 'location',   label: 'Location',         icon: MapPin,          type: 'text' },
  { key: 'profession', label: 'Profession',       icon: BriefcaseBusiness, type: 'text' },
  { key: 'linkedin',   label: 'LinkedIn Profile', icon: Globe,           type: 'url' },
  { key: 'website',    label: 'Personal Website', icon: Globe,           type: 'url' },
  { key: 'date_of_birth', label: 'Date of Birth', icon: Calendar,        type: 'date' },
  { key: 'nationality',   label: 'Nationality',   icon: Flag,            type: 'text' },
]

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {
  const handleChange = (field, value) => onChange({ ...data, [field]: value })

  // ── Social media helpers ───────────────────────────────────────────
  const socialMedia = Array.isArray(data.social_media) ? data.social_media : []

  const addSocial = () =>
    onChange({ ...data, social_media: [...socialMedia, { platform: '', url: '' }] })

  const updateSocial = (index, field, value) => {
    const updated = [...socialMedia]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, social_media: updated })
  }

  const removeSocial = (index) =>
    onChange({ ...data, social_media: socialMedia.filter((_, i) => i !== index) })

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
        <p className="text-xs text-gray-500 mt-0.5">Your contact details and personal identifiers</p>
      </div>

      {/* ── Profile image ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          {data.image ? (
            <img
              src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-200 hover:opacity-80 transition-opacity"
            />
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors">
              <User className="size-5" />
              <span className="text-[10px] mt-0.5">Photo</span>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleChange('image', e.target.files[0])} />
        </label>

        {typeof data.image === 'object' && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-gray-600">Remove Background</p>
            <button
              type="button"
              role="switch"
              aria-checked={removeBackground}
              onClick={() => setRemoveBackground(p => !p)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${removeBackground ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <span
                className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                style={{ transform: removeBackground ? 'translateX(18px)' : 'translateX(2px)' }}
              />
            </button>
          </div>
        )}
      </div>

      {/* ── Base fields in 2-col grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
        {baseFields.map(({ key, label, icon: Icon, type, required }) => (
          <div key={key}>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
              <Icon className="size-3.5" />
              {label}
              {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={type}
              value={data[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className={inputCls}
              placeholder={type === 'date' ? '' : `Enter your ${label.toLowerCase()}`}
              required={required}
            />
          </div>
        ))}
      </div>

      {/* ── Social media ──────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">Social Media</h4>
            <p className="text-xs text-gray-500">Add any public social or portfolio links</p>
          </div>
          <button
            type="button"
            onClick={addSocial}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <Plus className="size-3.5" /> Add Link
          </button>
        </div>

        {socialMedia.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-xl">
            No social links added yet
          </p>
        )}

        <div className="space-y-2">
          {socialMedia.map((item, i) => (
            <div key={i} className="grid grid-cols-[140px_1fr_auto] gap-2 items-center">
              <select
                value={item.platform || ''}
                onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
              >
                <option value="">Platform</option>
                {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input
                type="url"
                value={item.url || ''}
                onChange={(e) => updateSocial(i, 'url', e.target.value)}
                placeholder="https://"
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white"
              />
              <button
                type="button"
                onClick={() => removeSocial(i)}
                className="p-2 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoForm
