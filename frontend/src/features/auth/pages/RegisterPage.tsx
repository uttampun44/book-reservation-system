import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { TextInput } from "../components/Input";
import { PasswordInput } from "../components/passwordInput";
import { BookLogo } from "../components/Logo";
import { registerUser } from "../api/auth";
import { toast } from "react-toastify";

interface FormErrors {
  fullname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateField = (name: string, value: string, data = formData): string => {
    switch (name) {
      case "fullname":
        if (!value) return "Full name is required";
        if (value.trim().length < 2) return "Full name must be at least 2 characters";
        return "";

      case "email":
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email address";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Minimum 6 characters required";
        if (!/[A-Z]/.test(value)) return "At least one uppercase letter required";
        if (!/\d/.test(value)) return "At least one number required";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
          return "At least one special character required";
        return "";

      case "confirmPassword":
        if (!value) return "Confirm your password";
        if (value !== data.password) return "Passwords do not match";
        return "";

      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      fullname: validateField("fullname", formData.fullname),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
    };

    setErrors(newErrors);



    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    const error = validateField(name, value, updatedData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await registerUser({
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        toast.success("Account created successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(response.message || "Registration failed.");
      }
    } catch (err: unknown) {
      let msg = "An unexpected error occurred.";

      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
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

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          
          <div>
            <TextInput
              label="Full name"
              placeholder="Enter your full name"
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
            )}
          </div>

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
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

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