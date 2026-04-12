import React from "react";
import { X } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  isLoading = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="" />
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
           
                <p className="text-sm text-gray-500 font-medium">Are you sure you want to log out?</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all border border-[#1a2e1a] active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold shadow-xl shadow-black/10 hover:bg-[#2a3e2a] active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-80"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Log out</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
