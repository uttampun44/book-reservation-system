import React, { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import {HeroSection} from "./pages/HeroSection"; 

const BookListPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const handleSearchChange = (val: string) => {
    setSearch(val);
  };

  return (
    <div className="min-h-screen bg-[#f5f4f0] font-[Inter]">
      
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