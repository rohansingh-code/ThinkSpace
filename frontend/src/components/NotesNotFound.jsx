import { NotebookIcon } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-5 max-w-md mx-auto text-center">

      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-yellow-500/10 blur-xl scale-150" />
        <div className="relative size-16 rounded-2xl bg-yellow-500/[0.06] border border-yellow-500/20 flex items-center justify-center">
          <NotebookIcon className="size-7 text-yellow-400/60" />
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
        className="flex items-center gap-2 h-9 px-5 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-black text-[13px] font-medium transition-colors duration-200"
      >
        Create your first note
      </Link>

    </div>
  );
};

export default NotesNotFound;