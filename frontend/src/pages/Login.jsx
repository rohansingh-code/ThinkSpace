import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { BrainIcon } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">


      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] rounded-full bg-yellow-600/8 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-sm">


        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="size-12 rounded-2xl bg-yellow-600/20 border border-yellow-500/30 flex items-center justify-center">
            <BrainIcon className="size-6 text-yellow-400" />
          </div>
          <h1 className="text-[26px] font-semibold text-white/90" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Think<span className="text-yellow-400">Space</span>
          </h1>
        </div>


        <div className="rounded-2xl border border-yellow-600/15 bg-white/[0.03] p-7">
          <h2 className="text-[17px] font-semibold text-white/80 mb-1">Welcome back</h2>
          <p className="text-[12px] text-white/30 mb-6">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-widest text-yellow-600/60 font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-yellow-600/20 text-[13px] text-white/80 placeholder:text-white/20 outline-none focus:border-yellow-500/50 focus:bg-white/[0.06] transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-widest text-yellow-600/60 font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-yellow-600/20 text-[13px] text-white/80 placeholder:text-white/20 outline-none focus:border-yellow-500/50 focus:bg-white/[0.06] transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-black text-[13px] font-medium transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <div className="size-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin" />}
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>
        </div>

        <p className="text-center mt-5 text-[12px] text-white/25">
          Don't have an account?{" "}
          <Link to="/signup" className="text-yellow-400/80 hover:text-yellow-400 transition-colors duration-200">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;