import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft,  Heart, Loader2 } from "lucide-react";
import { getBookById } from "../api/getBookList";
import type { Book } from "../types/book";
import { useReservations } from "../hooks/useReservations";
import ReservationModal from "../components/ReservationModal";

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loadingBook, setLoadingBook] = useState(true);
  const [activeTab, setActiveTab] = useState("Description");
  const { isBookReserved, handleReserve, handleUnreserve, loading: reservationLoading } = useReservations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);

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

  const handleReservationAction = async () => {
    if (reserved) {
      await handleUnreserve(book.id);
    } else {
      setIsModalOpen(true);
    }
  };

  const onConfirmReservation = async () => {
    setReservationError(null);
    const result = await handleReserve(book);
    if (result.success) {
      setIsModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setReservationError(result.message || "Failed to reserve book");
    }
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

        {showSuccess && (
          <div 
            className="mb-6 bg-[#c9a84c] text-white py-3 px-6 rounded-2xl text-center font-bold animate-in fade-in slide-in-from-top-4 duration-300 shadow-md"
          >
            ✨ Reservation Confirmed! You can view it in your reservations list.
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
                <div className="text-lg font-bold text-[#1a2e1a]">
                  {book.rating || "4.5"}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-1">Rating</div>
              </div>
              <div className="bg-[#f0f4f0] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <div className="text-lg font-bold text-[#1a2e1a]">
                  {book.reviewCount?.toLocaleString() || "1.2k+"}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-1">Reviews</div>
              </div>
              <div className="bg-[#f0f4f0] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <div className="text-lg font-bold text-[#1a2e1a]">
                  {book.pages}
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mt-1">Pages</div>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-8">
               <div className="flex items-center gap-2 text-[#2d6a4f] font-bold">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#2d6a4f]" />
                 <span>{book.inStock ? "Copies available" : "Checking availability..."}</span>
               </div>
               <div className="text-gray-400 font-medium">
                 — ready same day
               </div>
            </div>

            <div className="mb-10 flex-1">
               <div className="flex gap-8 border-b border-gray-100 mb-6 pb-2">
                 {["Description", "Reviews", "Similar Books"].map(tab => (
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
                onClick={handleReservationAction}
                disabled={reservationLoading || !book.inStock}
                className={`flex-1 sm:flex-none px-12 py-4 rounded-xl font-black text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
                  reserved 
                    ? "bg-[#ef444415] text-[#ef4444] border-2 border-[#ef444430] hover:bg-[#ef444425]" 
                    : "bg-[#1a2e1a] text-white hover:bg-[#2d6a4f]"
                } ${(!book.inStock) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {reservationLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : null}
                {reserved ? "Unreserve Book" : "Reserve this Book"}
              </button>
              
              <button 
                className="px-8 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
              >
                <Heart className="w-5 h-5" />
                Add to Wishlist
              </button>
            </div>

          </div>
        </div>
      </div>

      <ReservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onConfirmReservation}
        items={[book]}
        isLoading={reservationLoading}
        error={reservationError}
      />
    </div>
  );
};

export default BookDetailsPage;

