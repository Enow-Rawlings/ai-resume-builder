// import React from 'react'
// import { useSelector } from 'react-redux'
// import { Loader2, Sparkles } from 'lucide-react'
// import api from '../configs/api.js'
// import { toast } from 'react-hot-toast'

// const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
//     const { token } = useSelector((state) => state.auth)
//     const [isGenerating, setIsGenerating] = React.useState(false)

//     const generateSummary = async () => {
//         try {
//             setIsGenerating(true)
//             const prompt = `Write a compelling professional summary for a resume based on the following information: ${JSON.stringify(
//                 data,
//             )}. Keep it concise (3-4 sentences) and focus on the most relevant achievements and skills.`
//             const response = await api.post(
//                 '/api/ai/enhance-pro-sum',
//                 { userContent: prompt },
//                 { headers: { Authorization: token } },
//             )
//             if (setResumeData) {
//                 setResumeData((prev) => ({ ...prev, professional_summary: response.data.enhancedContent }))
//             }
//         } catch (error) {
//             toast.error(error?.response?.data?.message || error.message)
//         } finally {
//             setIsGenerating(false)
//         }
//     }

//     const handleChange = (e) => {
//         if (onChange) onChange(e.target.value)
//         else if (setResumeData) setResumeData((prev) => ({ ...prev, professional_summary: e.target.value }))
//     }

//     return (
//         <div className="space-y-4">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">Professional Summary </h3>
//                     <p className="text-sm text-gray-500"> Add summary for your resume here</p>
//                 </div>
//                 <button
//                     disabled={isGenerating}
//                     onClick={generateSummary}
//                     className="flex items-center gap-2 px-3 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
//                 >
//                     {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
//                     {isGenerating ? 'Enhancing...' : 'AI Enhance'}
//                 </button>
//             </div>
//             <div className="mt-6">
//                 <textarea
//                     value={data || ''}
//                     onChange={handleChange}
//                     className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
//                     placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
//                 />
//                 <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center">
//                     Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
//                 </p>
//             </div>
//         </div>
//     )
// }

// export default ProfessionalSummaryForm




//vERSION 2

import React from 'react'
import { useSelector } from 'react-redux'
import { Loader2, Sparkles } from 'lucide-react'
import api from '../configs/api.js'
import { toast } from 'react-hot-toast'

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
    const { token } = useSelector((state) => state.auth)
    const [isGenerating, setIsGenerating] = React.useState(false)

   const generateSummary = async () => {
    try {
        setIsGenerating(true)
        const prompt = `Write a compelling professional summary for a resume based on the following information: ${JSON.stringify(data)}. Keep it concise (3-4 sentences) and focus on the most relevant achievements and skills.`
        
        const response = await api.post(
            '/api/ai/enhance-pro-sum',
            { userContent: prompt },
            { 
                headers: { Authorization: token },
                validateStatus: () => true // 🔍 Forces Axios to return the response even if it's a 400/500 error instead of throwing
            },
        )

        // 🔍 ADD THIS LOG LINE TO SEE EXACTLY WHAT ARRIVES
        console.log("RAW BACKEND RESPONSE OBJECT:", response);

        if (response.status !== 200) {
            throw new Error(response.data?.message || `Server responded with status code ${response.status}`);
        }
        
        if (setResumeData && response.data?.enhancedContent) {
            setResumeData((prev) => ({ ...prev, professional_summary: response.data.enhancedContent }))
            toast.success("Summary enhanced!")
        }
    } catch (error) {
        console.error("Caught Frontend Error:", error);
        toast.error(error.message || "Failed to generate summary.")
    } finally {
        setIsGenerating(false)
    }
}


    const handleChange = (e) => {
        if (onChange) onChange(e.target.value)
        else if (setResumeData) setResumeData((prev) => ({ ...prev, professional_summary: e.target.value }))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">Professional Summary </h3>
                    <p className="text-sm text-gray-500"> Add summary for your resume here</p>
                </div>
                <button
                    disabled={isGenerating}
                    onClick={generateSummary}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
                >
                    {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                    {isGenerating ? 'Enhancing...' : 'AI Enhance'}
                </button>
            </div>
            <div className="mt-6">
                <textarea
                    value={data || ''}
                    onChange={handleChange}
                    className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none h-32"
                    placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
                />
                <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center mt-2">
                    Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
                </p>
            </div>
        </div>
    )
}

export default ProfessionalSummaryForm
