import React from 'react'
import SearchIcon from '../assets/SearchIcon'

const handleSearch = () => {
    
}

interface Props {
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}

function SearchBar({setSearchTerm} : Props) {
  return (
    <div className="relative">
        <input type="text" id="search-input" placeholder="Search Assets" className="input input-bordered w-full bg-white rounded-full" onChange={(event) => setSearchTerm(event.target.value)}/>
        <button className="absolute inset-y-0 right-4" onClick={() => {
            let element = document.getElementById("search-input") as HTMLInputElement | null
            if (element?.value) {
                setSearchTerm(element?.value)
            }
        }}>    
        <SearchIcon></SearchIcon>
        </button>
    </div>
  )
}

export default SearchBar