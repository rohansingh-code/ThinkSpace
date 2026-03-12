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
    <header className="border-b border-yellow-600/20 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-5 py-3.5">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="size-10 rounded-xl bg-yellow-600/20 border border-yellow-500/30 flex items-center justify-center group-hover:bg-yellow-600/30 transition-colors duration-200">
              <BrainIcon className="size-5 text-yellow-400" />
            </div>
            <span className="text-[22px] font-semibold tracking-tight text-white/90" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Think<span className="text-yellow-400">Space</span>
            </span>
          </Link>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-yellow-600/40" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-white/[0.04] border border-yellow-600/20 text-[13px] text-white/80 placeholder:text-white/25 outline-none focus:border-yellow-500/50 focus:bg-white/[0.06] transition-all duration-200"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/create"
              className="flex items-center gap-2 h-9 px-4 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-black text-[13px] font-medium transition-colors duration-200"
            >
              <PlusIcon className="size-3.5" />
              <span className="hidden sm:inline">New Note</span>
            </Link>

            {user && (
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="size-7 rounded-full bg-yellow-600/30 border border-yellow-500/30 flex items-center justify-center text-[11px] font-semibold text-yellow-300">
                    {(user.name || user.email || "U")[0].toUpperCase()}
                  </div>
                  <span className="text-[12px] text-white/40 max-w-[100px] truncate">
                    {user.name || user.email}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="size-9 flex items-center justify-center rounded-xl border border-yellow-600/20 bg-white/[0.03] hover:bg-red-500/10 hover:border-red-500/30 text-white/40 hover:text-red-400 transition-all duration-200"
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