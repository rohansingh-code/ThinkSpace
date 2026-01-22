import React from 'react'
import { Link } from 'react-router'
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { formatDate } from '../pages/lib/utils.js';
import api from '../pages/lib/axios.js';
import toast from 'react-hot-toast';

const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(note => note._id !== id));
      toast.success("Note deleted successfully");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className="
        card bg-base-100 border border-base-300
        hover:border-primary/40
        hover:bg-base-200/30
        transition-colors duration-150
      "
    >
      <div className="card-body p-5 flex flex-col gap-3">

        {/* Title (COLORED) */}
        <h3 className="text-lg font-semibold leading-snug text-primary">
          {note.title}
        </h3>

        {/* Content */}
        <p className="text-sm text-base-content/70 line-clamp-3">
          {note.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          
          <span className="text-xs text-base-content/50">
            {formatDate(new Date(note.createdAt))}
          </span>

          <div className="flex items-center gap-2">
            <PenSquareIcon className="size-4 text-base-content/40" />

            <button
              className="
                btn btn-ghost btn-xs text-error
                hover:bg-error/10
              "
              onClick={(e) => handleDelete(e, note._id)}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>

        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
