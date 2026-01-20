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
    <div className='min-h-screen'>
      <Navbar search = {search} setSearch = {setSearch} />
      {isRateLimited && <RateLimitedUI />}

      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && (
          <div className='text-center text-primary py-10'>
            Loading notes.....
          </div>
        )}

        {filteredNotes.length === 0 && !isRateLimited && <NotesNotFound />}

        {filteredNotes.length > 0 && !isRateLimited && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredNotes.map(note => (
              <div key={note._id}>
                <NoteCard note={note} setNotes={setNotes} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Homepage
