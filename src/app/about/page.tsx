"use client";

import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark dark:text-dark-text flex flex-col">
      <main className="flex-1 max-w-[900px] mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold mb-4">About BotrixAI URL Shortener</h1>
        <p className="text-sm text-gray-600 dark:text-primary-color mb-4">
          BotrixAI URL Shortener helps you create short, shareable links with
          optional custom codes, expiry dates, and link history for signed-in
          users. It is optimized for fast redirects and easy sharing.
        </p>
        <p className="text-sm text-gray-600 dark:text-primary-color">
          Create a link, share it anywhere, and manage your history in one
          place.
        </p>
      </main>
      <Footer />
    </div>
  );
}

