import React from 'react'
import { PlusIcon, SearchIcon } from 'lucide-react'
import { Link } from 'react-router'

function Navbar({ search, setSearch }) {
  return (
    <header className='bg-base-300 border-b border-base-content/10'>
      <div className='mx-auto max-w-6xl p-4'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          
          {/* Logo */}
          <h1 className='text-3xl font-bold text-primary font-mono tracking-tight'>
            Thinkboard
          </h1>

          {/* Search + Button */}
          <div className='flex items-center gap-3 w-full md:w-auto'>
            
            {/* Search Input */}
            <div className='relative w-full md:w-72'>
              <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/60' />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-bordered w-full pl-9"
              />
            </div>

            {/* New Note Button */}
            <Link to="/create" className="btn btn-primary">
              <PlusIcon className='size-5' />
              <span className='hidden sm:inline'>New Note</span>
            </Link>

          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
