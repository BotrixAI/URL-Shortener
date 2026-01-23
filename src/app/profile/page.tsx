"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FaHistory, FaSignOutAlt, FaUser } from "react-icons/fa";

import BotrixAI_Light from "@/assets/BotrixAI_Light.avif";
import BotrixAI_Dark from "@/assets/BotrixAI_Dark.avif";
import Footer from "@/components/Footer";

type UserUrl = {
  _id: string;
  originalUrl: string;
  shortKey: string;
  createdAt: string;
  expiresAt?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [urls, setUrls] = useState<UserUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect unauthenticated users to auth page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchMyUrls = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/urls?mine=true&page=0&size=5");
        if (!res.ok) throw new Error("Failed to load URLs");
        const data = await res.json();
        setUrls(data.content || data.urls || []);
      } catch {
        setError("Failed to load your URLs");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchMyUrls();
    }
  }, [status]);

  const shortUrlBase =
    typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark dark:text-dark-text flex flex-col">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div>
            <img src={BotrixAI_Light.src} className="h-14 dark:hidden" />
            <img src={BotrixAI_Dark.src} className="h-14 hidden dark:block" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-primary-color">
              Logged in as
            </p>
            <p className="font-semibold">
              {session?.user?.email || "Loading..."}
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => router.push("/urls")}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm"
          >
            <FaUser />
            <span>Generator</span>
          </button>
          <button
            onClick={() => router.push("/history")}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm"
          >
            <FaHistory />
            <span>History</span>
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-500 text-white text-sm"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-[900px] mx-auto px-4 pb-12 w-full">
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-sm text-gray-600 dark:text-primary-color">
            View your account details and your recent shortened URLs.
          </p>
        </section>

        {/* Basic user info */}
        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-gray-300 p-4 bg-bg-primary-light dark:bg-bg-primary-dark">
            <h2 className="text-lg font-semibold mb-2">Account</h2>
            <p className="text-sm text-gray-600 dark:text-primary-color">
              Email
            </p>
            <p className="font-medium break-all">
              {session?.user?.email || "—"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-300 p-4 bg-bg-primary-light dark:bg-bg-primary-dark">
            <h2 className="text-lg font-semibold mb-2">Stats</h2>
            <p className="text-sm text-gray-600 dark:text-primary-color">
              Recent URLs loaded
            </p>
            <p className="font-medium">{urls.length}</p>
          </div>
        </section>

        {/* Recent URLs */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Recent Short URLs</h2>
            <button
              onClick={() => router.push("/history")}
              className="text-sm text-teal-600 hover:text-teal-700"
            >
              View full history →
            </button>
          </div>

          <div className="rounded-xl border border-gray-300 bg-bg-primary-light dark:bg-bg-primary-dark">
            {loading && (
              <p className="p-4 text-sm text-gray-500">Loading your URLs...</p>
            )}
            {error && (
              <p className="p-4 text-sm text-red-500">{error}</p>
            )}
            {!loading && !error && urls.length === 0 && (
              <p className="p-4 text-sm text-gray-500">
                You haven&apos;t created any short URLs yet.
              </p>
            )}
            {!loading && urls.length > 0 && (
              <ul className="divide-y">
                {urls.map((u) => (
                  <li key={u._id} className="px-4 py-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-teal-600 truncate">
                        <a
                          href={`${shortUrlBase}/${u.shortKey}`}
                          target="_blank"
                        >
                          {shortUrlBase}/{u.shortKey}
                        </a>
                      </p>
                      <p className="text-xs text-gray-600 dark:text-primary-color truncate">
                        {u.originalUrl}
                      </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end text-xs text-gray-500 dark:text-primary-color mt-2 md:mt-0">
                      <span>
                        Created:{" "}
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                      <span>
                        Expires:{" "}
                        {u.expiresAt
                          ? new Date(u.expiresAt).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


