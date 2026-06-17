import { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Updated import
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "../components/Card";
import {
  FileText,
  Maximize2,
  Minimize2,
  Search,
  PenTool,
  History,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const contentFeatures = [
  {
    id: "rewrite",
    link: "/content/rewrite",
    title: "Rewrite Content",
    description: "Refine grammar and flow while keeping your original meaning.",
    icon: <FileText className="w-6 h-6" />,
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    id: "expand",
    link: "/content/expand",
    title: "Expand Content",
    description: "Add depth and detail to brief notes or short paragraphs.",
    icon: <Maximize2 className="w-6 h-6" />,
    gradient: "from-indigo-600 to-purple-500",
  },
  {
    id: "shorten",
    link: "/content/shorten",
    title: "Shorten Content",
    description: "Summarize long articles into concise, punchy sentences.",
    icon: <Minimize2 className="w-6 h-6" />,
    gradient: "from-orange-500 to-amber-400",
  },
  {
    id: "seo-content",
    link: "/content/seo-content",
    title: "SEO Optimizer",
    description: "Generate meta tags, keywords, and titles for better ranking.",
    icon: <Search className="w-6 h-6" />,
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    id: "generate-article",
    link: "/content/generate-article",
    title: "Article Writer",
    description: "Create full-length, structured articles from a simple topic.",
    icon: <PenTool className="w-6 h-6" />,
    gradient: "from-green-600 to-emerald-500",
    badge: "New",
  },
  {
    id: "history",
    link: "/content/history",
    title: "Output Vault",
    description: "Access and manage all your previously generated text.",
    icon: <History className="w-6 h-6" />,
    gradient: "from-purple-500 to-pink-500",
  },
];

export default function Content() {
  const pageRef = useRef(null);
  const navigate = useNavigate(); // Added navigate hook

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Header entrance
      tl.from(".content-badge", {
        y: 20,
        opacity: 0,
        duration: 0.6,
      });

      tl.from(
        ".content-title",
        { y: 30, opacity: 0, duration: 0.8 },
        "-=0.4"
      );

      tl.from(
        ".content-subtitle",
        { y: 20, opacity: 0, duration: 0.6 },
        "-=0.5"
      );

      // Cards stagger
      tl.from(
        ".content-card",
        {
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
        },
        "-=0.3"
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Footer banner scroll animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".content-footer-banner", {
        scrollTrigger: {
          trigger: ".content-footer-banner",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      // Exact Creatdiv background color mapping
      className="min-h-screen bg-[#0A0D14] text-slate-200 relative overflow-hidden font-sans"
    >
      {/* Premium subtle background glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#4F46E5]/10 rounded-full blur-[120px] -z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#4F46E5]/5 rounded-full blur-[150px] -z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* ── NEW: BACK NAVIGATION WITH MICRO-INTERACTION ── */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[13px] font-semibold text-slate-500 hover:text-white transition-colors focus:outline-none mb-12 cursor-pointer"
        >
          <div className="flex items-center justify-center p-1.5 rounded-lg border border-transparent group-hover:border-white/10 group-hover:bg-white/5 transition-all">
            <ArrowLeft 
              size={16} 
              className="transition-transform duration-200 ease-in-out group-hover:-translate-x-0.5" 
            />
          </div>
          <span>Back</span>
        </button>

        {/* ── HEADER ── */}
        <div className="text-center mb-20 space-y-5">
          <div className="content-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#4F46E5] text-[11px] font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="fill-[#4F46E5]/20" /> AI Writing Assistant
          </div>

          <h1 className="content-title text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Content <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-[#4F46E5]">
              Engine
            </span>
          </h1>

          <p className="content-subtitle text-slate-400 text-[15px] md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Refine, expand, and generate high-performance copy using our suite of{" "}
            <span className="text-slate-200 font-semibold">advanced neural models</span>.
          </p>
        </div>

        {/* ── CARD GRID ── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentFeatures.map((feature) => (
            <div key={feature.id} className="content-card">
              <Card feature={feature} />
            </div>
          ))}
        </div>

        {/* ── FOOTER BANNER ── */}
        <div className="content-footer-banner mt-24 relative overflow-hidden rounded-[2rem] bg-white/[0.02] backdrop-blur-sm border border-white/10 p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -m-8 opacity-5">
            <FileText size={280} className="text-[#4F46E5]" />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white tracking-tight leading-snug">
                Precision Editing. <br /> Infinite Possibilities.
              </h2>
              <p className="text-slate-400 text-[15px] leading-relaxed max-w-md">
                Our content tools don't just replace words; they understand
                context, intent, and tone to ensure your voice remains authentic
                while becoming more professional.
              </p>
            </div>
            
            {/* Sleek feature tags */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: "Grammar Check", color: "bg-blue-400" },
                { label: "Plagiarism Safe", color: "bg-[#4F46E5]" },
                { label: "Tone Control", color: "bg-orange-400" },
                { label: "Instant Export", color: "bg-emerald-400" },
              ].map((tag, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${tag.color} shadow-[0_0_8px_currentColor]`} />
                  <span className="text-[13px] font-semibold text-slate-300">
                    {tag.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
