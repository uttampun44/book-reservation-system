import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders the brand name 'BookLib'", () => {
    render(<Navbar searchValue="" onSearchChange={vi.fn()} />);
    expect(screen.getByText("BookLib")).toBeInTheDocument();
  });

  it("renders the search input with correct placeholder", () => {
    render(<Navbar searchValue="" onSearchChange={vi.fn()} />);
    expect(
      screen.getByPlaceholderText("Search title, author, ISBN...")
    ).toBeInTheDocument();
  });

  it("displays the current search value in the input", () => {
    render(<Navbar searchValue="Harry Potter" onSearchChange={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search title, author, ISBN...");
    expect(input).toHaveValue("Harry Potter");
  });

  it("calls onSearchChange when user types in the search input", () => {
    const mockOnSearchChange = vi.fn();
    render(<Navbar searchValue="" onSearchChange={mockOnSearchChange} />);
    const input = screen.getByPlaceholderText("Search title, author, ISBN...");
    fireEvent.change(input, { target: { value: "Dune" } });
    expect(mockOnSearchChange).toHaveBeenCalledWith("Dune");
  });

  it("shows a clear (×) button when searchValue is not empty", () => {
    render(<Navbar searchValue="Dune" onSearchChange={vi.fn()} />);
    expect(screen.getByText("×")).toBeInTheDocument();
  });

  it("hides the clear button when searchValue is empty", () => {
    render(<Navbar searchValue="" onSearchChange={vi.fn()} />);
    expect(screen.queryByText("×")).not.toBeInTheDocument();
  });

  it("calls onSearchChange with empty string when clear button is clicked", () => {
    const mockOnSearchChange = vi.fn();
    render(<Navbar searchValue="Dune" onSearchChange={mockOnSearchChange} />);
    fireEvent.click(screen.getByText("×"));
    expect(mockOnSearchChange).toHaveBeenCalledWith("");
  });

  it("renders 'My Books' and 'Sign up' buttons", () => {
    render(<Navbar searchValue="" onSearchChange={vi.fn()} />);
    expect(screen.getByText("My Books")).toBeInTheDocument();
    expect(screen.getAllByText("Sign up")[0]).toBeInTheDocument();
  });
});
