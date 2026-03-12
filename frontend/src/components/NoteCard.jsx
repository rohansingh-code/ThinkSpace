import React from 'react'
import { Link } from 'react-router'
import { Trash2Icon, SparklesIcon } from "lucide-react";
import { formatDate } from '../lib/utils.js';
import api from '../lib/axios.js';
import toast from 'react-hot-toast';

const NoteCard = ({ note, setNotes, setSearch }) => {

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(note => note._id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    setSearch(tag);
  };

  const hasTags = note.tags && note.tags.length > 0;
  const hasSummary = note.summary && note.summary.trim() !== "";

  return (
    <Link
      to={`/note/${note._id}`}
      className="note-card group block rounded-2xl border border-yellow-600/15 bg-[#111100] hover:bg-[#161600] hover:border-yellow-500/30 transition-all duration-300 overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.04)' }}
    >

      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-5 flex flex-col gap-3">

        {/* Title */}
        <h3
          className="font-semibold text-[15px] leading-snug text-white/90 group-hover:text-yellow-300/90 transition-colors duration-200 line-clamp-2"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {note.title}
        </h3>

        {/* AI Summary */}
        {hasSummary && (
          <div className="flex items-start gap-1.5">
            <SparklesIcon className="size-3 text-yellow-400/70 mt-0.5 shrink-0" />
            <p className="text-[12px] text-white/40 leading-relaxed line-clamp-2 italic">
              {note.summary}
            </p>
          </div>
        )}

        {/* Content */}
        <p className="text-[13px] text-white/50 leading-relaxed line-clamp-3">
          {note.content}
        </p>

        {/* Tags */}
        {hasTags && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {note.tags.map((tag, i) => (
              <span
                key={i}
                onClick={(e) => handleTagClick(e, tag)}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide border border-yellow-500/20 bg-yellow-500/[0.08] text-yellow-300/70 cursor-pointer hover:bg-yellow-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-yellow-600/10">
          <span className="text-[11px] text-white/25 tracking-wide">
            {formatDate(new Date(note.createdAt))}
          </span>
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 text-[11px] text-red-400/70 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-500/10"
            onClick={(e) => handleDelete(e, note._id)}
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