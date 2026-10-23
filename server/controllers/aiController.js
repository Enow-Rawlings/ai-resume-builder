import Resume from '../models/Resume.js'
import ai from '../configs/ai.js'

// Default model — llama-3.3-70b-versatile is Groq's fastest free-tier model
// Override via GROQ_MODEL env var if needed
const getModel = () => process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

// ── Prompt builder ────────────────────────────────────────────────────────
const makeSystemPrompt = (type) => {
  const base = 'You are an expert resume writer. Return ONLY the requested content with absolutely no headings, labels, introductory phrases, or markdown formatting. Do not say "Here is..." or include any prefix. Output the content directly and nothing else.'

  const instructions = {
    summary:
      'Enhance the professional summary provided. Make it concise (2–3 sentences), impactful, and achievement-focused. Use strong action verbs. Return only the summary text — no label, no heading.',
    job:
      'Enhance the job description provided. Use strong action verbs, quantify achievements where possible, and format as 3–5 bullet points starting with "•". Return only the bullet points — no heading, no label.',
    resume:
      'Extract structured data from the resume text and return it as valid JSON matching this schema: { personal_info: { full_name, profession, email, phone, location, linkedin, website }, professional_summary, skills: [], experience: [{ company, position, start_date, end_date, description, is_current }], education: [{ institution, degree, field, graduation_date, gpa }], project: [{ name, type, description }] }. Return only the JSON object — no extra text.',
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
    .replace(/^#+\s.*$/gm, '')                                             // # Markdown headings
    .replace(/^\*{1,2}[^*\n]+\*{1,2}:?\s*$/gm, '')                       // **Bold label:**
    .replace(/^Enhanced\s+[\w\s]+:?\s*/i, '')                             // "Enhanced Summary:"
    .replace(/^Here(?:'s| is)(?: the| an?)? enhanced[\w\s]*:?\s*/i, '')   // "Here is the enhanced..."
    .replace(/^(?:Sure|Certainly|Of course)[!,.]?\s*/i, '')               // Filler openers
    .replace(/^\n+/, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// ── Shared completion helper ──────────────────────────────────────────────
const complete = async (systemPrompt, userContent) => {
  const response = await ai.chat.completions.create({
    model: getModel(),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user',   content: userContent },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  })
  return cleanText(response.choices[0]?.message?.content || '')
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
      `Extract data from this resume:\n\n${resumeText}`
    )

    let parsedData
    try {
      parsedData = JSON.parse(raw)
    } catch {
      // Try to extract JSON from response if wrapped in any extra text
      const match = raw.match(/\{[\s\S]+\}/)
      if (!match) throw new Error('AI did not return valid JSON')
      parsedData = JSON.parse(match[0])
    }

    const newResume = await Resume.create({ userId, title, ...parsedData })
    return res.status(201).json({ resumeId: newResume._id })
  } catch (error) {
    console.error('AI upload error:', error)
    return res.status(500).json({ message: error.message || 'Failed to process resume' })
  }
}
