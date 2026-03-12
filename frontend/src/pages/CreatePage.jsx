import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'  // ← added useNavigate here
import { ArrowLeftIcon, SparklesIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios.js';

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }
    setLoading(true);
    try {
      await api.post("/notes", { title, content });
      toast.success("Note created");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error("Slow down! Too many notes.", { duration: 4000, icon: "💀" });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-yellow-600/20 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-[13px] text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back
          </Link>

          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="flex items-center gap-2 h-8 px-4 rounded-lg bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 disabled:cursor-not-allowed text-black text-[12px] font-medium transition-all duration-200"
          >
            {loading ? (
              <div className="size-3 rounded-full border-2 border-black/30 border-t-black animate-spin" />
            ) : (
              <SparklesIcon className="size-3" />
            )}
            {loading ? "Creating..." : "Create Note"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-5 py-12">

        {/* AI hint banner */}
        <div className="mb-8 rounded-xl border border-yellow-500/15 bg-yellow-500/[0.05] px-4 py-3 flex items-center gap-3">
          <SparklesIcon className="size-4 text-yellow-400/60 shrink-0" />
          <p className="text-[12px] text-white/35 leading-relaxed">
            AI will automatically generate a <span className="text-yellow-400/70">title</span>, <span className="text-yellow-400/70">summary</span>, and <span className="text-yellow-400/70">tags</span> for your note.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title field */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest text-yellow-600/50 font-medium">
              Title <span className="normal-case text-white/15">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Leave empty to auto-generate..."
              className="w-full bg-white/[0.03] border border-yellow-600/20 rounded-xl px-4 py-3 text-[14px] text-white/80 placeholder:text-white/20 outline-none focus:border-yellow-500/50 focus:bg-white/[0.05] transition-all duration-200"
              style={{ fontFamily: "'Instrument Serif', serif", fontSize: '17px' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Content field */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest text-yellow-600/50 font-medium">
              Content <span className="text-red-400/50">*</span>
            </label>
            <textarea
              placeholder="Write your note here..."
              className="w-full bg-white/[0.03] border border-yellow-600/20 rounded-xl px-4 py-3 text-[14px] text-white/75 placeholder:text-white/20 outline-none focus:border-yellow-500/50 focus:bg-white/[0.05] transition-all duration-200 min-h-[280px] resize-none leading-relaxed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
            />
          </div>

        </form>

        {content.length > 0 && (
          <p className="mt-3 text-[11px] text-white/20 text-right">
            {content.length} characters
          </p>
        )}

      </div>
    </div>
  );
};

export default CreatePage;