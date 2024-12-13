// app/signin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
interface SignInFormData {
  email: string;
  password: string;
}

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call your authentication API here
      const signInPromise = signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      toast.promise(signInPromise, {
        loading: "Signing in...",
        success: (result) => {
          if (result?.error) {
            throw new Error(
              result.error === "CredentialsSignin"
                ? "Invalid email or password"
                : result.error
            );
          }
          if (result?.ok) {
            router.push("/");
            router.refresh();
            return "Signed in successfully!";
          }
          return "";
        },
        error: (err: { message: unknown }) =>
          err.message || "An unexpected error occurred",
      });
      try {
        await signInPromise;
      } catch (error) {
        console.error("SignIn Error:", error);
      } finally {
        setLoading(false);
      } // Redirect to dashboard or home page
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      {/* Left Side - Sign In Form */}
      <div className="bg-[#253329] flex items-center justify-center">
        <div className="bg-[#253329] p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Sign in</h2>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#364641] text-white p-3 rounded-md w-full
                          focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="bg-[#364641] text-white p-3 rounded-md w-full
                          focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#243831] text-white py-3 px-6 rounded-md w-full
                        hover:bg-[#2c443c] transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4">
            <Link
              href="/signup"
              className="block bg-[#4CAF50] text-white py-3 px-6 rounded-md w-full
                         text-center hover:bg-[#45a049] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Optional: Add hero image or content */}
      <div className="bg-[#1a251d] hidden md:flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
          <p className="text-lg text-gray-300">
            Sign in to access your account
          </p>
        </div>
      </div>
    </div>
  );
}
