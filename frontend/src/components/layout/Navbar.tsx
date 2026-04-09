import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useCart } from "../../features/books/hooks/useCart";
import { useAuth } from "../../features/auth/hooks/useAuth";

interface NavbarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchValue, onSearchChange, onOpenCart }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#f5f4f0]/90 backdrop-blur-md border-b border-black/10">
        
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1a2e1a] shadow-lg shadow-black/10">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1a2e1a] font-[Lora]">
            BookLib
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-full flex-1 max-w-md mx-8 bg-white/50 border border-black/5 shadow-inner transition-all focus-within:bg-white focus-within:shadow-md focus-within:border-black/10">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            className="flex-1 bg-transparent outline-none text-sm text-[#1a2e1a] placeholder-gray-400"
            placeholder="Search title, author, ISBN..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange("")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-white border border-black/5 hover:bg-gray-50 transition-all active:scale-95 group"
          >
            <ShoppingBag className="w-5 h-5 text-[#1a2e1a] group-hover:scale-110 transition-transform" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c9a84c] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                {totalItems}
              </span>
            )}
          </button>

          <div className="h-6 w-[1px] bg-black/10 mx-1" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2">
              <div className="w-8 h-8 rounded-full bg-[#1a2e1a]/5 flex items-center justify-center border border-black/5">
                <User className="w-4 h-4 text-[#1a2e1a]" />
              </div>
              <button 
                onClick={logout}
                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors pr-1"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate("/login")} 
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#1a2e1a] text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-black/10"
            >
              Sign in
            </button>
          )}
        </div>

        <button className="md:hidden p-2 rounded-lg bg-black/5" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="w-6 h-6 text-[#1a2e1a]" />
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col gap-3 bg-[#ece9e2] border-b border-black/10">

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#888" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex gap-4 text-sm font-medium text-[#1a2e1a]">
            <button>Browse</button>
            <button>My Books</button>
            <button className="ml-auto px-4 py-1.5 rounded-full font-bold text-white bg-[#c9a84c]">
              Sign up
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;