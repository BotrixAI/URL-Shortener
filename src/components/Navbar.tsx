"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

import { ImScissors } from "react-icons/im";
import { IoHome } from "react-icons/io5";
import { MdChecklist, MdInfoOutline } from "react-icons/md";
import { GiWrench } from "react-icons/gi";
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

import BotrixLight from "@/assets/BotrixAI_Light.avif";
import BotrixDark from "@/assets/BotrixAI_Dark.avif";

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const navItems = [
    { name: "Home", href: "/", logo: <IoHome /> },
    { name: "Features", href: "/#features", logo: <MdChecklist /> },
    { name: "Integration", href: "/#integration", logo: <GiWrench /> },
    { name: "About us", href: "/about", logo: <MdInfoOutline /> },
  ];

  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme handling (unchanged logic)
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : true;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const handleAuthClick = () => {
    router.push("/auth");
  };

  return (
    <>
      <div className="w-full sticky top-0 z-50 flex justify-between lg:px-10 px-2 py-2 dark:text-dark-text dark:bg-bg-primary-dark bg-bg-primary-light shadow-md">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-1">
            <ImScissors className="h-6 lg:w-10 lg:h-10" />
            <h1 className="text-normal lg:text-secondary font-bold">
              URL Shortener
            </h1>
          </div>
          <div className="flex items-center text-[10px] font-semibold">
            powered by
            <img
              src={(dark ? BotrixDark : BotrixLight).src}
              alt="BotrixAI"
              className="w-8 lg:w-16 ml-1"
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center">
          <ul className="flex gap-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-1 hover:text-red-500"
                >
                  {item.logo}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-6">
          <button onClick={toggleTheme}>
            {dark ? <FaSun /> : <FaMoon />}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden"
          >
            {menuOpen ? <FaX /> : <FaBars />}
          </button>

          {/* Auth buttons (desktop) */}
          <div className="hidden lg:flex gap-4">
                <button
                  className="rounded-xl h-10 px-4 bg-teal-500 hover:bg-btn-hover cursor-pointer"
                  onClick={handleAuthClick}
                >
                  Sign In
                </button>
                <button
                  className="rounded-xl h-10 px-4 bg-teal-500 hover:bg-btn-hover cursor-pointer"
                  onClick={handleAuthClick}
                >
                  Sign Up
                </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed w-full top-12 z-40 bg-bg-primary-light dark:bg-bg-primary-dark">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li
                key={item.name}
                className="h-16 flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-dark-text"
                onClick={() => setMenuOpen(false)}
              >
                <Link href={item.href} className="flex gap-1">
                  {item.logo}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex justify-center gap-2 py-4">
            {status === "authenticated" ? (
              <button
                className="w-1/2 bg-red-500 text-white h-8 rounded-lg"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            ) : (
              <button
                className="w-1/2 bg-btn-primary h-8 rounded-lg"
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/auth");
                }}
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
