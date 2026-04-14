import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { TextInput } from "../components/Input";
import { PasswordInput } from "../components/passwordInput";
import { BookLogo } from "../components/Logo";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../api/auth";
import { toast } from "react-toastify";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
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
        toast.success("Welcome back! Login successful.");
        navigate("/");
      } else {
        const msg = response.message || "Invalid email or password.";
        toast.error(msg);
      }
    } catch (err: unknown) {
      let msg = "An unexpected error occurred.";
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        msg = axiosError.response?.data?.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
        <div className="flex flex-col items-center gap-4">
          <BookLogo />
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500">
              Sign in to your BookLib account to continue reading.
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

          <div className="pt-2">
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
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="inline-flex items-center gap-1 font-medium text-[#1A3A2A] hover:underline"
            >
              Create one <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;