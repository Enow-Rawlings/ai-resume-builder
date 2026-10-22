import { Globe, Mail, MapPin, Phone } from "lucide-react"

const DEFAULT_ORDER = ['professional_summary','experience','education','project','skills','languages','professional_bodies','references']

const ModernTemplate = ({ data, accentColor }) => {
  const fmt = (d) => {
    if (!d) return ""
    const [y, m] = d.split("-")
    return new Date(y, m - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  const H = ({ children }) => (
    <h2 className="text-xl font-light mb-4 pb-2 border-b border-gray-200">{children}</h2>
  )

  const order = data.section_order?.length ? data.section_order : DEFAULT_ORDER
  const pi = data.personal_info || {}

  const renderSection = (key) => {
    switch (key) {
      case 'professional_summary':
        return data.professional_summary ? (
          <section key="professional_summary" className="mb-7">
            <H>Professional Summary</H>
            <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
          </section>
        ) : null

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience" className="mb-7">
            <H>Experience</H>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-5 border-l border-gray-200">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-gray-900">{exp.position}</p>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
                      {fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-sm font-medium mb-1" style={{ color: accentColor }}>{exp.company}</p>
                  {exp.description && <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education" className="mb-7">
            <H>Education</H>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                    <p className="text-sm" style={{ color: accentColor }}>{edu.institution}</p>
                    {edu.gpa && <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">{fmt(edu.graduation_date)}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'project':
        return data.project?.length > 0 ? (
          <section key="project" className="mb-7">
            <H>Projects</H>
            <div className="space-y-4">
              {data.project.map((p, i) => (
                <div key={i} className="relative pl-5 border-l border-gray-200" style={{ borderLeftColor: accentColor }}>
                  <p className="font-medium text-gray-900">{p.name}</p>
                  {p.type && <p className="text-xs mb-1" style={{ color: accentColor }}>{p.type}</p>}
                  {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" className="mb-7">
            <H>Skills</H>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s, i) => (
                <span key={i} className="px-3 py-1 text-sm text-white rounded-full" style={{ backgroundColor: accentColor }}>{s}</span>
              ))}
            </div>
          </section>
        ) : null

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" className="mb-7">
            <H>Languages</H>
            <div className="grid grid-cols-2 gap-3">
              {data.languages.map((l, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800 text-sm">{l.language}</span>
                  {l.proficiency && (
                    <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: accentColor }}>{l.proficiency}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'professional_bodies':
        return data.professional_bodies?.length > 0 ? (
          <section key="professional_bodies" className="mb-7">
            <H>Professional Bodies</H>
            <div className="space-y-3">
              {data.professional_bodies.map((b, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{b.organization}</p>
                    {b.membership_type && <p className="text-sm text-gray-500">{b.membership_type}</p>}
                  </div>
                  {b.year_joined && <span className="text-xs text-gray-400 ml-4">{b.year_joined}</span>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references" className="mb-7">
            <H>References</H>
            <div className="grid sm:grid-cols-2 gap-5">
              {data.references.map((r, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-semibold text-gray-900">{r.name}</p>
                  {r.title && <p className="text-sm text-gray-600">{r.title}</p>}
                  {r.company && <p className="text-sm" style={{ color: accentColor }}>{r.company}</p>}
                  {r.relationship && <p className="text-xs text-gray-400 mt-0.5">{r.relationship}</p>}
                  <div className="mt-1.5 space-y-0.5">
                    {r.email && <p className="text-xs text-gray-500">{r.email}</p>}
                    {r.phone && <p className="text-xs text-gray-500">{r.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null

      default: return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      {/* Header band */}
      <header className="p-8 text-white relative overflow-hidden" style={{ backgroundColor: accentColor }}>
        <svg className="print-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true" focusable="false"
          style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <rect x="0" y="0" width="100%" height="100%" fill={accentColor} />
        </svg>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-5">
            {pi.image && (
              <img src={typeof pi.image === 'object' ? URL.createObjectURL(pi.image) : pi.image}
                alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shrink-0" />
            )}
            <div>
              <h1 className="text-3xl font-light mb-1">{pi.full_name || "Your Name"}</h1>
              {pi.profession && <p className="text-white/80">{pi.profession}</p>}
            </div>
          </div>
          {(pi.date_of_birth || pi.nationality) && (
            <div className="flex flex-wrap gap-4 text-xs text-white/70 mt-2">
              {pi.date_of_birth && <span>Born: {pi.date_of_birth}</span>}
              {pi.nationality && <span>Nationality: {pi.nationality}</span>}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm mt-3">
            {pi.email    && <span className="flex items-center gap-2"><Mail  className="size-4" />{pi.email}</span>}
            {pi.phone    && <span className="flex items-center gap-2"><Phone className="size-4" />{pi.phone}</span>}
            {pi.location && <span className="flex items-center gap-2"><MapPin className="size-4" />{pi.location}</span>}
            {pi.linkedin && <span className="flex items-center gap-2"><Globe className="size-4" />{pi.linkedin.replace("https://www.","").replace("https://","")}</span>}
            {pi.website  && <span className="flex items-center gap-2"><Globe className="size-4" />{pi.website.replace("https://","")}</span>}
            {pi.social_media?.map((s, i) => s.url && (
              <span key={i} className="flex items-center gap-2"><Globe className="size-4" />{s.platform ? `${s.platform}: ` : ""}{s.url.replace("https://","")}</span>
            ))}
          </div>
        </div>
      </header>
      <div className="p-8">{order.map(renderSection)}</div>
    </div>
  )
}

export default ModernTemplate
