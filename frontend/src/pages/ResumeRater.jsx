import { useState, useRef, useLayoutEffect } from "react";
import { Upload, FileText, Sparkles, RefreshCcw } from "lucide-react";
import { toast } from "react-toastify";
import gsap from "gsap";
import { analyzeResume } from "@/services/resume";
import { ResumeResult } from "@/components/ResumeResult";
import ScanningLoader from "@/components/ui/ScanningLoader";
import BackButton from "../components/BackButton";

export default function ResumeRater() {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("Software Developer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".resume-badge", { y: 20, opacity: 0, duration: 0.6 });
      tl.from(".resume-title", { y: 30, opacity: 0, duration: 0.8 }, "-=0.4");
      tl.from(".resume-form", { y: 40, opacity: 0, duration: 0.7 }, "-=0.4");
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type !== "application/pdf") {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return toast.error("Please upload a PDF file");
    }
    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) return toast.warn("Please select a resume first");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);

    try {
      const res = await analyzeResume(formData);
      setResult(res.data.data);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis Error:", error);
      const msg =
        error.response?.data?.message ||
        "Analysis failed. Please check your connection.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    // Applied the exact dark navy background from your screenshot
    <div
      ref={pageRef}
      className="w-full min-h-screen bg-[#0A0D14] py-12 px-4 font-sans"
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Top Navigation */}
        <div className="mb-2">
          <BackButton />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* ── HEADER ARCHITECTURE ── */}
        {!loading && (
          <div className="text-center mb-10 space-y-4">
            <div className="resume-badge inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-[#4F46E5] text-[11px] font-bold uppercase tracking-wider shadow-sm">
              <Sparkles size={14} /> ATS Optimizer
            </div>
            {/* Title matching exact screenshot contrast */}
            <h1 className="resume-title text-4xl font-bold tracking-tight">
              <span className="text-[#1E2532]">Resume</span>
              <span className="text-[#4F46E5]">Rater</span>
            </h1>
          </div>
        )}

        {/* ── LOGIC FLOW DISPLAY ── */}
        {result ? (
          <div className="space-y-6">
            <ResumeResult result={result} />
            <button
              onClick={handleReset}
              className="flex items-center gap-2 mx-auto text-sm font-semibold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-xl border border-white/10"
            >
              <RefreshCcw size={16} /> Re-upload another resume
            </button>
          </div>
        ) : loading ? (
          <div className="animate-in fade-in zoom-in duration-500 h-[60vh] flex items-center justify-center">
            <ScanningLoader />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="resume-form space-y-6"
          >
            {/* 1. Target Job Input Box (Pure White as per screenshot) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-2.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Target Job Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 text-[14px] rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all text-slate-900 font-medium"
                placeholder="e.g. Software Developer"
                required
              />
            </div>

            {/* 2. Upload Dropzone Complex (Translucent Grey as per screenshot) */}
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept=".pdf"
              />
              <div
                className={`p-16 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  file
                    ? "border-[#4F46E5] bg-[#4F46E5]/10"
                    : "border-white/30 bg-white/[0.12] group-hover:border-white/50"
                } flex flex-col items-center justify-center text-center`}
              >
                {/* Upload Icon Box (White Box, Grey Icon) */}
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-5 shadow-sm transition-transform group-hover:scale-105">
                  {file ? (
                    <FileText size={24} className="text-[#4F46E5]" />
                  ) : (
                    <Upload size={24} className="text-slate-500" />
                  )}
                </div>

                <h3 className="font-semibold text-[#1E293B] text-[15px] tracking-tight">
                  {file ? file.name : "Upload Resume (PDF)"}
                </h3>
                <p className="text-[13px] text-slate-400 mt-1.5 font-medium">
                  Drag and drop or click to browse files
                </p>
              </div>
            </div>

            {/* 3. Action Trigger Button (Dark merged style) */}
            <button
              type="submit"
              disabled={!file}
              className="w-full py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:cursor-not-allowed
                bg-white/5 text-slate-500 disabled:opacity-100
                hover:enabled:bg-[#4F46E5] hover:enabled:text-white"
            >
              Start AI Analysis
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
