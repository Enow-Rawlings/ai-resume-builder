import { BriefcaseBusiness, Globe, Mail, MapPin, Phone, User } from 'lucide-react'
import React from 'react'

const inputCls = "mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors text-sm bg-white"

const fields = [
  { key: "full_name",  label: "Full Name",        icon: User,            type: "text",  required: true },
  { key: "email",      label: "Email Address",    icon: Mail,            type: "email", required: true },
  { key: "phone",      label: "Phone Number",     icon: Phone,           type: "tel" },
  { key: "location",   label: "Location",         icon: MapPin,          type: "text" },
  { key: "profession", label: "Profession",       icon: BriefcaseBusiness, type: "text" },
  { key: "linkedin",   label: "LinkedIn Profile", icon: Globe,           type: "url" },
  { key: "website",    label: "Personal Website", icon: Globe,           type: "url" },
]

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {
  const handleInputChange = (field, value) => onChange({ ...data, [field]: value })

  return (
    <div className="space-y-1">
      <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
      <p className="text-xs text-gray-500">Your basic details — name, contact, and links</p>

      {/* Profile image upload */}
      <div className="flex items-center gap-4 pt-3 pb-2">
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
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleInputChange("image", e.target.files[0])} />
        </label>

        {/* Remove background toggle — only shown when a file object is selected */}
        {typeof data.image === 'object' && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-gray-600">Remove Background</p>
            {/* Toggle switch — uses inline style to avoid relying on a custom .dot class */}
            <button
              type="button"
              role="switch"
              aria-checked={removeBackground}
              onClick={() => setRemoveBackground(p => !p)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${removeBackground ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <span
                className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                style={{ transform: removeBackground ? 'translateX(18px)' : 'translateX(2px)' }}
              />
            </button>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-1">
        {fields.map((field) => {
          const Icon = field.icon
          return (
            <div key={field.key} className={field.key === 'full_name' || field.key === 'email' ? 'sm:col-span-1' : ''}>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                <Icon className="size-3.5" />
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                value={data[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className={inputCls}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                required={field.required}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PersonalInfoForm
