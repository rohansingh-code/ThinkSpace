import React from 'react'
import { PlusIcon, SearchIcon, BrainIcon } from 'lucide-react'
import { Link } from 'react-router'

function Navbar({ search, setSearch }) {
  return (
    <header className="bg-base-100 border-b border-base-300">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <BrainIcon className="size-7 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight leading-none">
              <span className="text-primary">Think</span>
              <span className="text-base-content">Space</span>
            </h1>
          </div>

          {/* Search + Button */}
          <div className="flex items-center gap-3 w-full md:w-auto">

            {/* Search */}
            <div className="relative w-full md:w-80">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  input input-bordered w-full pl-9
                  h-11 text-sm
                "
              />
            </div>

            {/* Add Note */}
            <Link
              to="/create"
              className="btn btn-primary h-11 min-h-0 px-5"
            >
              <PlusIcon className="size-4" />
              <span className="hidden sm:inline">New Note</span>
            </Link>

          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
