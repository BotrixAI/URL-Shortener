"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FaHistory, FaSignOutAlt, FaUser } from "react-icons/fa";

import BotrixAI_Light from "@/assets/BotrixAI_Light.avif";
import BotrixAI_Dark from "@/assets/BotrixAI_Dark.avif";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import RecentUrlsSection from "@/components/RecentUrlsSection";

export default function UrlGeneratorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark dark:text-dark-text">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex justify-between">
        <div>
          <img src={BotrixAI_Light.src} className="h-14 dark:hidden" />
          <img src={BotrixAI_Dark.src} className="h-14 hidden dark:block" />
        </div>
        <div className="flex gap-4">
          <button onClick={() => router.push("/history")}>
            <FaHistory />
          </button>
          <button onClick={() => router.push("/profile")}>
            <FaUser />
          </button>
          <button onClick={() => signOut({ callbackUrl: "/" })}>
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-[800px] mx-auto px-4 py-12">
        <UrlShortenerForm />
        <RecentUrlsSection className="mt-10 w-full" />
      </div>
    </div>
  );
}
