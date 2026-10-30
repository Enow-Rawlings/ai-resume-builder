import Resume from '../models/Resume.js'
import ai from '../configs/ai.js'

// Model preference order — first available on the account will be used.
// llama-4-scout has the highest free-tier TPM (30k) and TPD (500k).
const MODEL_FALLBACKS = [
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
]

const getModel = () => process.env.GROQ_MODEL || MODEL_FALLBACKS[0]

// ── Prompt builder ────────────────────────────────────────────────────────
const makeSystemPrompt = (type) => {
  const base =
    'You are an expert resume writer. Return ONLY the requested content with absolutely no headings, labels, introductory phrases, or markdown formatting. Do not say "Here is..." or include any prefix. Output the content directly and nothing else.'

  const instructions = {
    summary:
      'Enhance the professional summary provided. Make it concise (2–3 sentences), impactful, and achievement-focused. Use strong action verbs. Return only the summary text — no label, no heading.',

    job:
      'Enhance the job description provided. Use strong action verbs, quantify achievements where possible, and format as 3–5 bullet points starting with "•". Return only the bullet points — no heading, no label.',

    resume: `Extract ALL structured data from the resume text and return it as a single valid JSON object.
Use exactly this schema — include every field that is present in the resume, leave missing fields as empty string/array:

{
  "personal_info": {
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": "",
    "date_of_birth": "",
    "nationality": ""
  },
  "professional_summary": "",
  "skills_categorized": [
    { "name": "Category Name", "skills": ["skill1", "skill2"] }
  ],
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM",
      "description": "",
      "is_current": false
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "YYYY-MM",
      "gpa": ""
    }
  ],
  "project": [
    { "name": "", "type": "", "description": "" }
  ],
  "languages": [
    { "language": "", "proficiency": "" }
  ],
  "references": [
    { "name": "", "title": "", "company": "", "email": "", "phone": "", "relationship": "" }
  ],
  "professional_bodies": [
    { "organization": "", "membership_type": "", "year_joined": "" }
  ]
}

Rules for skills_categorized:
- Group skills into meaningful categories based on how they appear in the resume.
- If the resume already has labelled groups (e.g. "Technical Skills", "Soft Skills", "Languages") use those as category names.
- If skills are listed without categories, infer logical groupings (e.g. "Programming Languages", "Frameworks", "Tools").
- Each category must have at least one skill.
- Do NOT put languages (spoken/written) in skills_categorized — put them in the languages array instead.

Return ONLY the JSON object — no extra text, no markdown fences.`,
  }

  return `${base}\n\n${instructions[type] || instructions.summary}`
}

// ── Response cleaner ──────────────────────────────────────────────────────
const cleanText = (text) => {
  if (!text) return ''
  return text
    .replace(/```json/gi, '')
    .replace(/```markdown/gi, '')
    .replace(/```text/gi, '')
    .replace(/```/g, '')
    .replace(/^#+\s.*$/gm, '')
    .replace(/^\*{1,2}[^*\n]+\*{1,2}:?\s*$/gm, '')
    .replace(/^Enhanced\s+[\w\s]+:?\s*/i, '')
    .replace(/^Here(?:'s| is)(?: the| an?)? enhanced[\w\s]*:?\s*/i, '')
    .replace(/^(?:Sure|Certainly|Of course)[!,.]?\s*/i, '')
    .replace(/^\n+/, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// ── Shared completion helper with model fallback ──────────────────────────
const complete = async (systemPrompt, userContent) => {
  const models = process.env.GROQ_MODEL
    ? [process.env.GROQ_MODEL, ...MODEL_FALLBACKS.filter(m => m !== process.env.GROQ_MODEL)]
    : MODEL_FALLBACKS

  let lastError
  for (const model of models) {
    try {
      const response = await ai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userContent },
        ],
        temperature: 0.4,
        max_tokens:  2048,
      })
      return cleanText(response.choices[0]?.message?.content || '')
    } catch (err) {
      // model_not_found or access error — try next model
      if (err?.status === 404 || err?.error?.code === 'model_not_found') {
        console.warn(`Model "${model}" not available, trying next...`)
        lastError = err
        continue
      }
      throw err   // other errors (auth, rate limit, etc.) — surface immediately
    }
  }
  throw lastError || new Error('No available AI model found')
}

// ── Controllers ───────────────────────────────────────────────────────────

// POST /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body
    if (!userContent?.trim()) {
      return res.status(400).json({ message: 'User content is required' })
    }
    const enhancedContent = await complete(makeSystemPrompt('summary'), userContent)
    return res.status(200).json({ enhancedContent })
  } catch (error) {
    console.error('AI summary error:', error)
    return res.status(500).json({ message: error.message || 'AI request failed' })
  }
}

// POST /api/ai/enhance-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body
    if (!userContent?.trim()) {
      return res.status(400).json({ message: 'User content is required' })
    }
    const enhancedContent = await complete(makeSystemPrompt('job'), userContent)
    return res.status(200).json({ enhancedContent })
  } catch (error) {
    console.error('AI job description error:', error)
    return res.status(500).json({ message: error.message || 'AI request failed' })
  }
}

// POST /api/ai/upload-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body
    const userId = req.userId

    if (!resumeText?.trim()) {
      return res.status(400).json({ message: 'Resume content is required' })
    }

    const raw = await complete(
      makeSystemPrompt('resume'),
      `Extract all data from this resume:\n\n${resumeText}`
    )

    // Parse JSON — try direct parse first, then extract from any surrounding text
    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      const match = raw.match(/\{[\s\S]+\}/)
      if (!match) throw new Error('AI did not return valid JSON. Please try again.')
      parsed = JSON.parse(match[0])
    }

    // ── Normalise skills_categorized ──────────────────────────────────────
    // The AI returns Array<{name, skills[]}> — validate and clean it up.
    // Fall back to putting everything in one "Skills" category if shape is wrong.
    let skillsCategorized = []

    if (Array.isArray(parsed.skills_categorized) && parsed.skills_categorized.length > 0) {
      skillsCategorized = parsed.skills_categorized
        .filter(cat => cat && typeof cat.name === 'string' && Array.isArray(cat.skills) && cat.skills.length > 0)
        .map(cat => ({ name: cat.name.trim(), skills: cat.skills.map(s => String(s).trim()).filter(Boolean) }))
    }

    // If AI returned old flat skills[] instead, migrate it
    if (skillsCategorized.length === 0 && Array.isArray(parsed.skills) && parsed.skills.length > 0) {
      skillsCategorized = [{ name: 'Skills', skills: parsed.skills.map(s => String(s).trim()).filter(Boolean) }]
    }

    // Build flat skills array for backward compat
    const flatSkills = skillsCategorized.flatMap(cat => cat.skills)

    // ── Build resume document ─────────────────────────────────────────────
    const resumeDoc = {
      userId,
      title: title || parsed.personal_info?.full_name || 'Imported Resume',
      personal_info:        parsed.personal_info        || {},
      professional_summary: parsed.professional_summary || '',
      skills:               flatSkills,
      skills_categorized:   skillsCategorized,
      experience:           Array.isArray(parsed.experience)          ? parsed.experience          : [],
      education:            Array.isArray(parsed.education)           ? parsed.education           : [],
      project:              Array.isArray(parsed.project)             ? parsed.project             : [],
      languages:            Array.isArray(parsed.languages)           ? parsed.languages           : [],
      references:           Array.isArray(parsed.references)          ? parsed.references          : [],
      professional_bodies:  Array.isArray(parsed.professional_bodies) ? parsed.professional_bodies : [],
    }

    const newResume = await Resume.create(resumeDoc)
    return res.status(201).json({ resumeId: newResume._id })
  } catch (error) {
    console.error('AI upload error:', error)
    return res.status(500).json({ message: error.message || 'Failed to process resume' })
  }
}
