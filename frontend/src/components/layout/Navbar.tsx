import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface NavbarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchValue, onSearchChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
const navigate = useNavigate();
  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#f5f4f0]/90 backdrop-blur-md border-b border-black/10">
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1a2e1a]">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-[#1a2e1a] font-[Lora]">
            BookLib
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full flex-1 max-w-md mx-8 bg-[#ece9e2] border border-black/10">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            className="flex-1 bg-transparent outline-none text-sm text-[#1a2e1a] placeholder-gray-400"
            placeholder="Search title, author, ISBN..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button className="text-sm font-medium text-[#1a2e1a] hover:opacity-70 transition-opacity">
            My Books
          </button>
          <button onClick={()=> navigate("/register")} className="px-5 py-2 rounded-full text-sm font-bold bg-[#c9a84c] text-white hover:opacity-90 active:scale-95 transition-all">
            Sign up
          </button>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#1a2e1a" strokeWidth="2">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-3 bg-[#ece9e2] border-b border-black/10">
          
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex gap-4 text-sm font-medium text-[#1a2e1a]">
            <button>Browse</button>
            <button>My Books</button>
            <button className="ml-auto px-4 py-1.5 rounded-full font-bold text-white bg-[#c9a84c]">
              Sign up
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;