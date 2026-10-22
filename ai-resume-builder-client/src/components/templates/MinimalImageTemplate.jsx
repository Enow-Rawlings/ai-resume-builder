import { Globe, Mail, MapPin, Phone } from "lucide-react"

// Sections shown in sidebar vs main — can be overridden by section_order
const SIDEBAR_KEYS = new Set(['skills', 'languages', 'education', 'professional_bodies'])
const MAIN_KEYS = new Set(['professional_summary', 'experience', 'project', 'references'])
const DEFAULT_ORDER = ['professional_summary','experience','education','project','skills','languages','professional_bodies','references']

const MinimalImageTemplate = ({ data, accentColor }) => {
  const fmt = (d) => {
    if (!d) return ""
    const [y, m] = d.split("-")
    return new Date(y, m - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  const SH = ({ children }) => (
    <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + "40" }}>{children}</h2>
  )

  const MH = ({ children }) => (
    <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + "30" }}>{children}</h2>
  )

  const order = data.section_order?.length ? data.section_order : DEFAULT_ORDER
  const pi = data.personal_info || {}

  const sidebarSections = order.filter(k => SIDEBAR_KEYS.has(k))
  const mainSections = order.filter(k => MAIN_KEYS.has(k))

  const renderSidebar = (key) => {
    switch (key) {
      case 'skills':
        return data.skills?.length > 0 ? (
          <div key="skills" className="mb-5">
            <SH>Skills</SH>
            <div className="flex flex-col gap-1">
              {data.skills.map((s, i) => (
                <span key={i} className="text-xs py-0.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                  {s}
                </span>
              ))}
            </div>
          </div>
        ) : null

      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages" className="mb-5">
            <SH>Languages</SH>
            <div className="space-y-1.5">
              {data.languages.map((l, i) => (
                <div key={i}>
                  <p className="text-xs font-medium text-gray-800">{l.language}</p>
                  {l.proficiency && <p className="text-[11px] text-gray-400">{l.proficiency}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null

      case 'education':
        return data.education?.length > 0 ? (
          <div key="education" className="mb-5">
            <SH>Education</SH>
            <div className="space-y-3">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-gray-800">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                  <p className="text-[11px]" style={{ color: accentColor }}>{edu.institution}</p>
                  <p className="text-[11px] text-gray-400">{fmt(edu.graduation_date)}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null

      case 'professional_bodies':
        return data.professional_bodies?.length > 0 ? (
          <div key="professional_bodies" className="mb-5">
            <SH>Memberships</SH>
            <div className="space-y-2">
              {data.professional_bodies.map((b, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-gray-800">{b.organization}</p>
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
          <section key="professional_summary" className="mb-6">
            <MH>Profile</MH>
            <p className="text-sm text-gray-700 leading-relaxed">{data.professional_summary}</p>
          </section>
        ) : null

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience" className="mb-6">
            <MH>Experience</MH>
            <div className="space-y-4">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm text-gray-900">{exp.position}</p>
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}</span>
                  </div>
                  <p className="text-xs mb-1" style={{ color: accentColor }}>{exp.company}</p>
                  {exp.description && <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'project':
        return data.project?.length > 0 ? (
          <section key="project" className="mb-6">
            <MH>Projects</MH>
            <div className="space-y-3">
              {data.project.map((p, i) => (
                <div key={i}>
                  <p className="font-semibold text-sm text-gray-900">{p.name}</p>
                  {p.type && <p className="text-xs" style={{ color: accentColor }}>{p.type}</p>}
                  {p.description && <p className="text-xs text-gray-600 mt-0.5">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references" className="mb-6">
            <MH>References</MH>
            <div className="space-y-3">
              {data.references.map((r, i) => (
                <div key={i}>
                  <p className="font-semibold text-sm text-gray-900">{r.name}</p>
                  {r.title && <p className="text-xs text-gray-600">{r.title}{r.company ? `, ${r.company}` : ""}</p>}
                  {r.email && <p className="text-xs text-gray-400">{r.email}</p>}
                  {r.phone && <p className="text-xs text-gray-400">{r.phone}</p>}
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
      <header className="p-6 border-b border-gray-100 flex items-center gap-5" style={{ backgroundColor: accentColor + "08" }}>
        {pi.image ? (
          <img src={typeof pi.image === 'object' ? URL.createObjectURL(pi.image) : pi.image}
            alt="Profile" className="w-20 h-20 rounded-full object-cover shrink-0 border-2" style={{ borderColor: accentColor }} />
        ) : (
          <div className="w-20 h-20 rounded-full shrink-0 flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: accentColor }}>
            {(pi.full_name || "?").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{pi.full_name || "Your Name"}</h1>
          {pi.profession && <p className="text-gray-600 text-sm mt-0.5">{pi.profession}</p>}
          {(pi.date_of_birth || pi.nationality) && (
            <div className="flex gap-4 text-xs text-gray-400 mt-1">
              {pi.date_of_birth && <span>Born: {pi.date_of_birth}</span>}
              {pi.nationality && <span>Nationality: {pi.nationality}</span>}
            </div>
          )}
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="grid grid-cols-3">
        {/* Sidebar */}
        <aside className="col-span-1 px-5 py-6 border-r border-gray-100" style={{ backgroundColor: accentColor + "06" }}>
          {/* Contact */}
          <div className="mb-5">
            <SH children="Contact" />
            <div className="space-y-2 text-xs text-gray-600">
              {pi.email    && <div className="flex items-start gap-1.5"><Mail   className="size-3 mt-0.5 shrink-0" style={{ color: accentColor }} /><span className="break-all">{pi.email}</span></div>}
              {pi.phone    && <div className="flex items-center gap-1.5"><Phone  className="size-3 shrink-0" style={{ color: accentColor }} /><span>{pi.phone}</span></div>}
              {pi.location && <div className="flex items-center gap-1.5"><MapPin className="size-3 shrink-0" style={{ color: accentColor }} /><span>{pi.location}</span></div>}
              {pi.linkedin && <div className="flex items-start gap-1.5"><Globe  className="size-3 mt-0.5 shrink-0" style={{ color: accentColor }} /><span className="break-all text-[11px]">{pi.linkedin.replace("https://www.","").replace("https://","")}</span></div>}
              {pi.social_media?.map((s, i) => s.url && (
                <div key={i} className="flex items-start gap-1.5"><Globe className="size-3 mt-0.5 shrink-0" style={{ color: accentColor }} /><span className="break-all text-[11px]">{s.platform ? `${s.platform}: ` : ""}{s.url.replace("https://","")}</span></div>
              ))}
            </div>
          </div>
          {sidebarSections.map(renderSidebar)}
        </aside>

        {/* Main */}
        <main className="col-span-2 px-6 py-6">
          {mainSections.map(renderMain)}
        </main>
      </div>
    </div>
  )
}

export default MinimalImageTemplate
