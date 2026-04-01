import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
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
    <div className="min-h-screen bg-transparent">


      <div className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/60 backdrop-blur-2xl">
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back
          </Link>

          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="flex items-center gap-2 h-8 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 shadow-md shadow-amber-500/10 text-[12px] font-bold transition-all duration-200"
          >
            {loading ? (
              <div className="size-3 rounded-full border-2 border-zinc-950/30 border-t-zinc-950 animate-spin" />
            ) : (
              <SparklesIcon className="size-3 stroke-[2.5]" />
            )}
            {loading ? "Creating..." : "Create Note"}
          </button>
        </div>
      </div>


      <div className="max-w-2xl mx-auto px-5 py-12">

        <div className="mb-8 rounded-xl border border-amber-500/10 bg-amber-500/[0.03] px-4 py-3 flex items-center gap-3 shadow-inner">
          <SparklesIcon className="size-4 text-amber-500/60 shrink-0" />
          <p className="text-[12px] text-zinc-400 leading-relaxed">
            AI will automatically generate a <span className="text-amber-500/80">title</span>, <span className="text-amber-500/80">summary</span>, and <span className="text-amber-500/80">tags</span> for your note.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">


          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold mb-1 block">
              Title <span className="normal-case text-zinc-700">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Leave empty to auto-generate..."
              className="w-full bg-zinc-900/30 border border-white/5 rounded-lg px-4 py-3 text-[14px] text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200 shadow-inner"
              style={{ fontFamily: "'Instrument Serif', serif", fontSize: '17px' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>


          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold mb-1 block">
              Content <span className="text-red-400/50">*</span>
            </label>
            <textarea
              placeholder="Write your note here..."
              className="w-full bg-zinc-900/30 border border-white/5 rounded-lg px-4 py-3 text-[14px] text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200 min-h-[280px] resize-none leading-relaxed shadow-inner"
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