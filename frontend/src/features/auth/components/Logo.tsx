import { LuLibraryBig } from "react-icons/lu";

interface BookLogoProps {
  size?: number; 
  className?: string; 
}

export function BookLogo({ size = 30, className = "" }: BookLogoProps) {
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A3A2A] ${className}`}
    >
      <LuLibraryBig size={size} color="white"/>
    </div>
  );
}