import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Include 1 uppercase")
    .regex(/[a-z]/, "Include 1 lowercase")
    .regex(/[0-9]/, "Include 1 number")
    .regex(/[^A-Za-z0-9]/, "Include 1 special char"),
});

const PASS_REQS = [
  { label: "8+ chars", regex: /.{8,}/ },
  { label: "Uppercase", regex: /[A-Z]/ },
  { label: "Lowercase", regex: /[a-z]/ },
  { label: "Number", regex: /[0-9]/ },
  { label: "Special", regex: /[^A-Za-z0-9]/ },
];

const SignUpForm = ({ cardRef }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const submitHandler = async (data) => {
    setIsSubmitting(true);
    try {
      await signUp(data);
      toast.success("Account created!");
      reset();
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Sign up failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white min-h-screen px-6">
      <div ref={cardRef} className="w-full max-w-[400px] py-12">
        
        {/* HEADER - Editorial Bold */}
        <div className="mb-12">
          <h2 className="text-5xl font-bold tracking-tighter text-black leading-none">
            Join.
          </h2>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40">
            Create Personal Studio — 2026
          </p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-10">
          
          {/* NAME */}
          <div className="group flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/30 group-focus-within:text-black transition-colors">
              Full Name
            </label>
            <input
              {...register("name")}
              placeholder="Your Name"
              className="w-full border-b border-black/10 bg-transparent py-3 text-sm text-black placeholder:text-black/10 focus:border-black outline-none transition-all"
            />
            {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.name.message}</p>}
          </div>

          {/* EMAIL */}
          <div className="group flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/30 group-focus-within:text-black transition-colors">
              Email Address
            </label>
            <input
              {...register("email")}
              placeholder="you@creativ.com"
              className="w-full border-b border-black/10 bg-transparent py-3 text-sm text-black placeholder:text-black/10 focus:border-black outline-none transition-all"
            />
            {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.email.message}</p>}
          </div>

          {/* PASSWORD */}
          <div className="group flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/30 group-focus-within:text-black transition-colors">
              Secure Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full border-b border-black/10 bg-transparent py-3 text-sm text-black placeholder:text-black/10 focus:border-black outline-none transition-all"
            />
          </div>

          {/* MINIMAL STRENGTH METER */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-6 pt-2">
            {PASS_REQS.map((req, index) => {
              const isValid = req.regex.test(passwordValue);
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-1 h-1 rounded-full ${isValid ? "bg-black" : "bg-black/10"}`} />
                  <span className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${isValid ? "text-black" : "text-black/20"}`}>
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-black py-5 text-[10px] uppercase tracking-[0.3em] font-bold text-white hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? "Initialising..." : "Create Account —"}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-black/5 flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Member?</p>
          <button 
            onClick={() => navigate("/login")} 
            className="text-[10px] uppercase tracking-widest font-bold text-black hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;