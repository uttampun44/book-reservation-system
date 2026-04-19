import React, { useState } from "react";
import { X, ChevronDown} from "lucide-react";
import type { Book } from "../types/book";

interface ConfirmReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pickupDate: string, duration: string) => void;
  books: Book[];
  isSubmitting: boolean;
}

const ConfirmReservationModal: React.FC<ConfirmReservationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  books,
  isSubmitting,
}) => {
  const [pickupDate] = useState<Date>(new Date());
  const [loanDuration, setLoanDuration] = useState("2 weeks");

  if (!isOpen || books.length === 0) return null;

  const book = books[0]; 
  const displayTitle = books.length > 1 ? `${book.title} + ${books.length - 1} more` : book.title;
  const displayAuthor = books.length > 1 ? "Multiple Authors" : book.author;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getReturnDate = () => {
    const date = new Date(pickupDate);
    const weeks = parseInt(loanDuration);
    date.setDate(date.getDate() + weeks * 7);
    return date;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-[#1a3b2b] p-6 text-white flex justify-between items-start relative">
          <div className="flex-1 pr-8">
            <h2 className="text-xl font-bold tracking-tight">Confirm Reservation</h2>
            <p className="text-white/70 text-sm mt-1">
              {displayTitle} · {displayAuthor}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
              PICKUP DATE
            </label>
            <div className="flex items-center justify-between p-4 bg-[#f9f7f2] rounded-2xl border border-gray-100">
              <span className="text-gray-700 font-medium">{formatDate(pickupDate)}</span>
           
            </div>
          </div>

          <div className="mb-8">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
              LOAN DURATION
            </label>
            <div className="relative">
              <select
                value={loanDuration}
                onChange={(e) => setLoanDuration(e.target.value)}
                className="w-full appearance-none p-4 bg-[#f9f7f2] rounded-2xl border border-gray-100 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#1a3b2b]/10 transition-all"
              >
                <option>1 week</option>
                <option>2 weeks</option>
                <option>3 weeks</option>
                <option>4 weeks</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-[#f4f4f4] rounded-2xl overflow-hidden mb-8">
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Library</span>
                <span className="text-gray-700 font-medium">Central Branch</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Pickup by</span>
                <span className="text-gray-700 font-medium">{formatDateShort(pickupDate)}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                <span className="text-gray-400">Return by</span>
                <span className="text-[#c54b45] font-bold">{formatDateShort(getReturnDate())}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-gray-200 pt-3">
                <span className="text-gray-400">Fee</span>
                <span className="text-[#2d6a4f] font-bold">Free</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 border border-gray-200 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(pickupDate.toISOString(), loanDuration)}
              disabled={isSubmitting}
              className="flex-1.5 py-2 px-10  bg-[#1a3b2b] text-white rounded-2xl font-bold hover:bg-[#122a1e] transition-all active:scale-95 flex items-center justify-center disabled:opacity-70"
            >
              {isSubmitting ? "Processing..." : "Confirm Reservation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmReservationModal;
