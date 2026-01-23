"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { FaCopy, FaHistory, FaSignOutAlt, FaUser } from "react-icons/fa";

import BotrixAI_Light from "@/assets/BotrixAI_Light.avif";
import BotrixAI_Dark from "@/assets/BotrixAI_Dark.avif";

export default function UrlGeneratorPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    longLink: "",
    customCode: "",
    expiryDate: "",
  });

  const [generatedUrl, setGeneratedUrl] = useState("");
  const [expiryInfo, setExpiryInfo] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("lastGeneratedUrl");
    if (saved) {
      const parsed = JSON.parse(saved);
      setGeneratedUrl(parsed.shortUrl);
      setQrCodeUrl(parsed.qrCodeUrl || "");
      if (parsed.expiryInfo) {
        const expiry = new Date(parsed.expiryInfo);
        setExpiryInfo({
          date: expiry.toLocaleDateString(),
          time: expiry.toLocaleTimeString(),
        });
      }
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!formData.longLink) {
      setError("Please enter a long link");
      setIsLoading(false);
      return;
    }

    try {
      const body: any = {
        originalUrl: formData.longLink,
      };

      if (formData.customCode.trim()) {
        body.customKey = formData.customCode.trim();
      }

      if (formData.expiryDate) {
        body.expiresAt = new Date(formData.expiryDate).toISOString();
      }

      const res = await fetch("/api/urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate URL");
      }

      const data = await res.json();

      const shortUrl = `${window.location.origin}/${data.shortKey}`;
      setGeneratedUrl(shortUrl);

      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        shortUrl
      )}&size=200x200`;
      setQrCodeUrl(qrUrl);

      if (data.expiresAt) {
        const expiry = new Date(data.expiresAt);
        setExpiryInfo({
          date: expiry.toLocaleDateString(),
          time: expiry.toLocaleTimeString(),
        });
      } else {
        setExpiryInfo(null);
      }

      sessionStorage.setItem(
        "lastGeneratedUrl",
        JSON.stringify({
          shortUrl,
          expiryInfo: data.expiresAt,
          qrCodeUrl: qrUrl,
        })
      );
    } catch (err: any) {
      setError(err.message);
      setGeneratedUrl("");
      setExpiryInfo(null);
      setQrCodeUrl("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <h1 className="text-3xl font-bold mb-8 text-teal">
          Short URL Generator
        </h1>

        <form onSubmit={handleGenerate} className="space-y-6">
          <input
            name="longLink"
            type="url"
            value={formData.longLink}
            onChange={handleInputChange}
            placeholder="Enter the link"
            required
            className="w-full h-14 px-4 border rounded-lg"
          />

          <input
            name="customCode"
            value={formData.customCode}
            onChange={handleInputChange}
            placeholder="Custom Code (Optional)"
            className="w-full h-14 px-4 border rounded-lg"
          />

          <input
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className="w-full h-14 px-4 border rounded-lg"
          />

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-teal-500 text-white rounded-lg"
          >
            {isLoading ? "Generating..." : "Generate URL"}
          </button>
        </form>

        {generatedUrl && (
          <div className="mt-8">
            <div className="border border-gray-300 rounded-lg p-4 space-y-6">
              {/* Short URL + copy button */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  value={generatedUrl}
                  readOnly
                  className="flex-1 px-3 h-12 rounded-lg bg-transparent border border-gray-300"
                />
                <button
                  onClick={handleCopy}
                  className="mt-2 sm:mt-0 bg-teal-500 text-white px-4 h-12 rounded-lg"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* QR code */}
              {qrCodeUrl && (
                <div className="flex justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="QR code for shortened URL"
                    className="bg-white p-2 rounded-lg border shadow-sm"
                  />
                </div>
              )}

              {/* Expiration info */}
              {expiryInfo && (
                <p className="text-blue-600 text-center">
                  Expires on {expiryInfo.date} at {expiryInfo.time}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
