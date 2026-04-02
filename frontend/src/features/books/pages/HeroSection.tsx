import React from "react";

interface HeroProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
}

export const HeroSection: React.FC<HeroProps> = () => {
  return (
    <header className="relative overflow-hidden px-6 py-16 text-center bg-[linear-gradient(160deg,#1a2e1a_0%,#2d4a2d_60%,#3a5a3a_100%)]">
      
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10 pointer-events-none bg-[#c9a84c]" />
      
      <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full opacity-5 pointer-events-none bg-white" />

      <div className="relative z-10 max-w-3xl mx-auto">
        
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-[#c9a84c55] text-[#c9a84c] bg-[rgba(201,168,76,0.08)]">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="#c9a84c">
            <polygon points="5,0 6.2,3.8 10,3.8 7,6.2 8.1,10 5,7.6 1.9,10 3,6.2 0,3.8 3.8,3.8" />
          </svg>
          Book Reservation System
        </span>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 text-white font-[Lora]">
          Discover, Reserve & Read
        </h1>

        <p className="text-lg mb-10 text-white/60">
          Browse 12,000+ titles. Reserve in seconds.
        </p>

        {/* Hero search (optional - kept same design) */}
        {/*
        <div className="flex rounded-2xl overflow-hidden shadow-2xl max-w-xl mx-auto border border-white/10">
          <input
            className="flex-1 px-5 py-4 text-sm outline-none bg-white text-[#1a2e1a]"
            placeholder="What do you want to read next?"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button className="px-7 py-4 text-sm font-bold tracking-wide transition-all hover:opacity-90 active:scale-95 bg-[#1a2e1a] text-white border-l border-white/10">
            Search
          </button>
        </div>
        */}
        
      </div>
    </header>
  );
};
