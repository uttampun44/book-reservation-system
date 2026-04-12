import React from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { TextInput } from "../components/Input";
import { PasswordInput } from "../components/passwordInput";
import { BookLogo } from "../components/Logo";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate("/");
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
            required
          />
          <PasswordInput
            label="Password"
            placeholder="••••••••••••"
            required
          />

          <div className="pt-2">
            <Button type="submit" fullWidth>
              Sign in
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