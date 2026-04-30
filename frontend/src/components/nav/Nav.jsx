import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X } from "lucide-react";
import gsap from "gsap";

export default function Nav() {
  const navigate = useNavigate();
  const { isAuthenticated, name: userName, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  // 🔒 LOCK SCROLL WHEN MENU OPEN
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

  // 🎬 NAV ANIMATION (scoped, safe)
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
    );
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-999 px-4 py-4 md:py-2 bg-white/90 backdrop-blur-md border-b border-black/5"
      >
        <div className="max-w-600 mx-auto flex items-center justify-between">
          
          {/* LEFT */}
          <div className="w-1/3">
            <Link to="/" className="font-semibold  text-black   text-xl md:text-2xl tracking-tight">
              Creatdiv.
            </Link>
          </div>

          {/* CENTER */}
          <div className="w-1/3 hidden md:flex justify-center gap-8">
            {isAuthenticated && (
              <>
                <Link to="/image" className="text-sm text-black/50 hover:text-black transition">
                  Image
                </Link>
                <Link to="/content" className="text-sm text-black/50 hover:text-black transition">
                  Rewrite
                </Link>
                <Link to="/resume/analyze" className="text-sm text-black/50 hover:text-black transition">
                  Resume
                </Link>
              </>
            )}
          </div>

          {/* RIGHT */}
          <div className="w-1/3 flex justify-end items-center gap-6">
            {isAuthenticated ? (
              <>
                <span className="hidden sm:block text-xs uppercase tracking-widest text-black/40">
                  {userName}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-black/10 rounded-full text-xs hover:bg-black hover:text-white transition"
                >
                  Logout
                </button>

                {/* MOBILE MENU BTN */}
                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="md:hidden"
                >
                  <Menu size={24} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-xs uppercase text-black/60 hover:text-black">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-black text-white rounded-full text-xs"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE MENU (FIXED VERSION) */}
      <div
        className={`fixed inset-0 z-1000 bg-white transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="h-full flex flex-col p-8">

          {/* TOP BAR */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl">Creatdiv.</span>

            <button onClick={() => setIsMenuOpen(false)}>
              <X size={30} />
            </button>
          </div>

          {/* LINKS */}
          <div className="flex  text-black flex-col justify-center flex-grow gap-10">
            <Link
              to="/image"
              onClick={() => setIsMenuOpen(false)}
              className="text-5xl font-bold tracking-tight"
            >
              Image
            </Link>

            <Link
              to="/content"
              onClick={() => setIsMenuOpen(false)}
              className="text-5xl font-bold tracking-tight"
            >
              Content
            </Link>

            <Link
              to="/resume/analyze"
              onClick={() => setIsMenuOpen(false)}
              className="text-5xl font-bold tracking-tight"
            >
              Resume
            </Link>
          </div>

          {/* FOOTER */}
          <div className="pb-8">
            <button
              onClick={handleLogout}
              className="text-sm uppercase tracking-widest text-red-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}