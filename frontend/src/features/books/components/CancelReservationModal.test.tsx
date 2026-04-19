import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CancelReservationModal from "./CancelReservationModal";

describe("CancelReservationModal", () => {
  it("renders when open", () => {
    render(
      <CancelReservationModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        item={{ id: "1", reserveDate: "2024-01-01" } }
        isSubmitting={false}
      />
    );

    expect(screen.getByText("Cancel Reservation")).toBeInTheDocument();
  });
});