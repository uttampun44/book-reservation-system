import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ITEMS_PER_PAGE } from "./types";
import Navbar from "../../components/layout/Navbar";
import { HeroSection } from "./pages/HeroSection";
import FilterBar from "./pages/filterBar";
import BookGrid from "./pages/BookList";
import { getBooks } from "./api/getBookList";
import type { Book, Pagination } from "./types/book";

const App: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [activeGenre, setActiveGenre] = useState("All");
    const [sortBy, setSortBy] = useState("Most Popular");
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [perPage, setPerPage] = useState(Number(searchParams.get("perPage")) || ITEMS_PER_PAGE);

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState<Pagination | null>(null);

    const updateUrlParams = useCallback((newPage: number, newPerPage: number) => {
        setSearchParams({ page: String(newPage), perPage: String(newPerPage) });
    }, [setSearchParams]);

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

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        setPage(1);
    };

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const data = await getBooks(page, perPage, sortBy);
        
                setBooks(data.data);
                setPagination(data.pagination);
            } catch (err) {
                console.error("Error fetching books:", err);
                setError("Failed to load books");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [page, perPage, sortBy]);

    // (Filter & sort) 
    const filteredBooks = useMemo(() => {
        return books?.filter((book) => {
            const matchesSearch =
                book.title.toLowerCase().includes(search.toLowerCase()) ||
                book.author.toLowerCase().includes(search.toLowerCase()) ||
                (book.isbn && book.isbn.includes(search));

            const matchesGenre =
                activeGenre === "All" || book.genre === activeGenre;

            return matchesSearch && matchesGenre;
        }).sort((a, b) => {
            switch (sortBy) {
                case "Highest Rated": return b.rating - a.rating;
                case "Most Available": return b.available - a.available;
                case "Title A–Z": return a.title.localeCompare(b.title);
                default: return b.rating - a.rating;
            }
        });
    }, [books, search, activeGenre, sortBy]);

    const totalPages = pagination?.totalPages || 1;
    const hasNextPage = pagination?.hasNextPage || false;
    const hasPrevPage = pagination?.hasPrevPage || false;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading books...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p style={{ color: "red" }}>{error}</p>
            </div>
        );
    }

    const safeFilteredBooks = filteredBooks ?? [];

    return (
        <div
            className="min-h-screen"
            style={{ background: "#f5f4f0", fontFamily: "'Inter', sans-serif" }}
        >
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f5f4f0; }
        ::-webkit-scrollbar-thumb { background: #c8c4b8; border-radius: 3px; }
      `}</style>

            <Navbar searchValue={search} onSearchChange={handleSearchChange} />

            <HeroSection
            />

            <FilterBar
                activeGenre={activeGenre}
                sortBy={sortBy}
                perPage={perPage}
                onGenreChange={handleGenreChange}
                onSortChange={handleSortChange}
                onPerPageChange={handlePerPageChange}
            />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <BookGrid
                    books={safeFilteredBooks}
                    totalCount={pagination?.totalItems || safeFilteredBooks.length}
                    searchQuery={search}
                />

                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-2">
                        <button
                            onClick={() => {
                                if (hasPrevPage) {
                                    const newPage = page - 1;
                                    setPage(newPage);
                                    updateUrlParams(newPage, perPage);
                                }
                            }}
                            disabled={!hasPrevPage}
                            className={`px-4 py-2 border rounded-md font-medium transition-colors ${!hasPrevPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e8e6df]'
                                }`}
                            style={{ borderColor: "#c8c4b8", color: "#1a2e1a" }}
                        >
                            Previous
                        </button>

                        <div className="flex gap-1 mx-2">
                            {(() => {
                                const range = [];
                                const delta = 1; 
                                
                                for (let i = 1; i <= totalPages; i++) {
                                    if (
                                        i === 1 || 
                                        i === totalPages || 
                                        (i >= page - delta && i <= page + delta)
                                    ) {
                                        range.push(i);
                                    } else if (range[range.length - 1] !== "...") {
                                        range.push("...");
                                    }
                                }

                                return range.map((p, i) => (
                                    p === "..." ? (
                                        <span key={`dots-${i}`} className="px-2 self-center">...</span>
                                    ) : (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                const newPage = p as number;
                                                setPage(newPage);
                                                updateUrlParams(newPage, perPage);
                                            }}
                                            className="w-10 h-10 rounded-md font-medium transition-colors"
                                            style={{
                                                backgroundColor: page === p ? "#1a2e1a" : "transparent",
                                                color: page === p ? "#fff" : "#1a2e1a",
                                                border: page === p ? "none" : "1px solid #c8c4b8"
                                            }}
                                        >
                                            {p}
                                        </button>
                                    )
                                ));
                            })()}
                        </div>

                        <button
                            onClick={() => {
                                if (hasNextPage) {
                                    const newPage = page + 1;
                                    setPage(newPage);
                                    updateUrlParams(newPage, perPage);
                                }
                            }}
                            disabled={!hasNextPage}
                            className={`px-4 py-2 border rounded-md font-medium transition-colors ${!hasNextPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e8e6df]'
                                }`}
                            style={{ borderColor: "#c8c4b8", color: "#1a2e1a" }}
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;