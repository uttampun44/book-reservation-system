import React from "react";
import { GENRES, SORT_OPTIONS } from "../types";

interface FilterBarProps {
  activeGenre: string;
  sortBy: string;
  onGenreChange: (genre: string) => void;
  onSortChange: (sort: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeGenre,
  sortBy,
  onGenreChange,
  onSortChange,
}) => {
  return (
    <div
      className="sticky top-[65px] z-40 px-6 py-3 flex items-center gap-3 overflow-x-auto"
      style={{
        background: "rgba(245,244,240,0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        scrollbarWidth: "none",
      }}
    >
      <span className="text-sm font-medium shrink-0" style={{ color: "#888" }}>
        Filter by:
      </span>

      {GENRES.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreChange(genre)}
          className="px-4 py-1.5 rounded-full text-sm font-semibold shrink-0 transition-all duration-200"
          style={
            activeGenre === genre
              ? { background: "#1a2e1a", color: "#fff" }
              : {
                  background: "transparent",
                  color: "#555",
                  border: "1.5px solid rgba(0,0,0,0.14)",
                }
          }
        >
          {genre}
        </button>
      ))}

      {/* Sort dropdown — pushed to the right */}
      <div className="ml-auto shrink-0">
        <select
          className="text-sm font-medium px-3 py-1.5 rounded-xl outline-none appearance-none cursor-pointer"
          style={{
            background: "#fff",
            color: "#1a2e1a",
            border: "1.5px solid rgba(0,0,0,0.1)",
          }}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterBar;