import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Book as BookIcon, Calendar, Trash2, Loader2, Info, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../../components/layout/Navbar";
import { useReservations } from "../hooks/useReservations";
import { useAuth } from "../../auth/hooks/useAuth";
import CancelReservationModal from "../components/CancelReservationModal";
import type { ReservedItem } from "../api/reserveBooks";

const MyReservationsPage: React.FC = () =>想定
  const { isAuthenticated } = useAuth();
  const { reservedBooks, loading, error, handleUnreserve } = useReservations();

  const [cancelItem, setCancelItem] = useState<ReservedItem | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCancelling, setIsCancelling] = useState(false);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(reservedBooks.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = reservedBooks.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleOpenCancelModal = (item: ReservedItem) => {
    setCancelItem(item);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelItem) return;
    const bookId = cancelItem.book?.id || cancelItem.bookId;
    if (!bookId) return;

    setIsCancelling(true);
    await handleUnreserve(bookId);
    setIsCancelling(false);
    setIsCancelModalOpen(false);
    setCancelItem(null);
    
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f5f4f0]" style={{ fontFamily: "'Inter', sans-serif" }}>
       <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <Navbar searchValue="" onSearchChange={() => {}} />

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <Link 
              to="/books" 
              className="inline-flex items-center gap-2 text-[#2d6a4f] font-medium hover:opacity-80 transition-opacity mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Browse</span>
            </Link>
            <h1 className="text-4xl font-black text-[#1a2e1a] font-[Lora]">My Reservations</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage your currently reserved books</p>
          </div>
          
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-black/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#1a2e1a] flex items-center justify-center text-white">
               <BookIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Active</p>
              <p className="text-xl font-black text-[#1a2e1a]">{reservedBooks.length} Books</p>
            </div>
          </div>
        </div>

        {loading && reservedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-black/5 shadow-sm">
             <Loader2 className="w-12 h-12 text-[#1a2e1a] animate-spin mb-4" />
             <p className="text-gray-500 font-medium">Loading your reservations...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
             <p className="text-red-600 font-bold">{error}</p>
             <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
             >
               Try Again
             </button>
          </div>
        ) : reservedBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200 text-center px-6">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <BookIcon className="w-10 h-10 text-gray-300" />
             </div>
             <h3 className="text-2xl font-bold text-[#1a2e1a] mb-2">No active reservations</h3>
             <p className="text-gray-400 max-w-sm mb-8">
               You haven't reserved any books yet. Browse our collection and pick something you'd like to read!
             </p>
             <Link 
              to="/books" 
              className="px-8 py-3 bg-[#1a2e1a] text-white rounded-xl font-bold hover:bg-[#2d6a4f] transition-all active:scale-95 shadow-lg shadow-black/10"
             >
               Browse Library
             </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {currentItems.map((item) => (
              <div 
                key={item._id || item.id} 
                className="group bg-white rounded-3xl p-6 border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 relative overflow-hidden"
              >
                <div 
                  className="w-full md:w-32 h-48 md:h-40 rounded-2xl overflow-hidden flex-shrink-0 shadow-md relative"
                  style={{ backgroundColor: item.book?.coverColor || item.bookDetails?.coverColor || "#f3f4f6" }}
                >
                  <img 
                    src={item.book?.coverImage?.medium || item.book?.imageUrl || item.bookDetails?.coverImage?.medium || item.bookDetails?.imageUrl} 
                    alt={item.book?.title || item.bookDetails?.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </div>

                <div className="flex-1 flex flex-col py-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-[#1a2e1a] group-hover:text-[#c9a84c] transition-colors font-[Lora]">
                        {item.book?.title || item.bookDetails?.title}
                      </h3>
                      <p className="text-gray-500 font-medium">{item.book?.author || item.bookDetails?.author}</p>
                    </div>
                    <button 
                      onClick={() => handleOpenCancelModal(item)}
                      disabled={loading || isCancelling}
                      className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                      title="Unreserve book"
                    >
                      {loading || isCancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-6">
                     <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        <span>Reserved {new Date(item.reserveDate).toLocaleDateString()}</span>
                     </div>
                     <div className="flex items-center gap-2 text-[#2d6a4f] text-sm font-bold bg-[#f0fdf4] px-3 py-1 rounded-full border border-[#2d6a4f20]">
                        <Info className="w-4 h-4" />
                        <span>Pickup within 48h</span>
                     </div>
                  </div>
                </div>

                <div 
                  className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-[0.03] transition-opacity group-hover:opacity-[0.07]"
                  style={{ backgroundColor: item.book?.coverColor || item.bookDetails?.coverColor || "#1a2e1a" }}
                />
              </div>
            ))}
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-10 bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#1a2e1a] bg-gray-50 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        currentPage === i + 1
                          ? "bg-[#1a2e1a] text-white shadow-md"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#1a2e1a] bg-gray-50 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <CancelReservationModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setCancelItem(null);
        }}
        onConfirm={handleConfirmCancel}
        item={cancelItem}
        isSubmitting={isCancelling}
      />
    </div>
  );
};

export default MyReservationsPage;
