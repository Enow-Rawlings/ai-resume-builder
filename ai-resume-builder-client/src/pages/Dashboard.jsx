import {
  FilePenLineIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloud,
  XIcon,
  FileText,
  Clock,
  LayoutTemplate,
  MessageSquarePlus,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { toast } from "react-hot-toast";
import api from "../configs/api.js";
import { useSelector } from "react-redux";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// ── PDF text extraction ────────────────────────────────────────────────
const extractTextFromPdf = async (file) => {
  if (!file) return "";
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text.trim();
};

// ── Card accent colours ───────────────────────────────────────────────
const COLORS = ["#9400D3", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

// ── Modal wrapper ─────────────────────────────────────────────────────
const Modal = ({ onClose, children }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Close"
      >
        <XIcon size={18} />
      </button>
      {children}
    </div>
  </div>
);

// ── Shared input style ────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#9400D3] focus:ring-2 focus:ring-[#9400D3]/10 transition-all";

// ── Modal title ───────────────────────────────────────────────────────
const ModalTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-slate-800 mb-5">{children}</h2>
);

// ── Primary button ────────────────────────────────────────────────────
const PrimaryBtn = ({ children, disabled, ...rest }) => (
  <button
    {...rest}
    disabled={disabled}
    className="mt-4 w-full rounded-xl bg-[#9400D3] py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a00b5] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    {children}
  </button>
);

// ─────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [allResumes, setAllResumes] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editResumeId, setEditResumeId] = useState("");
  const [title, setTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [testimonial, setTestimonial] = useState("");
  const [testimonialSaved, setTestimonialSaved] = useState(false);

  // ── Data loading ────────────────────────────────────────────────────
  const loadAllResumes = async () => {
    try {
      const { data } = await api.get("/api/users/resumes");
      setAllResumes(data.resumes);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    loadAllResumes();
  }, []);

  // ── CRUD ────────────────────────────────────────────────────────────
  const createResume = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/resumes/create", { title });
      setAllResumes((prev) => [...prev, data.resume]);
      setTitle("");
      setShowCreate(false);
      navigate(`/app/builder/${data.resume._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const resumeText = await extractTextFromPdf(resumeFile);
      const { data } = await api.post("/api/ai/upload-resume", { title, resumeText });
      setTitle("");
      setResumeFile(null);
      setShowUpload(false);
      navigate(`/app/builder/${data.resumeId}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const editTitle = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/api/resumes/update", {
        resumeId: editResumeId,
        resumeData: { title },
      });
      setAllResumes((prev) =>
        prev.map((r) => (r._id === editResumeId ? { ...r, title } : r))
      );
      setTitle("");
      setEditResumeId("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteResume = async (resumeId) => {
    if (!window.confirm("Delete this resume? This cannot be undone.")) return;
    try {
      const { data } = await api.delete(`/api/resumes/delete/${resumeId}`);
      setAllResumes((prev) => prev.filter((r) => r._id !== resumeId));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const saveTestimonial = async (e) => {
    e.preventDefault();
    if (!testimonial.trim()) {
      toast.error("Please enter a testimonial before submitting.");
      return;
    }
    try {
      await api.post("/api/testimonials", {
        name: user?.name || "Anonymous",
        handle: `@${(user?.name || "anonymous").replace(/\s+/g, "").toLowerCase()}`,
        message: testimonial.trim(),
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Anonymous")}&background=9400D3&color=ffffff&rounded=true`,
      });
      setTestimonial("");
      setTestimonialSaved(true);
      setTimeout(() => setTestimonialSaved(false), 4000);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // ── Stats ────────────────────────────────────────────────────────────
  const lastEdited = allResumes.length
    ? new Date(
        Math.max(...allResumes.map((r) => new Date(r.updatedAt)))
      ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const stats = [
    {
      icon: <FileText size={20} style={{ color: "#9400D3" }} />,
      label: "Total resumes",
      value: allResumes.length,
    },
    {
      icon: <Clock size={20} style={{ color: "#3b82f6" }} />,
      label: "Last edited",
      value: lastEdited || "—",
    },
    {
      icon: <LayoutTemplate size={20} style={{ color: "#10b981" }} />,
      label: "Templates available",
      value: 7,
    },
  ];

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back, <span style={{ color: "#9400D3" }}>{user?.name?.split(" ")[0] || "there"}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's an overview of your resumes.
          </p>
        </div>

        {/* ── Stats strip ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map(({ icon, label, value }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex items-center gap-4"
            >
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-lg font-semibold text-slate-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Section heading ───────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-700">My Resumes</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#9400D3] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#7a00b5] active:scale-95"
            >
              <PlusIcon size={14} /> New resume
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#9400D3]/30 bg-white px-4 py-2 text-xs font-semibold text-[#9400D3] transition hover:bg-[#9400D3]/5 active:scale-95"
            >
              <UploadCloud size={14} /> Upload PDF
            </button>
          </div>
        </div>

        {/* ── Resume grid ───────────────────────────────────────────── */}
        {allResumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
            <FilePenLineIcon size={40} className="text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500">No resumes yet</p>
            <p className="text-xs text-slate-400 mt-1">Create your first resume to get started</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#9400D3] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a00b5]"
            >
              <PlusIcon size={15} /> Create resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allResumes.map((resume, index) => {
              const color = COLORS[index % COLORS.length];
              return (
                <div
                  key={resume._id}
                  className="group relative flex flex-col rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(145deg, ${color}0d, ${color}28)`,
                    borderColor: color + "35",
                  }}
                  onClick={() => navigate(`/app/builder/${resume._id}`)}
                >
                  {/* Card body */}
                  <div className="flex flex-col items-center justify-center gap-2 px-3 pt-8 pb-6">
                    <div
                      className="h-12 w-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: color + "20" }}
                    >
                      <FilePenLineIcon size={22} style={{ color }} />
                    </div>
                    <p
                      className="text-sm font-medium text-center leading-snug px-1 line-clamp-2"
                      style={{ color }}
                    >
                      {resume.title}
                    </p>
                  </div>

                  {/* Date footer */}
                  <div
                    className="px-3 py-2 text-center text-[11px]"
                    style={{ color: color + "99", borderTop: `1px solid ${color}20` }}
                  >
                    {new Date(resume.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  {/* Hover actions — fixed typo: was group-hover:fkex */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1"
                  >
                    <button
                      onClick={() => { setEditResumeId(resume._id); setTitle(resume.title); }}
                      className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/80 text-slate-600 hover:bg-white hover:text-[#9400D3] transition-colors shadow-sm"
                      aria-label="Rename"
                    >
                      <PencilIcon size={13} />
                    </button>
                    <button
                      onClick={() => deleteResume(resume._id)}
                      className="h-7 w-7 flex items-center justify-center rounded-lg bg-white/80 text-slate-600 hover:bg-white hover:text-red-500 transition-colors shadow-sm"
                      aria-label="Delete"
                    >
                      <TrashIcon size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Testimonial ───────────────────────────────────────────── */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-[#9400D3]/10 flex items-center justify-center shrink-0">
              <MessageSquarePlus size={18} style={{ color: "#9400D3" }} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Share your experience</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Your feedback helps us improve and keeps the homepage authentic.
              </p>
            </div>
          </div>
          <form onSubmit={saveTestimonial} className="space-y-3">
            <textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              placeholder="What do you think of CVPILOT? Be honest..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none focus:border-[#9400D3] focus:ring-2 focus:ring-[#9400D3]/10 transition-all resize-none"
              rows={3}
            />
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#9400D3] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7a00b5] active:scale-95"
              >
                Submit
              </button>
              {testimonialSaved && (
                <p className="text-sm text-green-600 font-medium">
                  Thanks! Your testimonial has been submitted.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* ── Create modal ──────────────────────────────────────────────── */}
      {showCreate && (
        <Modal onClose={() => { setShowCreate(false); setTitle(""); }}>
          <ModalTitle>Create a new resume</ModalTitle>
          <form onSubmit={createResume} className="space-y-3">
            <input
              autoFocus
              type="text"
              placeholder="Resume title (e.g. Software Engineer 2026)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              required
            />
            <PrimaryBtn type="submit">Create resume</PrimaryBtn>
          </form>
        </Modal>
      )}

      {/* ── Upload modal ──────────────────────────────────────────────── */}
      {showUpload && (
        <Modal onClose={() => { setShowUpload(false); setTitle(""); setResumeFile(null); }}>
          <ModalTitle>Upload existing resume</ModalTitle>
          <form onSubmit={uploadResume} className="space-y-3">
            <input
              autoFocus
              type="text"
              placeholder="Resume title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              required
            />
            <label htmlFor="resume-input" className="block cursor-pointer">
              <div
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors ${
                  resumeFile
                    ? "border-[#9400D3]/40 bg-[#9400D3]/5 text-[#9400D3]"
                    : "border-slate-200 bg-slate-50 text-slate-400 hover:border-[#9400D3]/40 hover:text-[#9400D3]"
                }`}
              >
                <UploadCloud size={32} className="stroke-1" />
                {resumeFile ? (
                  <p className="text-sm font-medium text-center">{resumeFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm font-medium">Click to select a PDF</p>
                    <p className="text-xs opacity-60">Only PDF files are supported</p>
                  </>
                )}
              </div>
              <input
                id="resume-input"
                type="file"
                accept=".pdf"
                hidden
                onChange={(e) => setResumeFile(e.target.files[0])}
                required
              />
            </label>
            <PrimaryBtn type="submit" disabled={isUploading || !resumeFile}>
              {isUploading && <LoaderCircleIcon size={15} className="animate-spin" />}
              {isUploading ? "Uploading…" : "Upload and build"}
            </PrimaryBtn>
          </form>
        </Modal>
      )}

      {/* ── Edit title modal ──────────────────────────────────────────── */}
      {editResumeId && (
        <Modal onClose={() => { setEditResumeId(""); setTitle(""); }}>
          <ModalTitle>Rename resume</ModalTitle>
          <form onSubmit={editTitle} className="space-y-3">
            <input
              autoFocus
              type="text"
              placeholder="New title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              required
            />
            <PrimaryBtn type="submit">Save changes</PrimaryBtn>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
