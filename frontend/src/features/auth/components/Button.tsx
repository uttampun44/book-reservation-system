import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ fullWidth, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`${
        fullWidth ? "w-full" : ""
      } h-12 rounded-lg bg-[#1A3A2A] text-white font-medium hover:bg-[#153124] transition ${className}`}
    />
  );
};