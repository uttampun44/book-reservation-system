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

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "email") {
      if (!value) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Enter a valid email address";
      }
    }

    if (name === "password") {
      if (!value) {
        error = "Password is required";
      }
    }

    return error;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err);

    return !hasError;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    const error = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
      ...(name === "password" && { password: error }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

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
        login(formData.email);
        toast.success("Login successful.");
        navigate("/");
      } else {
        setErrors((prev) => ({
          ...prev,
          password: "Invalid email or password",
        }));
      }
    } catch (err: unknown) {
      console.log(err);
      setErrors((prev) => ({
        ...prev,
        password: "Invalid email or password",
      }));
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>

          <div>
            <TextInput
              label="Email address"
              placeholder="Enter your email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <PasswordInput
              label="Password"
              placeholder="••••••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

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