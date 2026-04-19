import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import ConfirmReservationModal from "./ConfirmReservationModal";
import type { Book } from "../types/book";

const mockBook: Book = {
    id: "1",
    title: "Test Book",
    author: "Test Author",
    genre: "Fiction",
    subGenre: "Mystery",
    publishedYear: 2023,
    isbn: "1234567890",
    imageUrl: "test-image.jpg",
    coverImage: {
        small: "small.jpg",
        medium: "medium.jpg",
        large: "large.jpg",
    },
    pages: 300,
    language: "English",
    publisher: "Test Publisher",
    rating: 4.5,
    reviewCount: 100,
    price: 20,
    currency: "USD",
    coverColor: "#000000",
    description: "A test book description",
    tags: ["test", "book"],
    inStock: true,
    available: 5,
    featured: false,
};

describe("ConfirmReservationModal", () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
        books: [mockBook],
        isSubmitting: false,
    };

    it("renders the modal when isOpen is true", () => {
        render(<ConfirmReservationModal {...defaultProps} />);

        expect(screen.getByText("Confirm Reservation")).toBeInTheDocument();
        expect(screen.getByText("Test Book")).toBeInTheDocument();
        expect(screen.getByText("Test Author")).toBeInTheDocument();
    });

    it("does not render when isOpen is false", () => {
        render(<ConfirmReservationModal {...defaultProps} isOpen={false} />);

        expect(screen.queryByText("Confirm Reservation")).not.toBeInTheDocument();
    });

    it("does not render when books array is empty", () => {
        render(<ConfirmReservationModal {...defaultProps} books={[]} />);

        expect(screen.queryByText("Confirm Reservation")).not.toBeInTheDocument();
    });

    it("calls onClose when cancel button is clicked", () => {
        render(<ConfirmReservationModal {...defaultProps} />);

        const cancelButton = screen.getByText("Cancel");
        fireEvent.click(cancelButton);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

  

    it("disables confirm button when isSubmitting is true", () => {
        render(<ConfirmReservationModal {...defaultProps} isSubmitting={true} />);

        const confirmButton = screen.getByText("Processing...");
        expect(confirmButton).toBeDisabled();
    });


});