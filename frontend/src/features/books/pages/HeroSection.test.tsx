import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeroSection } from "./HeroSection";

describe("HeroSection", () => {
  it("renders the tagline 'Book Reservation System'", () => {
    render(<HeroSection />);
    expect(screen.getByText("Book Reservation System")).toBeInTheDocument();
  });

  it("renders the main heading 'Discover, Reserve & Read'", () => {
    render(<HeroSection />);
    expect(screen.getByText("Discover, Reserve & Read")).toBeInTheDocument();
  });

  it("renders the description paragraph", () => {
    render(<HeroSection />);
    expect(
      screen.getByText("Browse 12,000+ titles. Reserve in seconds.")
    ).toBeInTheDocument();
  });

  it("renders with the correct header tag", () => {
    render(<HeroSection />);
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });
});
