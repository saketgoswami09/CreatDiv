import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060a13] text-white flex items-center justify-center px-6 relative overflow-hidden">

      {/* subtle background glow */}
      <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[120px] top-[-100px] left-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-blue-500/10 blur-[100px] bottom-[-100px] right-[-100px]" />

      <div className="text-center max-w-lg z-10">

        {/* 404 */}
        <h1 className="text-[120px] md:text-[160px] font-medium tracking-[-0.05em] leading-none mb-6 text-white/10">
          404
        </h1>

        {/* headline */}
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-3">
          This page went missing.
        </h2>

        {/* funny + brand tone */}
        <p className="text-white/40 text-sm md:text-base leading-relaxed mb-8">
          We checked everywhere. Even the cache.
          <br />
          It’s not here.
        </p>

        {/* CTA */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm tracking-wide">
            Go back home
          </span>
        </Link>

        {/* footer note */}
        <p className="text-[11px] text-white/20 mt-6 tracking-wider uppercase">
          Creatdiv • Route not found
        </p>
      </div>
    </div>
  );
}