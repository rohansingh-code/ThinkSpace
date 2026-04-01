import { NotebookIcon } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-5 max-w-md mx-auto text-center">

      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl scale-150" />
        <div className="relative size-16 rounded-2xl bg-amber-500/[0.05] border border-amber-500/10 flex items-center justify-center">
          <NotebookIcon className="size-7 text-amber-500/60" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-white/80" style={{ fontFamily: "'Instrument Serif', serif" }}>
        No notes yet
      </h3>


      <p className="text-[13px] text-white/30 leading-relaxed">
        Start capturing your thoughts and ideas by creating your first note.
      </p>

      <Link
        to="/create"
        className="flex items-center gap-2 h-9 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/10 text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5"
      >
        Create your first note
      </Link>

    </div>
  );
};

export default NotesNotFound;