import React from "react";
import type { ReservedItem } from "../api/reserveBooks";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: ReservedItem | null;
  isSubmitting: boolean;
}

const CancelReservationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  item,
  isSubmitting,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div>
      <h2>Cancel Reservation</h2>

      <p>Are you sure you want to cancel?</p>

      <button onClick={onConfirm} disabled={isSubmitting}>
        {isSubmitting ? "Loading..." : "Confirm"}
      </button>

      <button onClick={onClose}>Back</button>
    </div>
  );
};

export default CancelReservationModal;