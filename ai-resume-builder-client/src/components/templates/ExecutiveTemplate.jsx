import { Globe, Mail, MapPin, Phone } from "lucide-react"

const SIDEBAR_KEYS = new Set(['skills', 'languages', 'education', 'professional_bodies'])
const MAIN_KEYS = new Set(['professional_summary', 'experience', 'project', 'references'])
const DEFAULT_ORDER = ['professional_summary','experience','education','project','skills','languages','professional_bodies','references']

const ExecutiveTemplate = ({ data, accentColor }) => {
  const fmt = (d) => {
    if (!d) return ""
    const [y, m] = d.split("-")
    return new Date(y, m - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  const SH = ({ children }) => (
    <h2 className="text-xs font-bold uppercase tracking-[0.18em] mb-3 pb-1 border-b" style={{ color: accentColor, borderColor: accentColor + "40" }}>{children}</h2>
  )

  const order = data.section_order?.length ? data.section_order : DEFAULT_ORDER
  const pi = data.personal_info || {}
  const sidebarSections = order.filter(k => SIDEBAR_KEYS.has(k))
  const mainSections = order.filter(k => MAIN_KEYS.has(k))

  const renderSidebar = (key) => {
    switch (key) {
      case 'skills': {
        const sc = data.skills_categorized
        const hasCats = sc && (sc.core?.length > 0 || sc.technical?.length > 0 || sc.soft?.length > 0)
        const flatSkills = data.skills || []
        if (!hasCats && flatSkills.length === 0) return null
        const Bullet = ({ s }) => (
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
            <span className="text-xs text-gray-700">{s}</span>
          </div>
        )
        return (
          <div key="skills" className="mb-6">
            <SH>Skills</SH>
            {hasCats ? (
              <div className="space-y-3">
                {sc.core?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Core</p>
                    <div className="flex flex-col gap-1.5">{sc.core.map((s, i) => <Bullet key={i} s={s} />)}</div>
                  </div>
                )}
                {sc.technical?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Technical</p>
                    <div className="flex flex-col gap-1.5">{sc.technical.map((s, i) => <Bullet key={i} s={s} />)}</div>
                  </div>
                )}
                {sc.soft?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">Soft</p>
                    <div className="flex flex-col gap-1.5">{sc.soft.map((s, i) => <Bullet key={i} s={s} />)}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">{flatSkills.map((s, i) => <Bullet key={i} s={s} />)}</div>
            )}
          </div>
        )
      }

      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages" className="mb-6">
            <SH>Languages</SH>
            <div className="space-y-2">
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
          <div key="education" className="mb-6">
            <SH>Education</SH>
            <div className="flex flex-col gap-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-gray-800">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{edu.institution}</p>
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
            <SH>Profile</SH>
            <p className="text-sm text-gray-700 leading-relaxed">{data.professional_summary}</p>
          </section>
        ) : null

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience" className="mb-6">
            <SH>Experience</SH>
            <div className="flex flex-col gap-5">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: accentColor + "50" }}>
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-sm font-semibold text-gray-900">{exp.position}</p>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">{fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}</span>
                  </div>
                  <p className="text-xs font-medium mb-1.5" style={{ color: accentColor }}>{exp.company}</p>
                  {exp.description && <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'project':
        return data.project?.length > 0 ? (
          <section key="project" className="mb-6">
            <SH>Projects</SH>
            <div className="flex flex-col gap-4">
              {data.project.map((p, i) => (
                <div key={i} className="pl-4 border-l-2 border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                  {p.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references" className="mb-6">
            <SH>References</SH>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.references.map((r, i) => (
                <div key={i} className="text-sm">
                  <p className="font-semibold text-gray-900">{r.name}</p>
                  {r.title && <p className="text-xs text-gray-600">{r.title}{r.company ? `, ${r.company}` : ""}</p>}
                  {r.relationship && <p className="text-[11px] text-gray-400">{r.relationship}</p>}
                  {r.email && <p className="text-[11px] text-gray-500 mt-0.5">{r.email}</p>}
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
    <div className="max-w-4xl mx-auto bg-white text-gray-800 flex min-h-[1000px]">
      {/* Sidebar */}
      <aside className="w-[30%] shrink-0 px-6 py-8 flex flex-col gap-1" style={{ backgroundColor: accentColor + "10" }}>
        {/* Avatar */}
        <div className="mb-6">
          {pi.image ? (
            <img src={typeof pi.image === 'object' ? URL.createObjectURL(pi.image) : pi.image}
              alt="Profile" className="w-20 h-20 rounded-full object-cover mx-auto border-2" style={{ borderColor: accentColor }} />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto" style={{ backgroundColor: accentColor }}>
              {(pi.full_name || "?").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="mb-6">
          <SH>Contact</SH>
          <div className="flex flex-col gap-2.5 text-xs text-gray-600">
            {pi.email    && <div className="flex items-start gap-2"><Mail   size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} /><span className="break-all">{pi.email}</span></div>}
            {pi.phone    && <div className="flex items-center gap-2"><Phone  size={12} className="shrink-0" style={{ color: accentColor }} /><span>{pi.phone}</span></div>}
            {pi.location && <div className="flex items-center gap-2"><MapPin size={12} className="shrink-0" style={{ color: accentColor }} /><span>{pi.location}</span></div>}
            {pi.linkedin && <div className="flex items-start gap-2"><Globe  size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} /><span className="break-all text-[11px]">{pi.linkedin.replace("https://www.","").replace("https://","")}</span></div>}
            {pi.social_media?.map((s, i) => s.url && (
              <div key={i} className="flex items-start gap-2"><Globe size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} /><span className="break-all text-[11px]">{s.platform ? `${s.platform}: ` : ""}{s.url.replace("https://","")}</span></div>
            ))}
          </div>
        </div>

        {/* Personal details */}
        {(pi.date_of_birth || pi.nationality) && (
          <div className="mb-6">
            <SH>Personal</SH>
            <div className="space-y-1.5 text-xs text-gray-600">
              {pi.date_of_birth && <div><span className="font-medium text-gray-500">DOB: </span>{pi.date_of_birth}</div>}
              {pi.nationality && <div><span className="font-medium text-gray-500">Nationality: </span>{pi.nationality}</div>}
            </div>
          </div>
        )}

        {sidebarSections.map(renderSidebar)}
      </aside>

      {/* Main */}
      <main className="flex-1 px-8 py-8 flex flex-col gap-1">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{pi.full_name || "Your Name"}</h1>
          {pi.profession && <p className="text-base font-medium mt-1" style={{ color: accentColor }}>{pi.profession}</p>}
          <div className="mt-3 h-1 w-16 rounded-full" style={{ backgroundColor: accentColor }} />
        </header>
        {mainSections.map(renderMain)}
      </main>
    </div>
  )
}

export default ExecutiveTemplate
