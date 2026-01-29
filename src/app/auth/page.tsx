"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Footer from "@/components/Footer";

import BotrixAI_Light from "@/assets/BotrixAI_Light.avif";
import BotrixAI_Dark from "@/assets/BotrixAI_Dark.avif";
import { FaGithub, FaGoogle } from "react-icons/fa";

export default function AuthPage() {
  const router = useRouter();
  const { status } = useSession();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  // If already logged in → redirect
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/urls");
    }
  }, [status, router]);

  const handleToggleMode = () => {
    setIsLogin((prev) => !prev);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleMode();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // SIGNUP (credentials)
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        alert("Signup failed");
        return;
      }
    }

    // LOGIN (credentials)
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      callbackUrl: "/urls",
    });
  };

  return (
    <>
      <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark flex items-center justify-center py-12 px-4">
        <div className="max-w-[500px] w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={BotrixAI_Light.src} className="h-16 w-auto dark:hidden" />
            <img src={BotrixAI_Dark.src} className="h-16 w-auto hidden dark:block" />
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-4 mb-8 bg-bg-primary-light dark:bg-bg-primary-dark p-1 rounded-xl dark:shadow-md dark:shadow-gray-700">
            <button
              type="button"
              onClick={handleToggleMode}
              onKeyDown={handleToggleKeyDown}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 cursor-pointer ${
                isLogin
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-transparent text-black dark:text-dark-text"
              }`}
              aria-label={isLogin ? "Currently on login mode" : "Switch to login mode"}
              tabIndex={0}
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleToggleMode}
              onKeyDown={handleToggleKeyDown}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 cursor-pointer ${
                !isLogin
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-transparent text-black dark:text-dark-text"
              }`}
              aria-label={!isLogin ? "Currently on signup mode" : "Switch to signup mode"}
              tabIndex={0}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 text-gray-900 dark:text-dark-text"
          >
            {!isLogin && (
              <div>
                {/* <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="
                    w-full h-12 px-4 border border-gray-300 rounded-lg text-base outline-none
                    text-gray-900 dark:text-dark-text
                    placeholder:text-gray-400 dark:placeholder:text-gray-300
                    focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all
                  "
                  placeholder="Enter your full name"
                  aria-label="Enter your full name"
                /> */}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="
                  w-full h-12 px-4 border border-gray-300 rounded-lg text-base outline-none
                  text-gray-900 dark:text-dark-text
                  placeholder:text-gray-400 dark:placeholder:text-gray-300
                  focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all
                "
                placeholder="Enter your email"
                aria-label="Enter your email address"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="
                  w-full h-12 px-4 border border-gray-300 rounded-lg text-base outline-none
                  text-gray-900 dark:text-dark-text
                  placeholder:text-gray-400 dark:placeholder:text-gray-300
                  focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all
                "
                placeholder="Enter your password"
                aria-label="Enter your password"
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="
                    w-full h-12 px-4 border border-gray-300 rounded-lg text-base outline-none
                    text-gray-900 dark:text-dark-text
                    placeholder:text-gray-400 dark:placeholder:text-gray-300
                    focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all
                  "
                  placeholder="Confirm your password"
                  aria-label="Confirm your password"
                  minLength={6}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal border-gray-300 rounded focus:ring-teal"
                    aria-label="Remember me"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-dark-text">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-teal hover:text-teal-dark font-medium"
                  onClick={() => router.push("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="
                w-full h-12 bg-teal-500 text-white font-semibold text-lg rounded-lg
                shadow-[0_6px_18px_rgba(14,165,164,0.35)] transition-all
                hover:bg-teal-dark hover:shadow-[0_8px_22px_rgba(14,165,164,0.40)]
                hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2
              "
              aria-label={isLogin ? "Submit login form" : "Submit signup form"}
              tabIndex={0}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => signIn("google")}
              className="w-full h-12 border border-gray-300 rounded-lg font-medium text-gray-700 dark:text-dark-text bg-white dark:bg-bg-primary-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer flex items-center justify-center gap-2"
              aria-label="Continue with Google"
              tabIndex={0}
            >
              <FaGoogle />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => signIn("github")}
              className="w-full h-12 border border-gray-300 rounded-lg font-medium text-gray-700 dark:text-dark-text bg-white dark:bg-bg-primary-dark cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              aria-label="Continue with GitHub"
              tabIndex={0}
            >
              <FaGithub />
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
