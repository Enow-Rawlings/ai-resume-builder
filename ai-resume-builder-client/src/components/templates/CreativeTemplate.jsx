import { Globe, Mail, MapPin, Phone } from "lucide-react"

const DEFAULT_ORDER = ['professional_summary','experience','education','project','skills','languages','professional_bodies','references']

const CreativeTemplate = ({ data, accentColor }) => {
  const fmt = (d) => {
    if (!d) return ""
    const [y, m] = d.split("-")
    return new Date(y, m - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  const Badge = ({ children }) => (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white px-4 py-1.5 rounded-full" style={{ backgroundColor: accentColor }}>{children}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  )

  const order = data.section_order?.length ? data.section_order : DEFAULT_ORDER
  const pi = data.personal_info || {}

  const renderSection = (key) => {
    switch (key) {
      case 'professional_summary':
        return data.professional_summary ? (
          <section key="professional_summary" className="mb-8">
            <Badge>About Me</Badge>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{data.professional_summary}</p>
          </section>
        ) : null

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience" className="mb-8">
            <Badge>Experience</Badge>
            <div className="relative flex flex-col gap-6 pl-5">
              <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full" style={{ backgroundColor: accentColor + "30" }} />
              {data.experience.map((exp, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow" style={{ backgroundColor: accentColor }} />
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-sm font-bold text-gray-900">{exp.position}</p>
                    <span className="text-[11px] font-medium ml-2 whitespace-nowrap" style={{ color: accentColor }}>{fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{exp.company}</p>
                  {exp.description && <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education" className="mb-8">
            <Badge>Education</Badge>
            <div className="flex flex-col gap-4">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{edu.institution}</p>
                    {edu.gpa && <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>}
                  </div>
                  <span className="text-[11px] font-medium whitespace-nowrap ml-4" style={{ color: accentColor }}>{fmt(edu.graduation_date)}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'project':
        return data.project?.length > 0 ? (
          <section key="project" className="mb-8">
            <Badge>Projects</Badge>
            <div className="grid grid-cols-2 gap-4">
              {data.project.map((p, i) => (
                <div key={i} className="rounded-2xl p-4 border" style={{ borderColor: accentColor + "25", backgroundColor: accentColor + "06" }}>
                  <p className="text-sm font-bold text-gray-800">{p.name}</p>
                  {p.type && <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: accentColor }}>{p.type}</span>}
                  {p.description && <p className="text-xs text-gray-600 mt-2 leading-relaxed">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'skills': {
        const cats = Array.isArray(data.skills_categorized) ? data.skills_categorized.filter(c => c.skills?.length > 0) : []
        const flatSkills = data.skills || []
        if (cats.length === 0 && flatSkills.length === 0) return null
        const pillStyle = { color: accentColor, borderColor: accentColor + "50", backgroundColor: accentColor + "0c" }
        const Pill = ({ s }) => (
          <span className="text-xs font-medium px-3 py-1.5 rounded-full border" style={pillStyle}>{s}</span>
        )
        return (
          <section key="skills" className="mb-8">
            <Badge>Skills</Badge>
            {cats.length > 0 ? (
              <div className="space-y-3">
                {cats.map((cat, ci) => (
                  <div key={ci}>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">{cat.name}</p>
                    <div className="flex flex-wrap gap-2">{cat.skills.map((s, i) => <Pill key={i} s={s} />)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">{flatSkills.map((s, i) => <Pill key={i} s={s} />)}</div>
            )}
          </section>
        )
      }

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" className="mb-8">
            <Badge>Languages</Badge>
            <div className="flex flex-wrap gap-3">
              {data.languages.map((l, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-2xl border" style={{ borderColor: accentColor + "30", backgroundColor: accentColor + "06" }}>
                  <span className="text-sm font-semibold text-gray-800">{l.language}</span>
                  {l.proficiency && <span className="text-[11px] font-medium" style={{ color: accentColor }}>{l.proficiency}</span>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'professional_bodies':
        return data.professional_bodies?.length > 0 ? (
          <section key="professional_bodies" className="mb-8">
            <Badge>Professional Bodies</Badge>
            <div className="space-y-3">
              {data.professional_bodies.map((b, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-xl" style={{ backgroundColor: accentColor + "06" }}>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{b.organization}</p>
                    {b.membership_type && <p className="text-xs text-gray-500">{b.membership_type}</p>}
                  </div>
                  {b.year_joined && <span className="text-xs ml-4" style={{ color: accentColor }}>{b.year_joined}</span>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references" className="mb-8">
            <Badge>References</Badge>
            <div className="grid grid-cols-2 gap-4">
              {data.references.map((r, i) => (
                <div key={i} className="rounded-2xl p-4 border" style={{ borderColor: accentColor + "25" }}>
                  <p className="text-sm font-bold text-gray-900">{r.name}</p>
                  {r.title && <p className="text-xs text-gray-600">{r.title}{r.company ? `, ${r.company}` : ""}</p>}
                  {r.relationship && <p className="text-[11px] text-gray-400 mt-0.5">{r.relationship}</p>}
                  {r.email && <p className="text-[11px] text-gray-500 mt-1">{r.email}</p>}
                  {r.phone && <p className="text-[11px] text-gray-500">{r.phone}</p>}
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
      {/* Top accent bar */}
      <div className="h-3 w-full" style={{ backgroundColor: accentColor }} />

      {/* Header */}
      <header className="px-10 pt-8 pb-6 text-center">
        {pi.image && (
          <img src={typeof pi.image === 'object' ? URL.createObjectURL(pi.image) : pi.image}
            alt="Profile" className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4" style={{ borderColor: accentColor + "40" }} />
        )}
        <h1 className="text-4xl font-black tracking-tight text-gray-900">{pi.full_name || "Your Name"}</h1>
        {pi.profession && <p className="text-base font-semibold mt-1 uppercase tracking-[0.15em]" style={{ color: accentColor }}>{pi.profession}</p>}

        {(pi.date_of_birth || pi.nationality) && (
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mt-2">
            {pi.date_of_birth && <span>Born: {pi.date_of_birth}</span>}
            {pi.nationality && <span>Nationality: {pi.nationality}</span>}
          </div>
        )}

        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-gray-500">
          {pi.email    && <span className="flex items-center gap-1.5"><Mail   size={11} style={{ color: accentColor }} />{pi.email}</span>}
          {pi.phone    && <span className="flex items-center gap-1.5"><Phone  size={11} style={{ color: accentColor }} />{pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1.5"><MapPin size={11} style={{ color: accentColor }} />{pi.location}</span>}
          {pi.linkedin && <span className="flex items-center gap-1.5"><Globe  size={11} style={{ color: accentColor }} />{pi.linkedin.replace("https://www.","").replace("https://","")}</span>}
          {pi.social_media?.map((s, i) => s.url && (
            <span key={i} className="flex items-center gap-1.5"><Globe size={11} style={{ color: accentColor }} />{s.platform ? `${s.platform}: ` : ""}{s.url.replace("https://","")}</span>
          ))}
        </div>
        <div className="mt-6 mx-auto w-16 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} />
      </header>

      <main className="px-10 pb-10 flex flex-col">
        {order.map(renderSection)}
      </main>

      {/* Bottom accent bar */}
      <div className="h-2 w-full" style={{ backgroundColor: accentColor + "60" }} />
    </div>
  )
}

export default CreativeTemplate
