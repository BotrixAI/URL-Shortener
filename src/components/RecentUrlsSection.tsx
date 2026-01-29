"use client";

import { useEffect, useMemo, useState } from "react";

import { loadRecentUrls, RecentUrl } from "@/lib/recentUrls";
import BotrixAI_Light from "@/assets/BotrixAI_Light.avif";
import { FiMoreVertical } from "react-icons/fi";
import {
  FaFacebook,
  FaLinkedin,
  FaTelegramPlane,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

type RecentUrlsSectionProps = {
  title?: string;
  className?: string;
};

export default function RecentUrlsSection({
  title = "Recent short URLs",
  className = "",
}: RecentUrlsSectionProps) {
  const [recentUrls, setRecentUrls] = useState<RecentUrl[]>([]);
  const [copiedRecent, setCopiedRecent] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [actionUrl, setActionUrl] = useState<RecentUrl | null>(null);

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
        label: "Telegram",
        href: `https://t.me/share/url?url=${encoded}`,
        icon: <FaTelegramPlane className="text-sky-600" />,
      },
      {
        label: "Email",
        href: `mailto:?subject=Check%20this%20link&body=${encoded}`,
        icon: <MdEmail className="text-red-500" />,
      },
    ];
  }, [shareUrl]);

  const getFaviconUrl = (originalUrl: string) => {
    try {
      const url = new URL(originalUrl);
      return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
    } catch {
      return "";
    }
  };

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

  const handleCopyRecent = (url: RecentUrl) => {
    navigator.clipboard.writeText(url.shortUrl);
    setCopiedRecent(url.shortUrl);
    setTimeout(() => setCopiedRecent(null), 1500);
  };

  const handleShowQr = (url: RecentUrl) => {
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      url.shortUrl
    )}`;
    setQrUrl(qrApi);
    setShowQrModal(true);
  };

  return (
    <section className={className}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {recentUrls.length === 0 ? (
        <p className="text-sm text-gray-500">No recent URLs yet.</p>
      ) : (
        <div className="space-y-3">
          {recentUrls.map((url) => (
            <div
              key={url.shortUrl}
              className="flex justify-between gap-3 rounded-lg border p-3"
            >
              <div className="hidden sm:flex min-w-0 items-center justify-between gap-3 w-full">
                <div className="min-w-0 flex items-center gap-2">
                  {getFaviconUrl(url.originalUrl) && (
                    <img
                      src={getFaviconUrl(url.originalUrl)}
                      alt=""
                      className="h-5 w-5 rounded"
                    />
                  )}
                  <div className="min-w-0">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm text-blue-600"
                    >
                      {url.shortUrl}
                    </a>
                    <p className="truncate text-xs text-gray-500">
                      {url.originalUrl}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 rounded-md border px-3 text-xs flex items-center whitespace-nowrap cursor-pointer dark:border-gray-700 dark:text-dark-text"
                  >
                    Visit
                  </a>
                  <button
                    onClick={() => handleShowQr(url)}
                    className="h-9 rounded-md border px-3 text-xs whitespace-nowrap cursor-pointer dark:border-gray-700 dark:text-dark-text"
                  >
                    Show QR
                  </button>
                  <button
                    onClick={() => setShareUrl(url.shortUrl)}
                    className="h-9 rounded-md border px-3 text-xs whitespace-nowrap cursor-pointer dark:border-gray-700 dark:text-dark-text"
                  >
                    Share
                  </button>
                  <button
                    onClick={() => handleCopyRecent(url)}
                    className={`h-9 rounded-md px-3 text-xs whitespace-nowrap cursor-pointer ${
                      copiedRecent === url.shortUrl
                        ? "bg-green-100 text-green-700"
                        : "bg-teal-500 text-white"
                    }`}
                  >
                    {copiedRecent === url.shortUrl ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="flex w-full items-start justify-between gap-3 sm:hidden">
                <div className="min-w-0 flex items-start gap-2">
                  {getFaviconUrl(url.originalUrl) && (
                    <img
                      src={getFaviconUrl(url.originalUrl)}
                      alt=""
                      className="h-5 w-5 rounded"
                    />
                  )}
                  <div className="min-w-0">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm text-blue-600"
                    >
                      {url.shortUrl}
                    </a>
                    <p className="truncate text-xs text-gray-500">
                      {url.originalUrl}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyRecent(url)}
                    className={`h-8 rounded-md px-2 text-xs cursor-pointer ${
                      copiedRecent === url.shortUrl
                        ? "bg-green-100 text-green-700"
                        : "bg-teal-500 text-white"
                    }`}
                  >
                    {copiedRecent === url.shortUrl ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={() => setActionUrl(url)}
                    className="h-8 w-8 rounded-md border flex items-center justify-center cursor-pointer dark:border-gray-700 dark:text-dark-text"
                    aria-label="More actions"
                  >
                    <FiMoreVertical />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showQrModal && qrUrl && (
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
              <img src={qrUrl} alt="QR" className="h-full w-full" />
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
                href={qrUrl}
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

      {actionUrl && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 sm:hidden">
          <div className="w-full rounded-t-2xl bg-white p-4 dark:bg-bg-primary-dark dark:text-dark-text">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">More actions</p>
              <button
                onClick={() => setActionUrl(null)}
                className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="grid gap-2">
              <a
                href={actionUrl.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border px-3 py-2 text-sm text-center cursor-pointer dark:border-gray-700 dark:text-dark-text"
              >
                Visit URL
              </a>
              <button
                onClick={() => {
                  handleShowQr(actionUrl);
                  setActionUrl(null);
                }}
                className="rounded-md border px-3 py-2 text-sm cursor-pointer dark:border-gray-700 dark:text-dark-text"
              >
                Show QR
              </button>
              <button
                onClick={() => {
                  setShareUrl(actionUrl.shortUrl);
                  setActionUrl(null);
                }}
                className="rounded-md border px-3 py-2 text-sm cursor-pointer dark:border-gray-700 dark:text-dark-text"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

