import React, { useState, useMemo } from "react";
import { BOOKS, ITEMS_PER_PAGE } from "./types";
import Navbar from "../../components/layout/Navbar";
import { HeroSection } from "./pages/HeroSection";
import FilterBar from "./pages/filterBar";
import BookGrid from "./pages/BookList";

const App: React.FC = () => {
    const [search, setSearch] = useState("");
    const [activeGenre, setActiveGenre] = useState("All");
    const [sortBy, setSortBy] = useState("Most Popular");
    const [page, setPage] = useState(1);

    const handleSearchChange = (val: string) => {
        setSearch(val);
        setPage(1);
    };

    const handleGenreChange = (genre: string) => {
        setActiveGenre(genre);
        setPage(1);
    };

    const handleSortChange = (sort: string) => {
        setSortBy(sort);
        setPage(1);
    };

    // Filter & sort
    const filteredBooks = useMemo(() => {
        return BOOKS.filter((book) => {
            const matchesSearch =
                book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase()) ||
                (book.isbn && book.isbn.includes(search));
            const matchesGenre = activeGenre === "All" || book.genre === activeGenre;
            return matchesSearch && matchesGenre;
        }).sort((a, b) => {
            switch (sortBy) {
                case "Highest Rated": return b.rating - a.rating;
                case "Most Available": return b.available - a.available;
                case "Title A–Z": return a.title.localeCompare(b.title);
                default: return b.rating - a.rating; // Most Popular
            }
        });
    }, [search, activeGenre, sortBy]);

    const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
    const paginatedBooks = filteredBooks.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <div className="min-h-screen" style={{ background: "#f5f4f0", fontFamily: "'Inter', sans-serif" }}>
            {/* Google Fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f5f4f0; }
        ::-webkit-scrollbar-thumb { background: #c8c4b8; border-radius: 3px; }
      `}</style>

            <Navbar searchValue={search} onSearchChange={handleSearchChange} />

            <HeroSection searchValue={search} onSearchChange={handleSearchChange} />

            <FilterBar
                activeGenre={activeGenre}
                sortBy={sortBy}
                onGenreChange={handleGenreChange}
                onSortChange={handleSortChange}
            />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <BookGrid
                    books={paginatedBooks}
                    totalCount={filteredBooks.length}
                    searchQuery={search}
                />


            </main>

        </div>
    );
};

export default App;