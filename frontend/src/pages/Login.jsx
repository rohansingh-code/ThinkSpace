import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { BrainIcon, ArrowRight, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    try {
      setLoading(true);
      await login({ email, password });
      toast.success("Welcome back");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-amber-700/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#d97706 1px, transparent 1px), linear-gradient(90deg, #d97706 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10 gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-md" />
            <div className="relative size-14 rounded-2xl bg-gradient-to-br from-amber-600/30 to-amber-800/20 border border-amber-500/30 flex items-center justify-center shadow-lg">
              <BrainIcon className="size-7 text-amber-500" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-[28px] font-semibold text-zinc-100 tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Think<span className="text-amber-500">Space</span>
            </h1>
            <p className="text-[11.5px] text-zinc-500 mt-1 tracking-wide">Your AI-powered thinking workspace</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-sm p-8 shadow-2xl shadow-black/60">

          {/* Card header */}
          <div className="mb-7">
            <h2 className="text-[18px] font-semibold text-white/85">Welcome back</h2>
            <p className="text-[12px] text-white/30 mt-1">Sign in to continue your thinking</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-[10.5px] uppercase tracking-[0.12em] text-zinc-500 font-semibold">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-xl bg-zinc-900/50 border border-white/5 text-[13px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200 shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10.5px] uppercase tracking-[0.12em] text-zinc-500 font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 pr-10 rounded-xl bg-zinc-900/50 border border-white/5 text-[13px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200 shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 text-[13px] font-bold transition-all duration-200 flex items-center justify-center gap-2 mt-1 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20"
            >
              {loading
                ? <><div className="size-3.5 rounded-full border-2 border-zinc-950/20 border-t-zinc-950 animate-spin" /> Signing in...</>
                : <> Sign in <ArrowRight className="size-3.5 stroke-[2.5]" /></>
              }
            </button>

          </form>
        </div>

        <p className="text-center mt-5 text-[12px] text-zinc-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-amber-500/80 hover:text-amber-400 transition-colors duration-200 underline underline-offset-2 decoration-amber-500/30">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;