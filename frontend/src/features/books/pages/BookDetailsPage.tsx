import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Loader2, ShoppingBag, Bookmark, BookmarkCheck } from "lucide-react";
import { getBookById } from "../api/getBookList";
import type { Book } from "../types/book";
import { useReservations } from "../hooks/useReservations";
import { useCart } from "../../../context/useCart";
import { useAuth } from "../../auth/hooks/useAuth";
import LoginModal from "../../auth/components/LoginModal";

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [activeTab, setActiveTab] = useState("Description");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { isBookReserved } = useReservations();
  const { addToCart, removeFromCart, isInCart, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      try {
        const data = await getBookById(id);
        if (data) setBook(data);
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoadingBook(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loadingBook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-[#1a2e1a] animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <h2 className="text-2xl font-bold text-[#1a2e1a]">Book not found</h2>
        <Link to="/" className="text-[#2d6a4f] hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Browse
        </Link>
      </div>
    );
  }

  const reserved = isBookReserved(book.id);
  const inCart = isInCart(book.id);
  const canAction = book.inStock && !reserved;

  const handleCartAction = () => {
    if (!canAction) return;

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (inCart) {
      removeFromCart(book.id);
    } else {
      addToCart(book);
      setIsCartOpen(true);
    }
  };

  const getButtonLabel = () => {
    if (reserved) return "Already Reserved";
    if (!book.inStock) return "Unavailable";
    if (inCart) return "Remove from List";
    return "Add to Reservation List";
  };

  const getButtonIcon = () => {
    if (reserved) return <BookmarkCheck className="w-5 h-5" />;
    if (inCart) return <Bookmark className="w-5 h-5" />;
    return <ShoppingBag className="w-5 h-5" />;
  };

  const getButtonStyle = () => {
    if (reserved) return "bg-green-50 text-green-700 border-2 border-green-200 cursor-default opacity-80";
    if (!book.inStock) return "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60";
    if (inCart) return "bg-amber-50 text-amber-800 border-2 border-amber-200 hover:bg-amber-100";
    return "bg-[#1a2e1a] text-white hover:bg-[#2d6a4f]";
  };

  return (
    <div className="min-h-screen bg-white text-[#333] font-sans">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#2d6a4f] font-medium hover:opacity-80 transition-opacity mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Browse</span>
        </Link>

        {/* In-cart notice */}
        {inCart && (
          <div className="mb-6 bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#92400e] py-3 px-6 rounded-2xl font-bold text-sm flex items-center gap-2 animate-in fade-in duration-300">
            <ShoppingBag className="w-4 h-4" />
            This book is in your Reservation List. Open "My List" in the navbar to confirm.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Left Side: Book Cover */}
          <div className="md:col-span-4 lg:col-span-4">
            <div
              className="rounded-3xl overflow-hidden shadow-2xl relative aspect-[2/3] group"
              style={{ backgroundColor: book.coverColor || "#f3f4f6" }}
            >
              <img
                src={book.coverImage?.large || book.imageUrl}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-8 flex flex-col pt-2">

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#2d6a4f] uppercase border border-[#2d6a4f44] px-3 py-1 rounded-full">
                {book.genre} • {book.subGenre || "CLASSIC"}
              </span>
            </div>

            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-black text-[#1a2e1a] mb-2 relative inline-block">
                {book.title}
                <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#3182ce]" />
              </h1>
              <p className="text-xl text-gray-500 mt-3 font-medium">
                {book.author} • {book.publishedYear}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
              <div className="bg-[#f0f4f0] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <div className="text-lg font-bold text-[#1a2e1a]">{book.rating || "4.5"}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-1">Rating</div>
              </div>
              <div className="bg-[#f0f4f0] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <div className="text-lg font-bold text-[#1a2e1a]">{book.reviewCount?.toLocaleString() || "1.2k+"}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-1">Reviews</div>
              </div>
              <div className="bg-[#f0f4f0] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <div className="text-lg font-bold text-[#1a2e1a]">{book.pages}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-1">Pages</div>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-[#2d6a4f] font-bold">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2d6a4f]" />
                <span>{book.inStock ? "Copies available" : "Checking availability..."}</span>
              </div>
              <div className="text-gray-400 font-medium">— ready same day</div>
            </div>

            <div className="mb-10 flex-1">
              <div className="flex gap-8 border-b border-gray-100 mb-6 pb-2">
                {["Description", "Reviews", "Similar Books"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-bold transition-all relative pb-2 ${
                      activeTab === tab ? "text-[#1a2e1a]" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1a2e1a]" />
                    )}
                  </button>
                ))}
              </div>

              <p className="text-gray-600 leading-relaxed text-lg mb-8 italic">
                {book.description || "Loading description..."}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-auto">
              <button
                onClick={handleCartAction}
                disabled={!canAction}
                className={`flex-1 sm:flex-none px-12 py-4 rounded-xl font-black text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${getButtonStyle()}`}
              >
                {getButtonIcon()}
                {getButtonLabel()}
              </button>

              <button className="px-8 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                <Heart className="w-5 h-5" />
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default BookDetailsPage;
