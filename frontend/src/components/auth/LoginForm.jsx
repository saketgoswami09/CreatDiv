import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const LoginForm = ({ cardRef }) => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const submitHandler = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await signIn(data);
      const { token, user } = res.data;
      login(token, user.name);
      toast.success(`Welcome back, ${user.name}!`);
      reset();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white min-h-screen px-6">
      <div
        ref={cardRef}
        className="w-full max-w-100 py-12"
      >
        {/* HEADER - Matches Hero Typography */}
        <div className="mb-12">
          <h2 className="text-5xl font-bold tracking-tighter text-black leading-none">
            Login.
          </h2>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-black/40 font-bold">
            Personal Studio Access — 2026
          </p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
          {/* EMAIL */}
          <div className="group flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 group-focus-within:text-black transition-colors">
              Email Address
            </label>
            <input
              {...register("email")}
              placeholder="you@creativ.com"
              className="w-full border-b border-black/10 bg-transparent py-3 text-sm text-black placeholder:text-black/20 focus:border-black outline-none transition-all"
            />
            {errors.email && (
              <p className="text-[10px] font-bold uppercase text-red-500 tracking-tighter">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="group flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-black/40 group-focus-within:text-black transition-colors">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className="w-full border-b border-black/10 bg-transparent py-3 text-sm text-black placeholder:text-black/20 focus:border-black outline-none transition-all"
            />
            {errors.password && (
              <p className="text-[10px] font-bold uppercase text-red-500 tracking-tighter">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* SUBMIT - Matches Navigation Button Style */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-black py-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-black/80 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? "Authenticating..." : "Enter Studio →"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-12 pt-8 border-t border-black/5 flex justify-between items-center">
          <p className="text-[10px] uppercase tracking-widest text-black/40 font-bold">
            No Account?
          </p>
          <button
            onClick={() => navigate("/register")}
            className="text-[10px] uppercase tracking-widest font-bold text-black hover:underline"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;