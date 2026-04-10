import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./features/books/api/getBookList", () => ({
  getBooks: vi.fn(() => 
    Promise.resolve({ 
      data: [], 
      pagination: { totalPages: 1, totalItems: 0 } 
    })
  ),
}));

describe("App Component", () => {
  it("renders the Book Library landing page after loading", async () => {
    render(<App />);

    expect(screen.getByText(/Loading books/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Loading books/i)).not.toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText("BookLib")).toBeInTheDocument();
    
    expect(screen.getByText("Discover, Reserve & Read")).toBeInTheDocument();
    
    expect(screen.getByText("My Books")).toBeInTheDocument();
  });
});
