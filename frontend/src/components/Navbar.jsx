import { PlusIcon, SearchIcon, BrainIcon, LogOutIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

function Navbar({ search, setSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="border-b border-white/5 bg-zinc-950/60 backdrop-blur-2xl sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-5 py-3.5">
        <div className="flex items-center justify-between gap-4">

          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:shadow-lg group-hover:shadow-amber-500/10 transition-all duration-300">
              <BrainIcon className="size-5 text-amber-500" />
            </div>
            <span className="text-[22px] font-semibold tracking-tight text-white/90" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Think<span className="text-amber-500">Space</span>
            </span>
          </Link>

          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-amber-500/40" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-white/[0.03] border border-white/5 text-[13px] text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/create"
              className="flex items-center gap-2 h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[13px] font-semibold shadow-lg shadow-amber-500/10 hover:-translate-y-0.5 transition-all duration-200"
            >
              <PlusIcon className="size-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">New Note</span>
            </Link>

            {user && (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="size-7 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-[11px] font-semibold text-amber-500">
                    {(user.name || user.email || "U")[0].toUpperCase()}
                  </div>
                  <span className="text-[12px] text-zinc-400 max-w-[100px] truncate">
                    {user.name || user.email}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="size-9 flex items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] hover:bg-red-500/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 transition-all duration-200"
                >
                  <LogOutIcon className="size-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}

export default Navbar;