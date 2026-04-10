import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ label, ...props }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="flex flex-col space-y-1 relative">
            <label className="text-sm text-gray-700">{label}</label>
            <input
                {...props}
                type={show ? "text" : "password"}
                className="w-full h-12 px-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-0 h-full flex pt-4 items-center text-gray-400 hover:text-gray-700"
            >
                {show ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
        </div>
    );
};