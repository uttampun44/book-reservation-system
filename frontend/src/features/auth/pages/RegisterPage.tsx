import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { TextInput } from "../components/Input";
import { PasswordInput } from "../components/passwordInput";
import { BookLogo } from "../components/Logo";
import { registerUser } from "../api/auth";
import { toast } from "react-toastify";

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullname || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const msg = response.message || "Registration failed.";
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
        <div className="flex flex-col items-center gap-2">
          <BookLogo />
          <h1 className="text-2xl font-semibold text-gray-800">
            Create your account
          </h1>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <TextInput
            label="Full name"
            placeholder="John Doe"
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
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
            placeholder="••••••••"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="••••••••"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <div className="pt-4">
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-medium text-[#1A3A2A] hover:underline"
            >
              Sign in <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}