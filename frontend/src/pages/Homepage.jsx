import React, { useEffect, useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI'
import toast from 'react-hot-toast'
import NoteCard from '../components/NoteCard'
import api from './lib/axios'
import NotesNotFound from '../components/NotesNotFound'

const Homepage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes")
        setNotes(res.data)
        setIsRateLimited(false)
      } catch (error) {
        if (error.response?.status === 429) {
          setIsRateLimited(true)
        } else {
          toast.error("Failed to load notes")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes
    return notes.filter(note =>
      note.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [notes, search])

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar search={search} setSearch={setSearch} />

      {isRateLimited && <RateLimitedUI />}

      <main className="max-w-7xl mx-auto p-4 mt-6">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-base-100 border border-base-300 rounded-md p-4 space-y-3"
              >
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-3 w-full"></div>
                <div className="skeleton h-3 w-5/6"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filteredNotes.length === 0 && !isRateLimited && (
          <NotesNotFound />
        )}

        {/* Notes Grid */}
        {!loading && filteredNotes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <div key={note._id}>
                <NoteCard note={note} setNotes={setNotes} />
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

export default Homepage
