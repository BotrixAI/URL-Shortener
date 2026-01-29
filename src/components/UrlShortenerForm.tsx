"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { FiCalendar, FiHash, FiLink } from "react-icons/fi";
import {
  FaCopy,
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import BotrixAI_Light from "@/assets/BotrixAI_Light.avif";
import {
  loadRecentUrls,
  RecentUrl,
  saveRecentUrls,
} from "@/lib/recentUrls";

type UrlShortenerFormProps = {
  title?: string;
  className?: string;
};

export default function UrlShortenerForm({
  title = "Short URL Generator",
  className = "",
}: UrlShortenerFormProps) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

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
  const [recentUrls, setRecentUrls] = useState<RecentUrl[]>([]);
  const [neverExpires, setNeverExpires] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  const expiryDisabled = !isAuthenticated || neverExpires;

  const recentShortKeys = useMemo(
    () => recentUrls.map((url) => url.shortKey).filter(Boolean) as string[],
    [recentUrls]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "longLink" && generatedUrl) {
      setGeneratedUrl("");
      setQrCodeUrl("");
      setExpiryInfo(null);
      sessionStorage.removeItem("lastGeneratedUrl");
    }
  };

  useEffect(() => {
    sessionStorage.removeItem("lastGeneratedUrl");
  }, []);

  useEffect(() => {
    setRecentUrls(loadRecentUrls());
  }, []);

  useEffect(() => {
    const handleUpdate = () => setRecentUrls(loadRecentUrls());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "recentShortUrls") {
        setRecentUrls(loadRecentUrls());
      }
    };

    window.addEventListener("recent-urls-updated", handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("recent-urls-updated", handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || recentShortKeys.length === 0) return;

    const pending = recentUrls
      .filter((url) => !url.claimed && url.shortKey)
      .map((url) => url.shortKey as string);

    if (pending.length === 0) return;

    const claim = async () => {
      const res = await fetch("/api/urls/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortKeys: pending }),
      });

      if (!res.ok) return;

      setRecentUrls((prev) => {
        const updated = prev.map((url) =>
          url.shortKey && pending.includes(url.shortKey)
            ? { ...url, claimed: true }
            : url
        );
        saveRecentUrls(updated);
        return updated;
      });
    };

    claim();
  }, [isAuthenticated, recentShortKeys, recentUrls]);

  const shareLinks = useMemo(() => {
    if (!shareUrl) return [];
    const encoded = encodeURIComponent(shareUrl);
    return [
      {
        label: "WhatsApp",
        href: `https://wa.me/?text=${encoded}`,
        icon: <FaWhatsapp className="text-green-500" />,
      },
      {
        label: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
        icon: <FaFacebook className="text-blue-600" />,
      },
      {
        label: "Twitter",
        href: `https://twitter.com/intent/tweet?url=${encoded}`,
        icon: <FaTwitter className="text-sky-500" />,
      },
      {
        label: "LinkedIn",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
        icon: <FaLinkedin className="text-blue-700" />,
      },
      {
        label: "Email",
        href: `mailto:?subject=Check%20this%20link&body=${encoded}`,
        icon: <MdEmail className="text-red-500" />,
      },
    ];
  }, [shareUrl]);

  const updateRecentUrls = (entry: RecentUrl) => {
    setRecentUrls((prev) => {
      const next = [
        entry,
        ...prev.filter((item) => item.shortUrl !== entry.shortUrl),
      ].slice(0, 5);
      saveRecentUrls(next);
      window.dispatchEvent(new Event("recent-urls-updated"));
      return next;
    });
  };

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

      if (formData.expiryDate && isAuthenticated) {
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

      updateRecentUrls({
        shortUrl,
        originalUrl: formData.longLink,
        createdAt: new Date().toISOString(),
        shortKey: data.shortKey,
        claimed: isAuthenticated,
      });
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

  const handleReset = () => {
    setFormData({ longLink: "", customCode: "", expiryDate: "" });
    setGeneratedUrl("");
    setExpiryInfo(null);
    setQrCodeUrl("");
    setError("");
    setNeverExpires(false);
    sessionStorage.removeItem("lastGeneratedUrl");
  };

  return (
    <div className={className}>
      {title && (
        <h1 className="text-3xl font-bold mb-8 text-teal">{title}</h1>
      )}

      <form onSubmit={handleGenerate} className="space-y-3">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-text">
            <FiLink />
            Long URL
          </label>
          <input
            name="longLink"
            type="url"
            value={formData.longLink}
            onChange={handleInputChange}
            placeholder="Enter the link"
            required
            className="w-full h-10 px-3 border rounded-lg placeholder:text-sm"
          />
        </div>

        {!generatedUrl && (
          <>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-text">
                <FiHash />
                Custom Code
              </label>
              <input
                name="customCode"
                value={formData.customCode}
                onChange={handleInputChange}
                placeholder="Custom Code (Optional)"
                className="w-full h-10 px-3 border rounded-lg placeholder:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-dark-text">
                <FiCalendar />
                Expiry Date
              </label>
              <input
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
                disabled={expiryDisabled}
                className={`w-full h-10 px-3 border rounded-lg ${
                  expiryDisabled ? "cursor-not-allowed opacity-60" : ""
                }`}
              />
              <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={neverExpires}
                  onChange={(e) => {
                    setNeverExpires(e.target.checked);
                    if (e.target.checked) {
                      setFormData((prev) => ({ ...prev, expiryDate: "" }));
                    }
                  }}
                  className="h-4 w-4"
                />
                Never expire
              </label>
            </div>
          </>
        )}

        {!isAuthenticated && !generatedUrl && (
          <p className="text-xs text-gray-500">
            Public links expire after 30 days. Sign in to keep them in history.
          </p>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!generatedUrl && (
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-teal-500 text-white rounded-lg"
          >
            {isLoading ? "Generating..." : "Generate URL"}
          </button>
        )}
      </form>

      {generatedUrl && (
        <div className="mt-4 space-y-3">
          <div className="relative">
            <input
              value={generatedUrl}
              readOnly
              className="w-full px-3 pr-12 h-10 rounded-lg bg-transparent border border-gray-300"
            />
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md bg-teal-500 text-white flex items-center justify-center"
              aria-label={copied ? "Copied" : "Copy short URL"}
              title={copied ? "Copied" : "Copy"}
            >
              <FaCopy className="text-sm" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <a
              href={generatedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 rounded-md border px-3 text-xs flex items-center justify-center whitespace-nowrap cursor-pointer dark:border-gray-700 dark:text-dark-text"
            >
              Visit
            </a>
            <button
              onClick={() => setShowQrModal(true)}
              className="h-9 rounded-md border px-3 text-xs whitespace-nowrap cursor-pointer dark:border-gray-700 dark:text-dark-text"
            >
              Show QR
            </button>
            <button
              onClick={() => setShareUrl(generatedUrl)}
              className="h-9 rounded-md border px-3 text-xs whitespace-nowrap cursor-pointer dark:border-gray-700 dark:text-dark-text"
            >
              Share
            </button>
            <button
              onClick={handleCopy}
              className="h-9 rounded-md px-3 text-xs whitespace-nowrap cursor-pointer bg-teal-500 text-white"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {expiryInfo && (
            <p className="text-blue-600 text-center text-sm">
              Expires on {expiryInfo.date} at {expiryInfo.time}
            </p>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="w-full h-10 rounded-lg border border-teal-500 text-teal-600 text-sm hover:bg-teal-50 cursor-pointer"
          >
            Short another url
          </button>
        </div>
      )}

      {showQrModal && qrCodeUrl && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 relative dark:bg-bg-primary-dark dark:text-dark-text">
            <button
              onClick={() => setShowQrModal(false)}
              aria-label="Close QR code popup"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">QR Code</h2>
            <div className="relative mx-auto mb-4 h-[250px] w-[250px]">
              <img src={qrCodeUrl} alt="QR" className="h-full w-full" />
              <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                <img
                  src={BotrixAI_Light.src}
                  alt="BotrixAI logo"
                  className="h-4 rounded-full"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <a
                href={qrCodeUrl}
                download="qr-code.png"
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md"
              >
                Download
              </a>
              <button
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2 text-sm border rounded-md cursor-pointer dark:border-gray-700 dark:text-dark-text"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {shareUrl && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 relative dark:bg-bg-primary-dark dark:text-dark-text">
            <button
              onClick={() => setShareUrl(null)}
              aria-label="Close share popup"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Share link
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {shareLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border px-3 py-2 text-sm text-center flex items-center justify-center gap-2 cursor-pointer dark:border-gray-700 dark:text-dark-text"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
            <button
              onClick={() => setShareUrl(null)}
              className="mt-4 w-full rounded-md border px-3 py-2 text-sm cursor-pointer dark:border-gray-700 dark:text-dark-text"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

