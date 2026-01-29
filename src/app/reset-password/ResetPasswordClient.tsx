"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Invalid reset token.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to reset password");
      }
      setSuccess(true);
      setTimeout(() => router.replace("/auth"), 1200);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark dark:text-dark-text flex flex-col">
      <main className="flex-1 max-w-[480px] mx-auto px-4 py-12 w-full">
        <h1 className="text-2xl font-semibold mb-2">Reset password</h1>
        <p className="text-sm text-gray-600 dark:text-primary-color mb-6">
          Choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 border rounded-lg text-base"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full h-12 px-4 border rounded-lg text-base"
              placeholder="Confirm new password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && (
            <p className="text-sm text-green-600">
              Password updated. Redirecting to login...
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-teal-500 text-white rounded-lg"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

