import { NotebookIcon } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-5 max-w-md mx-auto text-center">

      {/* Icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-xl scale-150" />
        <div className="relative size-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
          <NotebookIcon className="size-7 text-violet-400/60" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-white/80" style={{ fontFamily: "'Instrument Serif', serif" }}>
        No notes yet
      </h3>

      {/* Description */}
      <p className="text-[13px] text-white/30 leading-relaxed">
        Start capturing your thoughts and ideas by creating your first note.
      </p>

      {/* Action */}
      <Link
        to="/create"
        className="flex items-center gap-2 h-9 px-5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-medium transition-colors duration-200"
      >
        Create your first note
      </Link>

    </div>
  );
};

export default NotesNotFound;