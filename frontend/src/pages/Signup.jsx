import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { BrainIcon, ArrowRight, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Please fill all fields"); return; }
    try {
      setLoading(true);
      await signup({ name, email, password });
      toast.success("Account created successfully");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "bg-red-500", "bg-yellow-500", "bg-green-500"];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-yellow-700/4 blur-[100px] rounded-full pointer-events-none" />

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
            <div className="absolute inset-0 rounded-2xl bg-yellow-500/20 blur-md" />
            <div className="relative size-14 rounded-2xl bg-gradient-to-br from-yellow-600/30 to-yellow-800/20 border border-yellow-500/30 flex items-center justify-center shadow-lg">
              <BrainIcon className="size-7 text-yellow-400" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-[28px] font-semibold text-white/90 tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Think<span className="text-yellow-400">Space</span>
            </h1>
            <p className="text-[11.5px] text-white/30 mt-1 tracking-wide">Your AI-powered thinking workspace</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm p-8 shadow-2xl shadow-black/60">

          {/* Card header */}
          <div className="mb-7">
            <h2 className="text-[18px] font-semibold text-white/85">Create an account</h2>
            <p className="text-[12px] text-white/30 mt-1">Start capturing your thoughts with AI</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-[10.5px] uppercase tracking-[0.12em] text-yellow-600/60 font-semibold">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-white/80 placeholder:text-white/15 outline-none focus:border-yellow-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-yellow-500/10 transition-all duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10.5px] uppercase tracking-[0.12em] text-yellow-600/60 font-semibold">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-white/80 placeholder:text-white/15 outline-none focus:border-yellow-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-yellow-500/10 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10.5px] uppercase tracking-[0.12em] text-yellow-600/60 font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 pr-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[13px] text-white/80 placeholder:text-white/15 outline-none focus:border-yellow-500/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-yellow-500/10 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {/* Password strength bar */}
              {password.length > 0 && (
                <div className="pt-1 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : "bg-white/10"}`}
                      />
                    ))}
                  </div>
                  <p className={`text-[10.5px] ${strength === 1 ? "text-red-400" : strength === 2 ? "text-yellow-400" : "text-green-400"}`}>
                    {strengthLabel[strength]} password
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-1 shadow-lg shadow-yellow-600/20 hover:shadow-yellow-500/30"
            >
              {loading
                ? <><div className="size-3.5 rounded-full border-2 border-black/20 border-t-black animate-spin" /> Creating account...</>
                : <>Create account <ArrowRight className="size-3.5" /></>
              }
            </button>

          </form>
        </div>

        <p className="text-center mt-5 text-[12px] text-white/20">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-400/70 hover:text-yellow-400 transition-colors duration-200 underline underline-offset-2 decoration-yellow-400/30">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;