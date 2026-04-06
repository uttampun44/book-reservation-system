import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { TextInput } from "../components/Input";
import { PasswordInput } from "../components/passwordInput";
import { BookLogo } from "../components/Logo";



export function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-md">
        <div className="flex flex-col items-center gap-2">
          <BookLogo />
          <h1 className="text-2xl font-semibold text-gray-800">Create your account</h1>
        </div>

        <form className="mt-8 space-y-5">
          <TextInput label="Full name" placeholder="name" type="text" />
          <TextInput label="Email address" placeholder="you@gmail.com" type="email" />
          <PasswordInput label="Password" placeholder="••••••••" />
          <PasswordInput label="Confirm Password" placeholder="••••••••" />
          <div className="pt-4">
            <Button type="submit" fullWidth>
              Create account
            </Button>
          </div>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="inline-flex items-center gap-1 font-medium text-[#1A3A2A] hover:underline">
              Sign in <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}