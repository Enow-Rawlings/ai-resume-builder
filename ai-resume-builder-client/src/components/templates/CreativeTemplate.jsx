import { Mail, Phone, MapPin, Globe } from "lucide-react";

/**
 * CreativeTemplate
 * Layout: bold top accent bar spanning full width, centered header section,
 * then a clean single-column body with pill-style section badges and
 * timeline-style experience entries.
 * Suits designers, marketers, and creative roles.
 */
const CreativeTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const SectionBadge = ({ children }) => (
    <div className="flex items-center gap-3 mb-5">
      <span
        className="text-xs font-bold uppercase tracking-[0.2em] text-white px-4 py-1.5 rounded-full"
        style={{ backgroundColor: accentColor }}
      >
        {children}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-800">
      {/* ── Top accent bar ──────────────────────────────────────────── */}
      <div className="h-3 w-full" style={{ backgroundColor: accentColor }} />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="px-10 pt-8 pb-6 text-center">
        <h1 className="text-4xl font-black tracking-tight text-gray-900">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        {data.personal_info?.profession && (
          <p
            className="text-base font-semibold mt-1 uppercase tracking-[0.15em]"
            style={{ color: accentColor }}
          >
            {data.personal_info.profession}
          </p>
        )}

        {/* Contact row */}
        <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-gray-500">
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

        {/* Thin rule */}
        <div className="mt-6 mx-auto w-16 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} />
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <main className="px-10 pb-10 flex flex-col gap-8">
        {/* Summary */}
        {data.professional_summary && (
          <section>
            <SectionBadge>About Me</SectionBadge>
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
              {data.professional_summary}
            </p>
          </section>
        )}

        {/* Experience — timeline */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <SectionBadge>Experience</SectionBadge>
            <div className="relative flex flex-col gap-6 pl-5">
              {/* Vertical timeline line */}
              <div
                className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                style={{ backgroundColor: accentColor + "30" }}
              />
              {data.experience.map((exp, i) => (
                <div key={i} className="relative">
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900">{exp.position}</h3>
                    <span
                      className="text-[11px] font-medium ml-2 whitespace-nowrap"
                      style={{ color: accentColor }}
                    >
                      {formatDate(exp.start_date)} – {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{exp.company}</p>
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

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <SectionBadge>Skills</SectionBadge>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border"
                  style={{
                    color: accentColor,
                    borderColor: accentColor + "50",
                    backgroundColor: accentColor + "0c",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.project && data.project.length > 0 && (
          <section>
            <SectionBadge>Projects</SectionBadge>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.project.map((p, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 border"
                  style={{
                    borderColor: accentColor + "25",
                    backgroundColor: accentColor + "06",
                  }}
                >
                  <h3 className="text-sm font-bold text-gray-800">{p.name}</h3>
                  {p.type && (
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wide"
                      style={{ color: accentColor }}
                    >
                      {p.type}
                    </span>
                  )}
                  {p.description && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{p.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section>
            <SectionBadge>Education</SectionBadge>
            <div className="flex flex-col gap-4">
              {data.education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{edu.institution}</p>
                    {edu.gpa && <p className="text-xs text-gray-400 mt-0.5">GPA: {edu.gpa}</p>}
                  </div>
                  <span
                    className="text-[11px] font-medium whitespace-nowrap ml-4"
                    style={{ color: accentColor }}
                  >
                    {formatDate(edu.graduation_date)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── Bottom accent bar ───────────────────────────────────────── */}
      <div className="h-2 w-full" style={{ backgroundColor: accentColor + "60" }} />
    </div>
  );
};

export default CreativeTemplate;
