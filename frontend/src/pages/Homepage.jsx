import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import api from "../lib/axios";
import NotesNotFound from "../components/NotesNotFound";

const Homepage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchNotes = async (searchTerm = "") => {
    setLoading(true);
    try {
      const res = await api.get(`/notes${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""}`);
      setNotes(res.data);
      setIsRateLimited(false);
    } catch (error) {
      if (error.response?.status === 429) {
        setIsRateLimited(true);
      } else {
        toast.error("Failed to load notes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSearch = (value) => {
    fetchNotes(value !== undefined ? value : search);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar search={search} setSearch={setSearch} onSearch={handleSearch} />

      {isRateLimited && <RateLimitedUI />}

      <main className="max-w-6xl mx-auto px-5 py-10">

        {!loading && !isRateLimited && (
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2
                className="text-2xl font-semibold text-white/90 mb-1"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {search ? "Search results" : "Your notes"}
              </h2>
              <p className="text-[13px] text-white/30">
                {notes.length}{" "}
                {notes.length === 1 ? "note" : "notes"}
                {search && ` for "${search}"`}
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/5 bg-zinc-900/40 p-5 space-y-3"
              >
                <div className="h-4 w-3/4 rounded-lg bg-zinc-800/80 animate-pulse" />
                <div className="h-3 w-full rounded-lg bg-zinc-800/50 animate-pulse" />
                <div className="h-3 w-5/6 rounded-lg bg-zinc-800/50 animate-pulse" />
                <div className="h-3 w-4/6 rounded-lg bg-zinc-800/50 animate-pulse" />
                <div className="flex gap-2 pt-2">
                  <div className="h-5 w-12 rounded-full bg-zinc-800/60 animate-pulse" />
                  <div className="h-5 w-16 rounded-full bg-zinc-800/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && notes.length === 0 && !isRateLimited && (
          <NotesNotFound />
        )}

        {!loading && notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note, i) => (
              <div
                key={note._id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
              >
                <NoteCard 
                  note={note} 
                  setNotes={setNotes} 
                  setSearch={setSearch} 
                  onTagClick={(tag) => fetchNotes(tag)}
                />
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default Homepage;