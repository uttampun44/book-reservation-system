import React from 'react';
import { X, Loader2 } from 'lucide-react';
import type { ReservedItem } from '../api/reserveBooks';

interface CancelReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: ReservedItem | null;
  isSubmitting: boolean;
}

const CancelReservationModal: React.FC<CancelReservationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  isSubmitting,
}) => {
  if (!isOpen || !item) return null;

  const reserveDate = new Date(item.reserveDate);
  const pickupDate = new Date(reserveDate);
  pickupDate.setDate(pickupDate.getDate() + 2);
  const returnDate = new Date(reserveDate);
  returnDate.setDate(returnDate.getDate() + 14);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="bg-[#1a3b2b] p-6 text-white flex justify-between items-center relative">
          <h2 className="text-xl font-medium">Cancel Reservation</h2>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors absolute right-4 top-4"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 pb-8 text-left">
          <p className="text-gray-800 text-[15px] mb-4">
            Please confirm cancellation of your reservation.
          </p>

          <div className="bg-[#f4f4f4] rounded-2xl p-5 mb-8 border border-gray-100">
            <div className="space-y-3 text-sm">
              <div className="flex text-gray-500">
                <span className="w-24 shrink-0">Library:</span>
                <span className="text-gray-700">Central Branch</span>
              </div>
              <div className="flex text-gray-500">
                <span className="w-24 shrink-0">Pickup by:</span>
                <span className="text-gray-700">{formatDate(pickupDate)}</span>
              </div>
              <div className="flex text-gray-500">
                <span className="w-24 shrink-0">Return by:</span>
                <span className="text-[#c54b45]">{formatDate(returnDate)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4  border border-gray-300 rounded-xl text-gray-700 font-small hover:bg-gray-50 transition-colors flex items-center justify-center"

            >
              Back
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-2 py-3.5 px-4  text-white bg-[#1a3b2b] rounded-xl font-small hover:bg-[#122a1e] transition-colors"

            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Confirm Cancellation"
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelReservationModal;
