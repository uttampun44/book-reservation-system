import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Menu, X, User, BookmarkCheck } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useReservations } from "../../features/books/hooks/useReservations";
import LogoutModal from "../../features/auth/components/LogoutModal";

interface NavbarProps {
  searchValue: string;
  onSearchChange: (val: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchValue, onSearchChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { reservedBooks } = useReservations();

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsLogoutModalOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
            onClick={() => navigate("/reservations")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-black/5 hover:bg-gray-50 transition-all active:scale-95 group relative"
          >
            <BookmarkCheck className="w-5 h-5 text-[#1a2e1a] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-[#1a2e1a]">Reservations</span>
            {reservedBooks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c9a84c] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#f5f4f0] animate-in zoom-in duration-300">
                {reservedBooks.length}
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
                onClick={() => setIsLogoutModalOpen(true)}
                className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors pr-1"
              >
                Log out
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
            <Search className="w-4 h-4 text-gray-400" />
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 text-sm font-bold text-[#1a2e1a] pt-2">
            <Link to="/" className="py-2 hover:opacity-70 transition-opacity" onClick={() => setMobileOpen(false)}>Browse Library</Link>
            <Link to="/reservations" className="py-2 flex items-center justify-between hover:opacity-70 transition-opacity" onClick={() => setMobileOpen(false)}>
              My Reservations
              {reservedBooks.length > 0 && (
                <span className="bg-[#c9a84c] text-white px-2 py-0.5 rounded-full text-[10px]">{reservedBooks.length}</span>
              )}
            </Link>
            {!isAuthenticated && (
              <button 
                onClick={() => navigate("/login")}
                className="mt-2 w-full py-3 rounded-xl bg-[#1a2e1a] text-white"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      )}

      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default Navbar;