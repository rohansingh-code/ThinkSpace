import { NotebookIcon } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-5 max-w-md mx-auto text-center">
      
      {/* Icon */}
      <div className="bg-primary/10 rounded-full p-6">
        <NotebookIcon className="size-9 text-primary" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-base-content">
        No notes yet
      </h3>

      {/* Description */}
      <p className="text-sm text-base-content/60 leading-relaxed">
        Start capturing your thoughts and ideas by creating your first note.
      </p>

      {/* Action */}
      <Link to="/create" className="btn btn-primary btn-sm px-5">
        Create Note
      </Link>

    </div>
  );
};

export default NotesNotFound;
