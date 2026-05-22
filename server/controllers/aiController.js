// import Resume from "../models/Resume.js"
// import ai from "../configs/ai.js"

// const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase()
// const selectedModel = provider === 'gemini' 
//   ? (process.env.GEMINI_MODEL || "gemini-2.5-flash")
//   : (process.env.OPENAI_MODEL || "gpt-4o-mini")

// console.log(`AI Provider: ${provider}, Model: ${selectedModel}`)

// const getAiModel = () => selectedModel

// const makePrompt = ({type, content}) => {
//   const base = "you are an expert in resume writing and enhancement."
//   const instructions = {
//     summary: "You will be given a professional summary from a resume and your task is to enhance it by making it more concise, impactful, and tailored to the job description. Use action verbs, quantify achievements where possible, and focus on the most relevant skills and experiences. The enhanced professional summary should be no more than 1-2 sentences long.",
//     job: "You will be given a job description from a resume and your task is to enhance it by making it more concise, impactful, and tailored to the job description. Use action verbs, quantify achievements where possible, and focus on the most relevant skills and experiences. The enhanced job description should be no more than 3-5 bullet points long.",
//     resume: "You will be given a resume in JSON format and your task is to enhance it by making it more concise, impactful, and tailored to the job description. Use action verbs, quantify achievements where possible, and focus on the most relevant skills and experiences. The enhanced resume should be in JSON format and follow the same structure as the input resume."
//   }

//   return `${base} ${instructions[type] || instructions.summary}`
// }

// const handleOpenAIError = (res, error) => {
//   const message = error?.message || "Unknown error"
//   return res.status(400).json({message, model: selectedModel})
// }

// export const enhanceProfessionalSummary = async (req, res) => {
//   try {
//     const {userContent} = req.body
//     if (!userContent) {
//       return res.status(400).json({message: "User content is required"})
//     }

//     const response = await ai.chat.completions.create({
//       model: getAiModel(),
//       messages: [
//         {role: "system", content: makePrompt({type: "summary"})},
//         {role: "user", content: userContent}
//       ]
//     })

//     const enhancedContent = response.choices?.[0]?.message?.content || ""
//     return res.status(200).json({enhancedContent})
//   } catch (error) {
//     return handleOpenAIError(res, error)
//   }
// }

// export const enhanceJobDescription = async (req, res) => {
//   try {
//     const {userContent} = req.body
//     if (!userContent) {
//       return res.status(400).json({message: "User content is required"})
//     }

//     const response = await ai.chat.completions.create({
//       model: getAiModel(),
//       messages: [
//         {role: "system", content: makePrompt({type: "job"})},
//         {role: "user", content: userContent}
//       ]
//     })

//     const enhancedContent = response.choices?.[0]?.message?.content || ""
//     return res.status(200).json({enhancedContent})
//   } catch (error) {
//     return handleOpenAIError(res, error)
//   }
// }

// export const uploadResume = async (req, res) => {
//   try {
//     const {resumeText, title} = req.body
//     const userId = req.userId

//     if (!resumeText) {
//       return res.status(400).json({message: "Resume content is required"})
//     }

//     const response = await ai.chat.completions.create({
//       model: getAiModel(),
//       messages: [
//         {role: "system", content: makePrompt({type: "resume"})},
//         {role: "user", content: `Extract data from this resume: ${resumeText}\nProvide data in valid JSON format with no additional text before or after.`}
//       ],
//       response_format: {
//         type: "json_object"
//       }
//     })

//     const extractedData = response.choices?.[0]?.message?.content || ""
//     const parsedData = JSON.parse(extractedData)

//     const newResume = await Resume.create({userId, title, ...parsedData})
//     return res.status(201).json({resumeId: newResume._id})
//   } catch (error) {
//     return handleOpenAIError(res, error)
//   }
// }



//VERSION 2
/*
import Resume from "../models/Resume.js"
import ai from "../configs/ai.js"

const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase()
const selectedModel = provider === 'gemini' 
  ? (process.env.GEMINI_MODEL || "gemini-2.5-flash")
  : (process.env.OPENAI_MODEL || "gpt-4o-mini")

console.log(`AI Provider: ${provider}, Model: ${selectedModel}`)

const getAiModel = () => selectedModel

const makePrompt = ({type, content}) => {
  const base = "you are an expert in resume writing and enhancement."
  const instructions = {
    summary: "You will be given a professional summary from a resume and your task is to enhance it by making it more concise, impactful, and tailored to the job description. Use action verbs, quantify achievements where possible, and focus on the most relevant skills and experiences. The enhanced professional summary should be no more than 1-2 sentences long.",
    job: "You will be given a job description from a resume and your task is to enhance it by making it more concise, impactful, and tailored to the job description. Use action verbs, quantify achievements where possible, and focus on the most relevant skills and experiences. The enhanced job description should be no more than 3-5 bullet points long.",
    resume: "You will be given a resume in JSON format and your task is to enhance it by making it more concise, impactful, and tailored to the job description. Use action verbs, quantify achievements where possible, and focus on the most relevant skills and experiences. The enhanced resume should be in JSON format and follow the same structure as the input resume."
  }

  return `${base} ${instructions[type] || instructions.summary}`
}

const handleOpenAIError = (res, error) => {
  const message = error?.message || "Unknown error"
  return res.status(400).json({message, model: selectedModel})
}

// ✅ HELPER FUNCTION: Safely strips markdown blocks so JSON parsing doesn't break
const cleanAiText = (text) => {
  if (!text) return "";
  return text
    .replace(/```json/ig, '')
    .replace(/```markdown/ig, '')
    .replace(/```text/ig, '')
    .replace(/```/g, '')
    .trim();
}

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const {userContent} = req.body
    if (!userContent) {
      return res.status(400).json({message: "User content is required"})
    }

    const response = await ai.chat.completions.create({
      model: getAiModel(),
      messages: [
        {role: "system", content: makePrompt({type: "summary"})},
        {role: "user", content: userContent}
      ]
    })

    let enhancedContent = response.choices?.[0]?.message?.content || ""
    enhancedContent = cleanAiText(enhancedContent) // ✅ Sanitize text output

    return res.status(200).json({enhancedContent})
  } catch (error) {
    return handleOpenAIError(res, error)
  }
}

export const enhanceJobDescription = async (req, res) => {
  try {
    const {userContent} = req.body
    if (!userContent) {
      return res.status(400).json({message: "User content is required"})
    }

    const response = await ai.chat.completions.create({
      model: getAiModel(),
      messages: [
        {role: "system", content: makePrompt({type: "job"})},
        {role: "user", content: userContent}
      ]
    })

    let enhancedContent = response.choices?.[0]?.message?.content || ""
    enhancedContent = cleanAiText(enhancedContent) // ✅ Sanitize text output

    return res.status(200).json({enhancedContent})
  } catch (error) {
    return handleOpenAIError(res, error)
  }
}

export const uploadResume = async (req, res) => {
  try {
    const {resumeText, title} = req.body
    const userId = req.userId

    if (!resumeText) {
      return res.status(400).json({message: "Resume content is required"})
    }

    const response = await ai.chat.completions.create({
      model: getAiModel(),
      messages: [
        {role: "system", content: makePrompt({type: "resume"})},
        {role: "user", content: `Extract data from this resume: ${resumeText}\nProvide data in valid JSON format with no additional text before or after.`}
      ],
      response_format: {
        type: "json_object"
      }
    })

    const extractedData = response.choices?.[0]?.message?.content || ""
    
    // ✅ FIX: Clean the data string BEFORE passing it into JSON.parse
    const cleanedJsonString = cleanAiText(extractedData)
    const parsedData = JSON.parse(cleanedJsonString)

    const newResume = await Resume.create({userId, title, ...parsedData})
    return res.status(201).json({resumeId: newResume._id})
  } catch (error) {
    console.error("Upload Resume parsing error:", error)
    return handleOpenAIError(res, error)
  }
}

*/

//VERSION 3

// 📄 Location: backend/controllers/aiController.js
import Resume from "../models/Resume.js"
import ai from "../configs/ai.js"

const getAiModel = () => process.env.GEMINI_MODEL || "gemini-2.5-flash";

const makePrompt = ({type}) => {
  const base = "you are an expert in resume writing and enhancement."
  const instructions = {
    summary: "You will be given a professional summary from a resume and your task is to enhance it by making it more concise, impactful, and tailored to the job description. Use action verbs, quantify achievements where possible, and focus on the most relevant skills and experiences. The enhanced professional summary should be no more than 1-2 sentences long.",
    job: "You will be given a job description from a resume and your task is to enhance it by making it more concise, impactful, and tailored to the job description. Use action verbs, quantify achievements where possible, and focus on the most relevant skills and experiences. The enhanced job description should be no more than 3-5 bullet points long.",
    resume: "You will be given a resume in JSON format and your task is to enhance it by making it more concise, impactful, and tailored to the job description. Use action verbs, quantify achievements where possible, and focus on the most relevant skills and experiences. The enhanced resume should be in JSON format and follow the same structure as the input resume."
  }
  return `${base} ${instructions[type] || instructions.summary}`;
}

const cleanAiText = (text) => {
  if (!text) return "";
  return text
    .replace(/```json/ig, '')
    .replace(/```markdown/ig, '')
    .replace(/```text/ig, '')
    .replace(/```/g, '')
    .trim();
}

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "User content is required" });
    }

    // ✅ NATIVE GOOGLE SDK FORMAT
    const response = await ai.models.generateContent({
      model: getAiModel(),
      contents: `${makePrompt({ type: "summary" })}\n\nUser Input: ${userContent}`
    });

    const enhancedContent = cleanAiText(response.text || "");
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(400).json({ message: error.message || "AI failed" });
  }
}

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status(400).json({ message: "User content is required" });
    }

    // ✅ NATIVE GOOGLE SDK FORMAT
    const response = await ai.models.generateContent({
      model: getAiModel(),
      contents: `${makePrompt({ type: "job" })}\n\nUser Input: ${userContent}`
    });

    const enhancedContent = cleanAiText(response.text || "");
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(400).json({ message: error.message || "AI failed" });
  }
}

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Resume content is required" });
    }

    // ✅ NATIVE GOOGLE SDK JSON FORCED CONFIG
    const response = await ai.models.generateContent({
      model: getAiModel(),
      contents: `${makePrompt({ type: "resume" })}\n\nExtract data from this resume text: ${resumeText}`,
      config: {
        responseMimeType: "application/json" // Automatically structuralizes it natively
      }
    });

    const cleanedJsonString = cleanAiText(response.text || "");
    const parsedData = JSON.parse(cleanedJsonString);

    const newResume = await Resume.create({ userId, title, ...parsedData });
    return res.status(201).json({ resumeId: newResume._id });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(400).json({ message: error.message || "Processing failed" });
  }
}
