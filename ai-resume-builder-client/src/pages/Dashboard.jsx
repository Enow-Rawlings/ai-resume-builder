import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from "lucide-react";
import React from "react";
import { dummyResumeData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js?url';
import { toast } from "react-hot-toast";
import api from "../configs/api.js";
import { useSelector } from "react-redux";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const extractTextFromPdf = async (file) => {
  if (!file) return '';
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let text = '';

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex++) {
    const page = await pdf.getPage(pageIndex);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    text += pageText + '\n';
  }

  return text.trim();
};

const Dashboard = () => {
  const colors = [
    "#933ea0",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  const {user, token} = useSelector((state) => state.auth);
  const [allResumes, setAllResumes] = React.useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [testimonial, setTestimonial] = useState('')
  const [testimonialSaved, setTestimonialSaved] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const loadAllResumes = async () => {
    // setAllResumes(dummyResumeData);
    try {
      const {data} = await api.get('/api/users/resumes', {headers: {Authorization: token}})
      setAllResumes(data.resumes) 
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  };

  const createResume = async (event)=>{
    try {
      event.preventDefault()
      const {data} = await api.post('/api/resumes/create', {title}, {headers: {Authorization: token}})
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } 

    // event.preventDefault()
    // setShowCreateResume(false)
    // navigate(`/app/builder/res123`)
  }

  const uploadResume = async (event) =>{
    event.preventDefault()
   setIsLoading(true)
   try {
    const resumeText = await extractTextFromPdf(resume)
    const {data} = await api.post('/api/ai/upload-resume', {title, resumeText}, {headers: {Authorization: token}})
    // setAllResumes([...allResumes, data.resume])
    setTitle('')
    setResume(null)
    setShowUploadResume(false)
    navigate(`/app/builder/${data.resumeId}`) 
   } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
   } 
    setIsLoading(false)
  }

  const saveTestimonial = (event) => {
    event.preventDefault()
    if (!testimonial.trim()) {
      toast.error('Please enter a short testimonial before submitting.')
      return
    }

    const savedTestimonials = JSON.parse(localStorage.getItem('cvpilot_testimonials') || '[]')
    const newTestimonial = {
      id: Date.now(),
      name: user?.name || 'Anonymous',
      handle: `@${(user?.name || 'anonymous').replace(/\s+/g, '').toLowerCase()}`,
      message: testimonial.trim(),
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Anonymous')}&background=9400D3&color=ffffff&rounded=true`,
    }

    localStorage.setItem('cvpilot_testimonials', JSON.stringify([newTestimonial, ...savedTestimonials].slice(0, 12)))
    setTestimonial('')
    setTestimonialSaved(true)
    setTimeout(() => setTestimonialSaved(false), 3000)
  }

  const editTitle = async (event)=>{
    try {
    event.preventDefault();
      const {data} = await api.put(`/api/resumes/update`, {resumeId: editResumeId, resumeData: { title }}, {headers: {Authorization: token}})
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? {...resume, title} : resume))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }
  const deleteResume = async (resumeId)=>{
    try {
       const confirm = window.confirm("Are you sure you want to delete this resume ?")
   if(confirm){
    const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, {headers: {Authorization: token}})
    setAllResumes(prev => prev.filter(resume => resume._id !== resumeId))
    toast.success(data.message)
   }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
      
    }
   
  }

  React.useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-2xl font-medium mb-6 bg-linear-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name || 'User'}
        </p>

        <div className="flex gap-4">
          <button onClick={()=>{setShowCreateResume(true)}} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border boder-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <PlusIcon className="size-11 transition-all duration-300 p-2.5 bg-linear-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>
          <button onClick={()=>{ setShowUploadResume(true)}} className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border boder-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <UploadCloudIcon className="size-11 transition-all duration-300 p-2.5 bg-linear-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-76.25" />

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button
                key={index} onClick={()=>{ navigate(`/app/builder/${resume._id}`)}}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background:
                    `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40"
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transitiion-all "
                  style={{ color: baseColor }}
                />
                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>
                <p
                  className="absolute bottom-1 text-[11px] text-slate-500 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div onClick={e=> e.stopPropagation()} className="absolute top-1 right-1 group-hover:fkex items-center hidden">
                  <TrashIcon onClick={()=>{deleteResume(resume._id)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                <PencilIcon onClick={()=>{setEditResumeId(resume._id); setTitle(resume.title)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Share your experience</h2>
          <p className="text-sm text-slate-500 mb-5">
            Submit a short testimonial and help us keep the homepage authentic with real user feedback.
          </p>
          <form onSubmit={saveTestimonial} className="space-y-4">
            <textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              placeholder="Write your honest testimonial here..."
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-800 outline-none focus:border-[#9400D3] focus:ring-2 focus:ring-[#9400D31a]"
              rows={4}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#9400D3] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
            >
              Submit testimonial
            </button>
            {testimonialSaved && (
              <p className="text-sm text-green-600">Thanks! Your testimonial will appear on the home page.</p>
            )}
          </form>
        </div>

          {showCreateResume && (
            <form onSubmit={createResume} onClick={()=> setShowCreateResume(false)} className="fixed inset-0 bg-black/70 backdroop-blur bg-opacity-50 z-10 flex items-center justify-center">
              <div onClick={e => e.stopPropagation()} className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
                <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
                <input onChange={(e)=>{setTitle(e.target.value)}} value={title} type="text" placeholder="Enter Resume Title" className="w-full px-4 py-2 mb-4 focus:border-greem-600 ring-green-600" required/>

                <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Create Resume</button>
                <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={()=> {
                  setShowCreateResume(false); setTitle('')
                }}/>
              </div>
            </form>
          )

          }
          {showUploadResume && (
            <form onSubmit={uploadResume} onClick={()=> setShowUploadResume(false)} className="fixed inset-0 bg-black/70 backdroop-blur bg-opacity-50 z-10 flex items-center justify-center">
              <div onClick={e => e.stopPropagation()} className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
                <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
                <input onChange={(e)=>{setTitle(e.target.value)}} value={title}type="text" placeholder="Enter Resume Title" className="w-full px-4 py-2 mb-4 focus:border-greem-600 ring-green-600" required/>

              <div>
                <label htmlFor="resume-input" className="block text-sm text-slate-700">
                  Select resume file

                  <div className="flex flex-col items-center justify-center gap-2 border-group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-indigo-500 hover:text-green-700 cursor pointer transition-colors">
                    {resume ? (
                      <p className="text-green-700">{resume.name}</p>
                    ) : (
                      <>
                      <UploadCloud className="size-14 stroke-1" />
                      <p>Upload resume</p>
                      </>
                    )}

                  </div>
                </label>
                <input type="file" id="resume-input" accept=".pdf" hidden onChange={(e)=> setResume(e.target.files[0])}/>
              </div>

                <button disabled={isLoading} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                  {isLoading && <LoaderCircleIcon className="animate-spin size-4 text-white" />}
                  {isLoading ? 'Uploading...' : 'Upload Resume'}
                </button>
                <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={()=> {
                  setShowUploadResume(false); setTitle('')
                }}/>
              </div>
            </form>
          )
            
          }

          {editResumeId && (
            <form onSubmit={editTitle} onClick={()=> setEditResumeId('')} className="fixed inset-0 bg-black/70 backdroop-blur bg-opacity-50 z-10 flex items-center justify-center">
              <div onClick={e => e.stopPropagation()} className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6">
                <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
                <input onChange={(e)=>{setTitle(e.target.value)}} value={title} type="text" placeholder="Enter Resume Title" className="w-full px-4 py-2 mb-4 focus:border-greem-600 ring-green-600" required/>

                <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Update</button>
                <XIcon className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors" onClick={()=> {
                  setEditResumeId(''); setTitle('')
                }}/>
              </div>
            </form>
          )

          }

      </div>
      {/* <h1>Dashboard Page</h1> */}
    </div>
  );
};

export default Dashboard;
