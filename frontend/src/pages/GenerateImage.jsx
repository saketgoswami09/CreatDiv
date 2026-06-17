import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import gsap from "gsap";
import { Download, RefreshCw, Dice5, Plus, Sparkles } from "lucide-react";

import { IMAGE_RESOLUTION } from "@/constants/image";
import { generateImage } from "@/services/image";
import { downloadImage } from "@/utils/global";
import ImageHistory from "@/components/ui/ImageHistory";
import { CustomSelect } from "@/components/ui/CustomSelect";
import BackButton from "../components/BackButton";

const SAMPLE_PROMPTS = [
  "A futuristic city with flying cars at sunset, cyberpunk style",
  "A cozy 3d room with plants and warm lighting",
  "Oil painting of a forest in autumn",
  "Astronaut floating in a colorful nebula",
];

const schema = z.object({
  resolution: z.string().min(1),
  prompt: z.string().min(1),
});

export default function GenerateImage() {
  const [generatedImages, setGeneratedImages] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const studioRef = useRef(null);
  const diceRef = useRef(null);

  const { control, register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      resolution: IMAGE_RESOLUTION?.[0]?.value || "512x512",
    },
  });

  // 🎬 HERO + PANEL ANIMATION
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".editorial-header", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(".editorial-panel", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });

      // Subtle floating effect for the preview container
      gsap.to(".preview-container", {
        y: -8,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: "sine.inOut",
      });
    }, studioRef);

    return () => ctx.revert();
  }, []);

  // 🎬 IMAGE REVEAL
  useEffect(() => {
    if (generatedImages) {
      gsap.from(".generated-image", {
        scale: 1.08,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }
  }, [generatedImages]);

  const formHandler = async (data) => {
    setIsSubmitting(true);
    setGeneratedImages(null);

    try {
      const res = await generateImage(data);
      setGeneratedImages(res?.data?.data?.image_url);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSurpriseMe = () => {
    gsap.to(diceRef.current, {
      rotation: "+=360",
      duration: 0.6,
      ease: "power2.out",
    });

    const random =
      SAMPLE_PROMPTS[Math.floor(Math.random() * SAMPLE_PROMPTS.length)];

    setValue("prompt", random, { shouldValidate: true });
  };

  return (
    <div
      ref={studioRef}
      // Applied the exact deep dark background matching Creatdiv.
      className="bg-[#0A0D14] min-h-screen text-slate-200 px-6 pt-24 pb-20 font-sans"
    >
      <div className="max-w-8xl p-2">
        {/* Top Navigation */}
        <div className="mb-2">
          <BackButton />
        </div>
      </div>
      {/* ── HEADER ── */}
      <div className="editorial-header max-w-[1400px] mx-auto mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
          Image <span className="text-[#4F46E5]">Studio</span>
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* ── LEFT PANEL (Form) ── */}
        <div className="editorial-panel lg:col-span-4 flex flex-col justify-between">
          <form
            onSubmit={handleSubmit(formHandler)}
            className="space-y-8 bg-white/[0.02] p-8 rounded-3xl border border-white/10 shadow-2xl"
          >
            {/* Resolution Select */}
            <div className="space-y-3">
              <label className="text-[11px] uppercase tracking-widest font-bold text-slate-500 block">
                Output Format
              </label>

              <Controller
                name="resolution"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={IMAGE_RESOLUTION}
                    value={field.value}
                    onChange={field.onChange}
                    // Pass classes to style the inner trigger of your CustomSelect
                    className="w-full text-sm font-medium bg-white/5 border border-white/10 text-white rounded-xl"
                  />
                )}
              />
            </div>

            {/* Prompt Textarea */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase tracking-widest font-bold text-slate-500">
                  Prompt
                </label>

                <button
                  type="button"
                  onClick={handleSurpriseMe}
                  className="text-slate-500 hover:text-[#4F46E5] transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Surprise me"
                >
                  <span className="hidden sm:inline">Randomize</span>
                  <div ref={diceRef}>
                    <Dice5 size={16} strokeWidth={2} />
                  </div>
                </button>
              </div>

              <textarea
                {...register("prompt")}
                rows={5}
                placeholder="Describe your vision (e.g. A futuristic city with flying cars at sunset...)"
                className="w-full bg-[#0A0D14] border border-white/10 rounded-xl p-4 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] transition-all resize-none placeholder:text-slate-600 custom-scrollbar"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:cursor-not-allowed bg-[#4F46E5] text-white hover:bg-indigo-600 disabled:opacity-50 shadow-lg shadow-[#4F46E5]/20"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={18} className="animate-spin opacity-70" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Magic <Sparkles size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── RIGHT PANEL (Preview) ── */}
        <div className="editorial-panel lg:col-span-8">
          <div className="preview-container relative aspect-[16/10] bg-white/[0.02] rounded-3xl flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm">
            {isSubmitting ? (
              <div className="flex flex-col items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#4F46E5] blur-xl opacity-20 rounded-full animate-pulse"></div>
                  <RefreshCw
                    size={40}
                    className="animate-spin text-[#4F46E5] relative z-10"
                  />
                </div>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold animate-pulse">
                  Processing Neural Pixels
                </span>
              </div>
            ) : generatedImages ? (
              <div className="group relative w-full h-full bg-[#0A0D14]">
                <img
                  src={generatedImages}
                  alt="Generated"
                  className="generated-image w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Dark overlay for download button on hover */}
                <div className="absolute inset-0 bg-[#0A0D14]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                  <button
                    onClick={() => downloadImage(generatedImages)}
                    className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl hover:scale-105 transition-transform font-semibold text-sm shadow-xl"
                  >
                    <Download size={18} />
                    Download HD
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-600 flex flex-col items-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                  <Plus size={32} className="opacity-50" />
                </div>
                <p className="text-sm font-medium">
                  Awaiting your creative input.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── HISTORY SECTION ── */}
      <div className="editorial-panel max-w-[1400px] mx-auto mt-24 pt-12 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">
          Recent Works
        </h2>
        <ImageHistory refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
