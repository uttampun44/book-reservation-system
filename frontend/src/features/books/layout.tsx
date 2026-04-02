import React, { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { HeroSection } from "./pages/HeroSection";

const BookListPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (val: string) => {
    setSearch(val);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#f5f4f0",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Navbar */}
      <Navbar
        searchValue={search}
        onSearchChange={handleSearchChange}
      />

      {/* Hero Section */}
      <HeroSection
        searchValue={search}
        onSearchChange={handleSearchChange}
      />

    </div>
  );
};

export default BookListPage;