// import OpenAI from "openai";

// const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase()

// const openaiClient = provider === 'openai' ? new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   baseURL: process.env.OPENAI_BASE_URL || process.env.OPEN_BASE_URL,
// }) : null

// const geminiClient = {
//   chat: {
//     completions: {
//       create: async ({model, messages, response_format}) => {
//         const apiKey = process.env.GOOGLE_API_KEY
//         if (!apiKey) throw new Error('GOOGLE_API_KEY is not set')

//         const preferredModel = model || process.env.GEMINI_MODEL

//         const prompt = (messages || [])
//           .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
//           .join('\n\n')

//         const callGenerateText = async (modelName) => {
//           const url = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(modelName)}:generateText?key=${encodeURIComponent(apiKey)}`
//           const body = {prompt: {text: prompt}}
//           const resp = await fetch(url, {
//             method: 'POST',
//             headers: {'Content-Type': 'application/json'},
//             body: JSON.stringify(body),
//           })
//           const json = await resp.json()
//           return {resp, json}
//         }

//         // Try preferred model first (if provided)
//         let resp, json
//         if (preferredModel) {
//           try {
//             ;({resp, json} = await callGenerateText(preferredModel))
//             if (resp.ok) {
//               // success
//             } else {
//               resp = null
//             }
//           } catch (e) {
//             resp = null
//           }
//         }

//         // If preferred model failed or not provided, list available models and pick one
//         if (!resp) {
//           const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(apiKey)}`
//           const listResp = await fetch(listUrl)
//           const listJson = await listResp.json()
//           const models = listJson.models || []

//           // find a model that supports generateText or has a text-like name
//           let chosen = models.find((m) => (m.supportedMethods && m.supportedMethods.includes('generateText')) || (/bison|text|gemini/i.test(m.name || m.displayName || '')))
//           if (!chosen && models.length) chosen = models[0]
//           if (!chosen) throw new Error('No available Gemini models found')

//           const chosenName = chosen.name || chosen.model || chosen.displayName
//           ;({resp, json} = await callGenerateText(chosenName))
//           if (!resp.ok) {
//             const message = json.error?.message || JSON.stringify(json)
//             throw new Error(`Gemini API error: ${message}`)
//           }
//         }

//         if (!resp.ok) {
//           const message = json.error?.message || JSON.stringify(json)
//           throw new Error(`Gemini API error: ${message}`)
//         }

//         // Normalize response: try multiple possible fields
//         const candidate = json.candidates?.[0]
//         const text = candidate?.content?.parts?.[0]?.text || candidate?.output || json.output?.text || candidate?.content || ''
//         if (!text) throw new Error(`No text in Gemini response: ${JSON.stringify(json)}`)

//         return {choices: [{message: {content: String(text)}}], raw: json}
//       },
//     },
//   },
// }

// const ai = provider === 'gemini' ? geminiClient : openaiClient

// export default ai



//VERSION 2

// 📄 Location: backend/configs/ai.js
// import OpenAI from "openai";
// import dotenv from "dotenv";
// dotenv.config();

// const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

// let ai;

// if (provider === 'openai') {
//   // Standard OpenAI initialization
//   ai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//     baseURL: process.env.OPENAI_BASE_URL || process.env.OPEN_BASE_URL, 
//   });
// } else {
//   // ✅ Gemini initialization using Google's official OpenAI Compatibility Layer
//   // This eliminates the buggy fetch loops and works perfectly with gemini-2.5-flash
//   ai = new OpenAI({
//     apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
//     baseURL: "https://googleapis.com" 
//   });
// }

// export default ai;


//VERSION 3

// 📄 Location: backend/configs/ai.js
/*
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

let ai;

if (provider === 'openai') {
  ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || process.env.OPEN_BASE_URL, 
  });
} else {
  // ✅ FIXED BASE URL FOR GEMINI
  // Removing the subfolder prevents the double '/chat/completions' routing issue
  ai = new OpenAI({
    apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
    baseURL: "https://googleapis.com" 
  });
}

export default ai;

*/

// 📄 Location: backend/configs/ai.js
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

// Initialize the Google client cleanly. It reads process.env.GEMINI_API_KEY automatically.
const ai = new GoogleGenAI({});

export default ai;

