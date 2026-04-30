import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Video from "../assets/main.mp4";
import Marquee from "../components/nav/Marque";
import { Link } from "react-router-dom";

export default function Home() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  // 🎬 HERO ANIMATION (scoped, clean)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-word", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".hero-meta", {
        y: 20,
        opacity: 0,
        delay: 0.3,
        duration: 0.6,
      });

      gsap.from(".hero-cta-center", {
        y: 20,
        opacity: 0,
        delay: 0.5,
        duration: 0.6,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // 🎬 VIDEO HOVER (clean, single interaction)
  useEffect(() => {
    const container = videoRef.current;
    if (!container) return;

    const video = container.querySelector("video");

    const enter = () => {
      gsap.to(video, {
        scale: 1.08,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    const leave = () => {
      gsap.to(video, {
        scale: 1.05,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    container.addEventListener("mouseenter", enter);
    container.addEventListener("mouseleave", leave);

    return () => {
      container.removeEventListener("mouseenter", enter);
      container.removeEventListener("mouseleave", leave);
    };
  }, []);

  // 🎯 MICRO PARALLAX (subtle only)
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(el, {
        x: x * 8,
        y: y * 8,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    const leave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
      });
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);

    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
      
      {/* HERO */}
      <section
        ref={heroRef}
        className="grid md:grid-cols-2 min-h-screen px-6 md:px-12 pt-24 max-w-[1400px] mx-auto gap-12"
      >
        {/* LEFT */}
        <div className="flex flex-col justify-center gap-6 pb-12 w-full">
          
          {/* VIDEO */}
          <div
            ref={videoRef}
            className="hero-video group w-full h-80 md:h-120 overflow-hidden rounded-2xl cursor-pointer"
          >
            <video
              src={Video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-[1.05]"
            />
          </div>

          {/* META */}
          <p className="hero-meta text-xs tracking-[0.2em] uppercase text-black/50">
            AI STUDIO — 2026
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-start">
          <h1 className="hero-word text-[12vw] md:text-[6vw] leading-[0.95] tracking-[-0.02em] font-medium max-w-[850px]">
            Everything You Imagine, Brought To Life.
          </h1>
        </div>
      </section>

      {/* CENTER CTA (single, clear) */}
      <div className="hero-cta-center w-full flex justify-center mt-[-60px] mb-12 relative z-10">
         <Link to="/image/generate">
        <a
          href="#"
          className="text-base md:text-lg text-black/70 hover:text-black transition group"
        >
          Try For Free
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
        </Link>
      </div>

      {/* MARQUEE */}
      <Marquee />
    </div>
  );
}