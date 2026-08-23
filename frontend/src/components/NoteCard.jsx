import React from 'react'
import { Link } from 'react-router'
import { Trash2Icon, SparklesIcon } from "lucide-react";
import { formatDate } from '../lib/utils.js';
import api from '../lib/axios.js';
import toast from 'react-hot-toast';

const NoteCard = ({ note, setNotes, setSearch, onTagClick }) => {

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    setSearch(tag);
    onTagClick(tag);
  };

  const hasTags = note.tags && note.tags.length > 0;
  const hasSummary = note.summary && note.summary.trim() !== "";

  return (
    <Link
      to={`/note/${note.id}`}
      className="note-card group block rounded-2xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10"
    >

      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-5 flex flex-col gap-3">

        <h3
          className="font-semibold text-[15px] leading-snug text-zinc-100 group-hover:text-amber-400 transition-colors duration-200 line-clamp-2"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {note.title}
        </h3>

        {hasSummary && (
          <div className="flex items-start gap-1.5">
            <SparklesIcon className="size-3 text-amber-500/70 mt-0.5 shrink-0" />
            <p className="text-[12px] text-zinc-400 leading-relaxed line-clamp-2 italic">
              {note.summary}
            </p>
          </div>
        )}

        <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-3">
          {note.content}
        </p>

        {hasTags && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {note.tags.map((tag, i) => (
              <span
                key={i}
                onClick={(e) => handleTagClick(e, tag)}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide border border-amber-500/20 bg-amber-500/[0.08] text-amber-400 cursor-pointer hover:bg-amber-500/20 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
          <span className="text-[11px] text-zinc-600 tracking-wide">
            {formatDate(new Date(note.createdAt))}
          </span>
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/10"
            onClick={(e) => handleDelete(e, note.id)}
          >
            <Trash2Icon className="size-3" />
            Delete
          </button>
        </div>

      </div>
    </Link>
  );
};

export default NoteCard;