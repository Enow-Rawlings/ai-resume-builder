import { Code2, Globe, Mail, MapPin, Phone } from "lucide-react"

const SIDEBAR_KEYS = new Set(['skills', 'languages', 'education', 'professional_bodies'])
const MAIN_KEYS = new Set(['professional_summary', 'experience', 'project', 'references'])
const DEFAULT_ORDER = ['professional_summary','experience','education','project','skills','languages','professional_bodies','references']

const TechTemplate = ({ data, accentColor }) => {
  const fmt = (d) => {
    if (!d) return ""
    const [y, m] = d.split("-")
    return new Date(y, m - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  const MH = ({ children }) => (
    <div className="flex items-center gap-2 mb-4">
      <Code2 size={14} style={{ color: accentColor }} />
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700">{children}</h2>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )

  const SH = ({ children }) => (
    <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>{children}</h2>
  )

  const order = data.section_order?.length ? data.section_order : DEFAULT_ORDER
  const pi = data.personal_info || {}
  const sidebarSections = order.filter(k => SIDEBAR_KEYS.has(k))
  const mainSections = order.filter(k => MAIN_KEYS.has(k))

  const renderSidebar = (key) => {
    switch (key) {
      case 'skills':
        return data.skills?.length > 0 ? (
          <div key="skills" className="mb-6">
            <SH>Tech Stack</SH>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s, i) => (
                <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-md border" style={{ color: accentColor, borderColor: accentColor + "40", backgroundColor: accentColor + "0d" }}>{s}</span>
              ))}
            </div>
          </div>
        ) : null

      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages" className="mb-6">
            <SH>Languages</SH>
            <div className="space-y-2">
              {data.languages.map((l, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">{l.language}</span>
                  {l.proficiency && <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: accentColor + "15", color: accentColor }}>{l.proficiency}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null

      case 'education':
        return data.education?.length > 0 ? (
          <div key="education" className="mb-6">
            <SH>Education</SH>
            <div className="flex flex-col gap-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-gray-800">{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{edu.institution}</p>
                  <p className="text-[11px] text-gray-400">{fmt(edu.graduation_date)}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null

      case 'professional_bodies':
        return data.professional_bodies?.length > 0 ? (
          <div key="professional_bodies" className="mb-6">
            <SH>Memberships</SH>
            <div className="space-y-2">
              {data.professional_bodies.map((b, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-gray-700">{b.organization}</p>
                  {b.membership_type && <p className="text-[11px] text-gray-400">{b.membership_type}</p>}
                  {b.year_joined && <p className="text-[11px] text-gray-400">{b.year_joined}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null

      default: return null
    }
  }

  const renderMain = (key) => {
    switch (key) {
      case 'professional_summary':
        return data.professional_summary ? (
          <section key="professional_summary" className="mb-7">
            <MH>About</MH>
            <p className="text-sm text-gray-600 leading-relaxed">{data.professional_summary}</p>
          </section>
        ) : null

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience" className="mb-7">
            <MH>Experience</MH>
            <div className="flex flex-col gap-5">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-semibold text-gray-900">{exp.position}</p>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: accentColor + "15", color: accentColor }}>
                      {fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 mb-2">{exp.company}</p>
                  {exp.description && <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'project':
        return data.project?.length > 0 ? (
          <section key="project" className="mb-7">
            <MH>Projects</MH>
            <div className="flex flex-col gap-4">
              {data.project.map((p, i) => (
                <div key={i} className="rounded-lg p-3 border-l-[3px]" style={{ borderColor: accentColor, backgroundColor: accentColor + "08" }}>
                  <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                  {p.type && <span className="inline-block text-[10px] font-medium mt-0.5 mb-1" style={{ color: accentColor }}>{p.type}</span>}
                  {p.description && <p className="text-xs text-gray-600 leading-relaxed">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references" className="mb-7">
            <MH>References</MH>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.references.map((r, i) => (
                <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: accentColor + "08" }}>
                  <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                  {r.title && <p className="text-xs text-gray-600">{r.title}</p>}
                  {r.company && <p className="text-xs" style={{ color: accentColor }}>{r.company}</p>}
                  {r.email && <p className="text-[11px] text-gray-400 mt-1">{r.email}</p>}
                  {r.phone && <p className="text-[11px] text-gray-400">{r.phone}</p>}
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
      {/* Header */}
      <header className="px-8 py-7" style={{ backgroundColor: "#1e1e2e" }}>
        <div className="flex items-center gap-4">
          {pi.image && (
            <img src={typeof pi.image === 'object' ? URL.createObjectURL(pi.image) : pi.image}
              alt="Profile" className="w-14 h-14 rounded-full object-cover border-2 shrink-0" style={{ borderColor: accentColor }} />
          )}
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">{pi.full_name || "Your Name"}</h1>
            {pi.profession && <p className="text-sm mt-0.5 font-medium" style={{ color: accentColor }}>{pi.profession}</p>}
          </div>
        </div>
        {(pi.date_of_birth || pi.nationality) && (
          <div className="flex gap-4 text-xs text-gray-500 mt-2">
            {pi.date_of_birth && <span>Born: {pi.date_of_birth}</span>}
            {pi.nationality && <span>Nationality: {pi.nationality}</span>}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-400">
          {pi.email    && <span className="flex items-center gap-1.5"><Mail   size={11} style={{ color: accentColor }} />{pi.email}</span>}
          {pi.phone    && <span className="flex items-center gap-1.5"><Phone  size={11} style={{ color: accentColor }} />{pi.phone}</span>}
          {pi.location && <span className="flex items-center gap-1.5"><MapPin size={11} style={{ color: accentColor }} />{pi.location}</span>}
          {pi.linkedin && <span className="flex items-center gap-1.5"><Globe  size={11} style={{ color: accentColor }} />{pi.linkedin.replace("https://www.","").replace("https://","")}</span>}
          {pi.social_media?.map((s, i) => s.url && (
            <span key={i} className="flex items-center gap-1.5"><Globe size={11} style={{ color: accentColor }} />{s.platform ? `${s.platform}: ` : ""}{s.url.replace("https://","")}</span>
          ))}
        </div>
      </header>

      {/* Body */}
      <div className="flex">
        <main className="w-[65%] px-8 py-7 flex flex-col border-r border-gray-100">
          {mainSections.map(renderMain)}
        </main>
        <aside className="w-[35%] px-6 py-7 flex flex-col gap-0 bg-gray-50">
          {sidebarSections.map(renderSidebar)}
        </aside>
      </div>
    </div>
  )
}

export default TechTemplate
