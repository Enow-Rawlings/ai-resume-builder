const DEFAULT_ORDER = ['professional_summary','experience','education','project','skills','languages','professional_bodies','references']

const MinimalTemplate = ({ data, accentColor }) => {
  const fmt = (d) => {
    if (!d) return ""
    const [y, m] = d.split("-")
    return new Date(y, m - 1).toLocaleDateString("en-US", { year: "numeric", month: "short" })
  }

  const H = ({ children }) => (
    <h2 className="text-xs uppercase tracking-[0.2em] font-semibold mb-5" style={{ color: accentColor }}>{children}</h2>
  )

  const order = data.section_order?.length ? data.section_order : DEFAULT_ORDER
  const pi = data.personal_info || {}

  const renderSection = (key) => {
    switch (key) {
      case 'professional_summary':
        return data.professional_summary ? (
          <section key="professional_summary" className="mb-8">
            <H>Profile</H>
            <p className="text-gray-700 leading-relaxed">{data.professional_summary}</p>
          </section>
        ) : null

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience" className="mb-8">
            <H>Experience</H>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="font-medium text-gray-900">{exp.position}</p>
                    <span className="text-xs text-gray-400">{fmt(exp.start_date)} – {exp.is_current ? "Present" : fmt(exp.end_date)}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-1">{exp.company}</p>
                  {exp.description && <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education" className="mb-8">
            <H>Education</H>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <div>
                    <p className="font-medium text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                    <p className="text-gray-500 text-sm">{edu.institution}</p>
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
          <section key="project" className="mb-8">
            <H>Projects</H>
            <div className="space-y-4">
              {data.project.map((p, i) => (
                <div key={i}>
                  <p className="font-medium text-gray-900">{p.name}</p>
                  {p.type && <p className="text-xs text-gray-400">{p.type}</p>}
                  {p.description && <p className="text-gray-600 text-sm mt-1">{p.description}</p>}
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
        return (
          <section key="skills" className="mb-8">
            <H>Skills</H>
            {hasCats ? (
              <div className="space-y-2">
                {sc.core?.length > 0 && (
                  <div className="flex gap-2 items-baseline">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 shrink-0 w-16">Core</span>
                    <p className="text-gray-700">{sc.core.join(" · ")}</p>
                  </div>
                )}
                {sc.technical?.length > 0 && (
                  <div className="flex gap-2 items-baseline">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 shrink-0 w-16">Tech</span>
                    <p className="text-gray-700">{sc.technical.join(" · ")}</p>
                  </div>
                )}
                {sc.soft?.length > 0 && (
                  <div className="flex gap-2 items-baseline">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 shrink-0 w-16">Soft</span>
                    <p className="text-gray-700">{sc.soft.join(" · ")}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-700">{flatSkills.join(" · ")}</p>
            )}
          </section>
        )
      }

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" className="mb-8">
            <H>Languages</H>
            <div className="space-y-1">
              {data.languages.map((l, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-800">{l.language}</span>
                  {l.proficiency && <span className="text-xs text-gray-400">{l.proficiency}</span>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'professional_bodies':
        return data.professional_bodies?.length > 0 ? (
          <section key="professional_bodies" className="mb-8">
            <H>Professional Bodies</H>
            <div className="space-y-2">
              {data.professional_bodies.map((b, i) => (
                <div key={i} className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{b.organization}</p>
                    {b.membership_type && <p className="text-xs text-gray-400">{b.membership_type}</p>}
                  </div>
                  {b.year_joined && <span className="text-xs text-gray-400 ml-4">{b.year_joined}</span>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references" className="mb-8">
            <H>References</H>
            <div className="grid grid-cols-2 gap-6">
              {data.references.map((r, i) => (
                <div key={i}>
                  <p className="font-medium text-gray-900">{r.name}</p>
                  {r.title && <p className="text-sm text-gray-600">{r.title}{r.company ? `, ${r.company}` : ""}</p>}
                  {r.relationship && <p className="text-xs text-gray-400">{r.relationship}</p>}
                  {r.email && <p className="text-xs text-gray-500 mt-1">{r.email}</p>}
                  {r.phone && <p className="text-xs text-gray-500">{r.phone}</p>}
                </div>
              ))}
            </div>
          </section>
        ) : null

      default: return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-thin tracking-wide mb-3">{pi.full_name || "Your Name"}</h1>
        {pi.profession && <p className="text-gray-500 mb-3">{pi.profession}</p>}

        {(pi.date_of_birth || pi.nationality) && (
          <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-2">
            {pi.date_of_birth && <span>Born: {pi.date_of_birth}</span>}
            {pi.nationality && <span>Nationality: {pi.nationality}</span>}
          </div>
        )}

        <div className="flex flex-wrap gap-5 text-sm text-gray-500">
          {pi.email    && <span>{pi.email}</span>}
          {pi.phone    && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.linkedin && <span>{pi.linkedin.replace("https://www.","").replace("https://","")}</span>}
          {pi.website  && <span>{pi.website.replace("https://","")}</span>}
          {pi.social_media?.map((s, i) => s.url && (
            <span key={i}>{s.platform ? `${s.platform}: ` : ""}{s.url.replace("https://","")}</span>
          ))}
        </div>
      </header>

      {order.map(renderSection)}
    </div>
  )
}

export default MinimalTemplate
