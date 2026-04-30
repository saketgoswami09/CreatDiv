import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060a13] text-white flex items-center justify-center px-6 relative overflow-hidden">

          {/* subtle background glow */}
          <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[120px] top-[-100px] left-[-100px]" />
          <div className="absolute w-[300px] h-[300px] bg-blue-500/10 blur-[100px] bottom-[-100px] right-[-100px]" />

          <div className="text-center max-w-lg z-10">

            {/* icon */}
            <div className="mx-auto w-14 h-14 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center mb-6 backdrop-blur">
              <AlertTriangle className="text-white/70" size={26} />
            </div>

            {/* heading */}
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">
              Something broke.
            </h1>

            {/* subtext */}
            <p className="text-white/40 text-sm md:text-base leading-relaxed mb-8">
              Not your fault. Its her fault.
              <br />
              Try refreshing — it usually fixes itself.
            </p>

            {/* button */}
            <button
              onClick={() => window.location.reload()}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300"
            >
              <RefreshCw
                size={16}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              <span className="text-sm tracking-wide">
                Refresh
              </span>
            </button>

            {/* tiny footer note */}
            <p className="text-[11px] text-white/20 mt-6 tracking-wider uppercase">
              Creatdiv System • Error 
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}