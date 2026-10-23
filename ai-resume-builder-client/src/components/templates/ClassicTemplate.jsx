import { Globe, Mail, MapPin, Phone } from "lucide-react";

const DEFAULT_ORDER = ['professional_summary','experience','education','project','skills','languages','professional_bodies','references']

const ClassicTemplate = ({ data, accentColor }) => {
  const fmt = (d) => {
    if (!d) return ""
    const [y, m] = d.split("-")
    return new Date(y, m - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  const H = ({ children }) => (
    <h2 className="text-base font-bold mb-3 pb-1 border-b-2 uppercase tracking-wider" style={{ color: accentColor, borderColor: accentColor }}>
      {children}
    </h2>
  )

  const order = data.section_order?.length ? data.section_order : DEFAULT_ORDER

  const renderSection = (key) => {
    switch (key) {
      case 'professional_summary':
        return data.professional_summary ? (
          <section key="professional_summary" className="mb-5">
            <H>Professional Summary</H>
            <p className="text-gray-700 leading-relaxed text-sm">{data.professional_summary}</p>
          </section>
        ) : null

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience" className="mb-5">
            <H>Professional Experience</H>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{exp.position}</p>
                      <p className="text-gray-600 text-sm">{exp.company}</p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}
                    </p>
                  </div>
                  {exp.description && <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education" className="mb-5">
            <H>Education</H>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                    <p className="text-gray-600 text-sm">{edu.institution}</p>
                    {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                  </div>
                  <p className="text-xs text-gray-500 whitespace-nowrap ml-2">{fmt(edu.graduation_date)}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'project':
        return data.project?.length > 0 ? (
          <section key="project" className="mb-5">
            <H>Projects</H>
            <div className="space-y-3">
              {data.project.map((p, i) => (
                <div key={i} className="border-l-2 border-gray-300 pl-4">
                  <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                  {p.type && <p className="text-xs text-gray-500">{p.type}</p>}
                  {p.description && <p className="text-sm text-gray-600 mt-1">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'skills': {
        const sc = data.skills_categorized
        const hasCats = sc && (sc.core?.length > 0 || sc.technical?.length > 0 || sc.soft?.length > 0)
        const flatSkills = data.skills || []
        if (!hasCats && flatSkills.length === 0) return null
        const pillCls = `px-2.5 py-1 rounded-full text-xs font-medium border`
        const pillStyle = { color: accentColor, borderColor: accentColor + "50", backgroundColor: accentColor + "10" }
        return (
          <section key="skills" className="mb-5">
            <H>Skills</H>
            {hasCats ? (
              <div className="space-y-3">
                {sc.core?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Core</p>
                    <div className="flex flex-wrap gap-2">{sc.core.map((s, i) => <span key={i} className={pillCls} style={pillStyle}>{s}</span>)}</div>
                  </div>
                )}
                {sc.technical?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Technical</p>
                    <div className="flex flex-wrap gap-2">{sc.technical.map((s, i) => <span key={i} className={pillCls} style={pillStyle}>{s}</span>)}</div>
                  </div>
                )}
                {sc.soft?.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Soft</p>
                    <div className="flex flex-wrap gap-2">{sc.soft.map((s, i) => <span key={i} className={pillCls} style={pillStyle}>{s}</span>)}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">{flatSkills.map((s, i) => <span key={i} className={pillCls} style={pillStyle}>{s}</span>)}</div>
            )}
          </section>
        )
      }

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" className="mb-5">
            <H>Languages</H>
            <div className="grid grid-cols-2 gap-2">
              {data.languages.map((l, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-800 font-medium">{l.language}</span>
                  {l.proficiency && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{l.proficiency}</span>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'professional_bodies':
        return data.professional_bodies?.length > 0 ? (
          <section key="professional_bodies" className="mb-5">
            <H>Professional Bodies</H>
            <div className="space-y-2">
              {data.professional_bodies.map((b, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{b.organization}</p>
                    {b.membership_type && <p className="text-xs text-gray-500">{b.membership_type}</p>}
                  </div>
                  {b.year_joined && <p className="text-xs text-gray-500 whitespace-nowrap ml-2">{b.year_joined}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references" className="mb-5">
            <H>References</H>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.references.map((r, i) => (
                <div key={i} className="text-sm">
                  <p className="font-semibold text-gray-900">{r.name}</p>
                  {r.title && <p className="text-gray-600">{r.title}</p>}
                  {r.company && <p className="text-gray-500">{r.company}</p>}
                  {r.relationship && <p className="text-xs text-gray-400">{r.relationship}</p>}
                  <div className="mt-1 space-y-0.5">
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

  const pi = data.personal_info || {}

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-800 text-sm leading-relaxed">
      {/* Header */}
      <header className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: accentColor }}>
        {pi.image && (
          <img src={typeof pi.image === 'object' ? URL.createObjectURL(pi.image) : pi.image}
            alt="Profile" className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-2" style={{ ringColor: accentColor }} />
        )}
        <h1 className="text-3xl font-bold mb-1" style={{ color: accentColor }}>{pi.full_name || "Your Name"}</h1>
        {pi.profession && <p className="text-gray-600 font-medium mb-2">{pi.profession}</p>}

        {/* Personal details row (DOB, Nationality) */}
        {(pi.date_of_birth || pi.nationality) && (
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-2">
            {pi.date_of_birth && <span>Born: {pi.date_of_birth}</span>}
            {pi.nationality && <span>Nationality: {pi.nationality}</span>}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {pi.email    && <span className="flex items-center gap-1"><Mail    className="size-3.5" />{pi.email}</span>}
          {pi.phone    && <span className="flex items-center gap-1"><Phone   className="size-3.5" />{pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1"><MapPin  className="size-3.5" />{pi.location}</span>}
          {pi.linkedin && <span className="flex items-center gap-1"><Globe   className="size-3.5" />{pi.linkedin.replace("https://www.","").replace("https://","")}</span>}
          {pi.website  && <span className="flex items-center gap-1"><Globe   className="size-3.5" />{pi.website.replace("https://","")}</span>}
          {pi.social_media?.map((s, i) => s.url && (
            <span key={i} className="flex items-center gap-1"><Globe className="size-3.5" />{s.platform ? `${s.platform}: ` : ""}{s.url.replace("https://","")}</span>
          ))}
        </div>
      </header>

      {order.map(renderSection)}
    </div>
  )
}

export default ClassicTemplate
