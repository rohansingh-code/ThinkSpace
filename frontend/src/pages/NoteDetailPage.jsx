import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { ArrowLeftIcon, Trash2Icon, PencilIcon, SparklesIcon, CheckIcon, XIcon, CopyIcon } from "lucide-react";
import { formatDate } from "../lib/utils.js";

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch {
        toast.error("Failed to load note");
      } finally {
        setLoading(false);
      }
    }
    fetchNote();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch {
      toast.error("Failed to delete note");
    }
  }

  async function handleSave() {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Title and content required");
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/notes/${id}`, note);
      setNote(res.data);
      toast.success("Note updated");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
          <p className="text-[13px] text-zinc-500">Loading note...</p>
        </div>
      </div>
    );
  }

  const hasTags = note?.tags && note.tags.length > 0;
  const hasSummary = note?.summary && note.summary.trim() !== "";

  return (
    <div className="min-h-screen bg-transparent">

      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/60 backdrop-blur-2xl">
        <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back
          </Link>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-zinc-400 text-[12px] font-medium transition-all duration-200"
                >
                  {copied ? <CheckIcon className="size-3 text-emerald-400" /> : <CopyIcon className="size-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-zinc-400 text-[12px] font-medium transition-all duration-200"
                >
                  <PencilIcon className="size-3" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-red-500/20 bg-red-500/[0.05] hover:bg-red-500/10 text-red-400/70 hover:text-red-400 text-[12px] font-medium transition-all duration-200"
                >
                  <Trash2Icon className="size-3" />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-zinc-500 text-[12px] font-medium transition-all duration-200"
                >
                  <XIcon className="size-3" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[12px] font-bold transition-all duration-200 disabled:opacity-50"
                >
                  {saving ? (
                    <div className="size-3 rounded-full border-2 border-zinc-950/30 border-t-zinc-950 animate-spin" />
                  ) : (
                    <CheckIcon className="size-3 stroke-[3]" />
                  )}
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-5 py-10">

        {/* Title */}
        {isEditing ? (
          <input
            className="w-full bg-transparent text-3xl font-semibold text-zinc-100 border-b border-white/10 pb-3 mb-6 outline-none focus:border-amber-500/50 transition-colors duration-200 placeholder:text-zinc-700"
            style={{ fontFamily: "'Instrument Serif', serif" }}
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            placeholder="Note title..."
          />
        ) : (
          <h1
            className="text-3xl font-semibold text-white/90 mb-3 leading-snug"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {note.title}
          </h1>
        )}

        {/* Meta row */}
        {!isEditing && (
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[12px] text-white/25">
              {formatDate(new Date(note.createdAt))}
            </span>
            {note.updatedAt !== note.createdAt && (
              <>
                <span className="text-white/10">·</span>
                <span className="text-[12px] text-white/20">
                  Edited {formatDate(new Date(note.updatedAt))}
                </span>
              </>
            )}
          </div>
        )}

        {/* AI Summary */}
        {!isEditing && hasSummary && (
          <div className="mb-6 rounded-xl border border-amber-500/15 bg-amber-500/[0.03] p-4 shadow-inner">
            <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="size-3.5 text-amber-500/70" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-amber-500/60">
                AI Summary
              </span>
            </div>
            <p className="text-[13px] text-zinc-400 leading-relaxed italic">
              {note.summary}
            </p>
          </div>
        )}


        {isEditing ? (
          <textarea
            className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-[14px] text-zinc-300 leading-relaxed min-h-[280px] outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200 placeholder:text-zinc-600 resize-none shadow-inner"
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            placeholder="Write your note..."
          />
        ) : (
          <div className="text-[14.5px] text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {note.content}
          </div>
        )}

        {!isEditing && hasTags && (
          <div className="mt-10 pt-6 border-t border-white/5">
            <p className="text-[11px] uppercase tracking-widest text-zinc-600 mb-3 font-medium">Tags</p>
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium tracking-wide border border-amber-500/20 bg-amber-500/[0.05] text-amber-500/80 shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NoteDetailPage;