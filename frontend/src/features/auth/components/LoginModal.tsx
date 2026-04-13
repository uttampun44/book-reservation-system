import React, { useState } from "react";
import { X, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { TextInput } from "../components/Input";
import { PasswordInput } from "../components/passwordInput";
import { BookLogo } from "../components/Logo";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../api/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        login();
        onClose(); 
        navigate("/");
      } else {
        setError(response.message || "Invalid email or password.");
      }
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message ||
            "An unexpected error occurred."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl animate-in zoom-in-95 duration-300">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex flex-col items-center gap-4">
          <BookLogo />
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="text-gray-500">
              Sign in to your BookLib account to continue reading.
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <TextInput
            label="Email address"
            placeholder="you@gmail.com"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <PasswordInput
            label="Password"
            placeholder="••••••••••••"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <span
              onClick={() => {
                onClose();
                navigate("/register");
              }}
              className="inline-flex items-center gap-1 font-medium text-[#1A3A2A] hover:underline cursor-pointer"
            >
              Create one <ArrowRight className="h-4 w-4" />
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;