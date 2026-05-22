# 🤖 AI Resume Builder

An intuitive web application that leverages Artificial Intelligence to help users craft professional, ATS-friendly resumes in minutes. Users input their basic details and career goals, and the AI generates tailored professional summaries, work experience descriptions, and skill alignments.

## 🏗️ Architecture

This project is built as a monorepo containing two decoupled services:
* **`/client`**: The frontend user interface (hosted on Vercel).
* **`/server`**: The backend API handling AI generations and data logic (hosted on Render).

## ✨ Features
* **AI-Powered Generation:** Instantly creates bullet points, professional summaries, and keywords tailored to specific job roles.
* **Modern Templates:** Clean, ATS-compliant layouts designed for the modern job market.
* **Live Preview:** View resume changes in real-time as you fill out details.
* **Secure Backend:** Dedicated server handling secure API communication with AI models.

## 🛠️ Tech Stack

**Frontend (Client)**
* Framework: React.js / Vite / Next.js *(Choose your framework)*
* Styling: Tailwind CSS
* Deployment: Vercel

**Backend (Server)**
* Environment: Node.js
* Framework: Express.js
* AI Integration: OpenAI API / Gemini API *(Choose your AI provider)
* Database: MongoDB (NoSQL Database)
* Media Storage: ImageKit API (Cloud Storage & Optimization)
* Deployment: Render

##  Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   ```

2. **Setup the Server:**
   ```bash
   cd server
   npm install
   # Create a .env file with your PORT and AI API Keys
   npm start
   ```

3. **Setup the Client:**
   ```bash
   cd ../client
   npm install
   # Create a .env file with your VITE_API_URL or REACT_APP_API_URL
   npm run dev
   ```
