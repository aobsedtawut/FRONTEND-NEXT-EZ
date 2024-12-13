// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
interface SignUpFormData {
  email: string;
  password: string;
  name: string;
  username: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
    name: "",
    username: "",
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
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up
      await api.post("/auth/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });

      // If successful, show success message and redirect
      toast.success("Account created successfully!");
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle axios error responses
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data.message || "Signup failed";
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (error.request) {
        // Request made but no response received
        setError("Network error. Please try again.");
        toast.error("Network error. Please try again.");
      } else {
        // Something else went wrong
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
      console.error("SignUp Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="grid grid-cols-1
     h-screen"
    >
      <div className="bg-[#253329] flex items-center justify-center">
        <div className="bg-[#253329] p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Create Account</h2>

          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="bg-[#364641] text-white p-3 rounded-md w-full
                          focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="bg-[#364641] text-white p-3 rounded-md w-full
                          focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#364641] text-white p-3 rounded-md w-full
                          focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className="bg-[#364641] text-white p-3 rounded-md w-full
                          focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 text-white py-3 px-6 rounded-md w-full
                        hover:bg-green-600 transition-colors
                        disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-4 text-center text-white">
            Already have an account?{" "}
            <Link href="/signin" className="text-green-500 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
