import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import gsap from "gsap";
import { Download, RefreshCw, Dice5, Plus } from "lucide-react";

import { IMAGE_RESOLUTION } from "@/constants/image";
import { generateImage } from "@/services/image";
import { downloadImage } from "@/utils/global";
import ImageHistory from "@/components/ui/ImageHistory";
import { CustomSelect } from "@/components/ui/CustomSelect";

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

  const {
    control,
    register,
    handleSubmit,
    setValue,
  } = useForm({
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

      // subtle floating effect (premium feel)
      gsap.to(".preview-container", {
        y: -6,
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
      className="bg-white min-h-screen text-black px-6 pt-32 pb-20"
    >
      {/* HEADER */}
      <div className="editorial-header max-w-[2400px] mx-auto mb-20">
        <h1 className="text-[10vw] md:text-[6vw] font-bold tracking-tighter leading-[0.85] mb-6">
          Image <span className="text-yellow-200">Studio.</span>
        </h1>
        
      </div>

      <div className="max-w-[2400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT PANEL */}
        <div className="editorial-panel lg:col-span-4 border-t border-black pt-12 flex flex-col justify-between">
          <form onSubmit={handleSubmit(formHandler)} className="space-y-16">

            {/* Resolution */}
            <div className="space-y-6">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/30">
                Select Format
              </label>

              <Controller
                name="resolution"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={IMAGE_RESOLUTION}
                    value={field.value}
                    onChange={field.onChange}
                    className="text-xl font-medium uppercase"
                  />
                )}
              />
            </div>

            {/* Prompt */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/30">
                  Prompt
                </label>

                <button
                  type="button"
                  onClick={handleSurpriseMe}
                  className="text-black/40 hover:text-black"
                >
                  <div ref={diceRef}>
                    <Dice5 size={18} strokeWidth={1.5} />
                  </div>
                </button>
              </div>

              <textarea
                {...register("prompt")}
                rows={4}
                placeholder="Describe your vision..."
                className="w-full bg-transparent border-b border-black/5 py-4 text-2xl focus:border-black outline-none resize-none"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="generate-btn w-full bg-black text-white rounded-full py-5 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-neutral-800 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? "Generating..." : "Generate Magic —"}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL */}
        <div className="editorial-panel lg:col-span-8">
          <div className="preview-container relative aspect-[16/10] bg-[#f9f9f9] flex items-center justify-center border border-black/5 overflow-hidden">

            {isSubmitting ? (
              <div className="flex flex-col items-center gap-4">
                <RefreshCw size={32} className="animate-spin text-black/10" />
                <span className="text-[10px] uppercase text-black/20">
                  Processing Neural Pixels
                </span>
              </div>
            ) : generatedImages ? (
              <div className="group relative w-full h-full">
                <img
                  src={generatedImages}
                  alt="Generated"
                  className="generated-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button
                    onClick={() => downloadImage(generatedImages)}
                    className="bg-white p-4 rounded-full hover:scale-110 transition"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Plus size={48} className="mx-auto opacity-5 mb-4" />
                <p className="text-sm opacity-20">
                  Awaiting your creative input.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HISTORY */}
      <div className="editorial-panel mt-32 pt-12 border-t border-black/5">
        <h2 className="text-4xl font-bold mb-10">Recent Works</h2>
        <ImageHistory refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}