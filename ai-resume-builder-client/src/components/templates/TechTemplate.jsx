import { Mail, Phone, MapPin, Globe, Code2 } from "lucide-react";

/**
 * TechTemplate
 * Layout: full-width dark header band with name + contact row,
 * then a 2-col body (left = 65% main, right = 35% sidebar with skills + education).
 * Designed for developers / technical roles.
 */
const TechTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const MainHeading = ({ children }) => (
    <div className="flex items-center gap-2 mb-4">
      <Code2 size={14} style={{ color: accentColor }} />
      <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700">{children}</h2>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );

  const SideHeading = ({ children }) => (
    <h2
      className="text-[11px] font-bold uppercase tracking-widest mb-3"
      style={{ color: accentColor }}
    >
      {children}
    </h2>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="px-8 py-7" style={{ backgroundColor: "#1e1e2e" }}>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        {data.personal_info?.profession && (
          <p className="text-sm mt-1 font-medium" style={{ color: accentColor }}>
            {data.personal_info.profession}
          </p>
        )}

        {/* Contact row */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-400">
          {data.personal_info?.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={11} style={{ color: accentColor }} />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={11} style={{ color: accentColor }} />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={11} style={{ color: accentColor }} />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-1.5">
              <Globe size={11} style={{ color: accentColor }} />
              <span className="break-all">
                {data.personal_info.linkedin.replace("https://www.", "").replace("https://", "")}
              </span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-1.5">
              <Globe size={11} style={{ color: accentColor }} />
              <span className="break-all">
                {data.personal_info.website.replace("https://", "")}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="flex">
        {/* Main — 65% */}
        <main className="w-[65%] px-8 py-7 flex flex-col gap-7 border-r border-gray-100">
          {/* Summary */}
          {data.professional_summary && (
            <section>
              <MainHeading>About</MainHeading>
              <p className="text-sm text-gray-600 leading-relaxed">
                {data.professional_summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <MainHeading>Experience</MainHeading>
              <div className="flex flex-col gap-5">
                {data.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-semibold text-gray-900">{exp.position}</h3>
                      <span
                        className="text-[11px] font-mono px-2 py-0.5 rounded"
                        style={{ backgroundColor: accentColor + "15", color: accentColor }}
                      >
                        {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 mb-2">{exp.company}</p>
                    {exp.description && (
                      <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.project && data.project.length > 0 && (
            <section>
              <MainHeading>Projects</MainHeading>
              <div className="flex flex-col gap-4">
                {data.project.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3 border-l-[3px]"
                    style={{
                      borderColor: accentColor,
                      backgroundColor: accentColor + "08",
                    }}
                  >
                    <h3 className="text-sm font-semibold text-gray-800">{p.name}</h3>
                    {p.type && (
                      <span
                        className="inline-block text-[10px] font-medium mt-0.5 mb-1"
                        style={{ color: accentColor }}
                      >
                        {p.type}
                      </span>
                    )}
                    {p.description && (
                      <p className="text-xs text-gray-600 leading-relaxed">{p.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Sidebar — 35% */}
        <aside className="w-[35%] px-6 py-7 flex flex-col gap-6 bg-gray-50">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div>
              <SideHeading>Tech Stack</SideHeading>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-md border"
                    style={{
                      color: accentColor,
                      borderColor: accentColor + "40",
                      backgroundColor: accentColor + "0d",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div>
              <SideHeading>Education</SideHeading>
              <div className="flex flex-col gap-4">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <p className="text-xs font-semibold text-gray-800">
                      {edu.degree} {edu.field && `— ${edu.field}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{edu.institution}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formatDate(edu.graduation_date)}
                      {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default TechTemplate;
