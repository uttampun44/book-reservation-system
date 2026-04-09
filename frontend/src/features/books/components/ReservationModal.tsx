import React from "react";
import { X, CheckCircle, Info } from "lucide-react";
import type { Book } from "../types/book";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: Book[];
}

const ReservationModal: React.FC<ReservationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  items 
}) => {
  if (!isOpen) return null;

  const totalCount = items.length;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 overflow-hidden">
      {/* Backdrop with higher blur for focus */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Decorative header */}
        <div className="h-2 bg-[#c9a84c]" />
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1a2e1a] font-[Lora]">Confirm Reservation</h3>
                <p className="text-sm text-gray-500 font-medium">Finalize your book selection</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Summary Box */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-black/5 mb-8">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/5">
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Reservation Summary</span>
              <span className="text-xs font-bold bg-[#1a2e1a] text-white px-2.5 py-1 rounded-full">{totalCount} Books</span>
            </div>
            
            <ul className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((book) => (
                <li key={book.id} className="flex justify-between items-center group">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-bold text-[#1a2e1a] text-sm truncate group-hover:text-[#c9a84c] transition-colors">{book.title}</p>
                    <p className="text-xs text-gray-400">{book.author}</p>
                  </div>
                  <span className="text-sm font-bold text-[#1a2e1a] tabular-nums">${book.price}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-black/5 flex justify-between items-center">
              <span className="font-bold text-[#1a2e1a]">Total Price Due</span>
              <span className="text-2xl font-black text-[#1a2e1a]">
                ${items.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Info section */}
          <div className="flex gap-3 px-2 mb-8">
            <div className="flex-shrink-0 mt-0.5">
              <Info className="w-4 h-4 text-[#c9a84c]" />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              By confirming, you agree to reserve these books for <span className="text-gray-600 font-bold">48 hours</span>. Please visit our main desk with your library ID to collect them.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all border border-transparent active:scale-95"
            >
              Edit Selection
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-4 rounded-2xl bg-[#1a2e1a] text-white font-bold shadow-xl shadow-black/10 hover:opacity-95 active:scale-95 transition-all"
            >
              Confirm & Reserve
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e2e2; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ReservationModal;
