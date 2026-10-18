import { Mail, Phone, MapPin, Globe } from "lucide-react";

/**
 * ExecutiveTemplate
 * Layout: narrow left sidebar (accent-coloured) + wide right main body.
 * Sidebar: contact details, skills, education.
 * Main: name/title header, summary, experience, projects.
 */
const ExecutiveTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const SectionHeading = ({ children }) => (
    <h2
      className="text-xs font-bold uppercase tracking-[0.18em] mb-3 pb-1 border-b"
      style={{ color: accentColor, borderColor: accentColor + "40" }}
    >
      {children}
    </h2>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800 flex min-h-[1000px]">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className="w-[30%] shrink-0 px-6 py-8 flex flex-col gap-7"
        style={{ backgroundColor: accentColor + "10" }}
      >
        {/* Profile photo placeholder / initials */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto"
          style={{ backgroundColor: accentColor }}
        >
          {(data.personal_info?.full_name || "?")
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>

        {/* Contact */}
        <div>
          <SectionHeading>Contact</SectionHeading>
          <div className="flex flex-col gap-2.5 text-xs text-gray-600">
            {data.personal_info?.email && (
              <div className="flex items-start gap-2">
                <Mail size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                <span className="break-all">{data.personal_info.email}</span>
              </div>
            )}
            {data.personal_info?.phone && (
              <div className="flex items-center gap-2">
                <Phone size={12} className="shrink-0" style={{ color: accentColor }} />
                <span>{data.personal_info.phone}</span>
              </div>
            )}
            {data.personal_info?.location && (
              <div className="flex items-center gap-2">
                <MapPin size={12} className="shrink-0" style={{ color: accentColor }} />
                <span>{data.personal_info.location}</span>
              </div>
            )}
            {data.personal_info?.linkedin && (
              <div className="flex items-start gap-2">
                <Globe size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                <span className="break-all text-[11px]">
                  {data.personal_info.linkedin.replace("https://www.", "").replace("https://", "")}
                </span>
              </div>
            )}
            {data.personal_info?.website && (
              <div className="flex items-start gap-2">
                <Globe size={12} className="mt-0.5 shrink-0" style={{ color: accentColor }} />
                <span className="break-all text-[11px]">
                  {data.personal_info.website.replace("https://", "")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <SectionHeading>Skills</SectionHeading>
            <div className="flex flex-col gap-1.5">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="text-xs text-gray-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <SectionHeading>Education</SectionHeading>
            <div className="flex flex-col gap-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-gray-800">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{edu.institution}</p>
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

      {/* ── Main body ────────────────────────────────────────────────── */}
      <main className="flex-1 px-8 py-8 flex flex-col gap-7">
        {/* Name & title */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          {data.personal_info?.profession && (
            <p
              className="text-base font-medium mt-1"
              style={{ color: accentColor }}
            >
              {data.personal_info.profession}
            </p>
          )}
          {/* Accent rule */}
          <div className="mt-3 h-1 w-16 rounded-full" style={{ backgroundColor: accentColor }} />
        </header>

        {/* Summary */}
        {data.professional_summary && (
          <section>
            <SectionHeading>Profile</SectionHeading>
            <p className="text-sm text-gray-700 leading-relaxed">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <SectionHeading>Experience</SectionHeading>
            <div className="flex flex-col gap-5">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: accentColor + "50" }}>
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-900">{exp.position}</h3>
                    <span className="text-[11px] text-gray-400 whitespace-nowrap ml-2">
                      {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-xs font-medium mb-1.5" style={{ color: accentColor }}>
                    {exp.company}
                  </p>
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
            <SectionHeading>Projects</SectionHeading>
            <div className="flex flex-col gap-4">
              {data.project.map((p, i) => (
                <div key={i} className="pl-4 border-l-2 border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-800">{p.name}</h3>
                  {p.description && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ExecutiveTemplate;
