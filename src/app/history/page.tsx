"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import BotrixAI_Light from "@/assets/BotrixAI_Light.avif";

export default function HistoryPage() {
  const router = useRouter();

  const [urls, setUrls] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const size = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  const shortUrlBase =
    typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/urls?mine=true&page=${page}&size=${size}`
      );

      if (!res.ok) throw new Error("Failed to load history");

      const data = await res.json();
      setUrls(data.content || data.urls || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (shortKey: string, id: string) => {
    await navigator.clipboard.writeText(`${shortUrlBase}/${shortKey}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDelete = async (shortKey: string) => {
    if (!window.confirm("Delete this short URL?")) return;

    await fetch(`/api/urls/${shortKey}`, { method: "DELETE" });
    setUrls((prev) => prev.filter((u) => u.shortKey !== shortKey));
  };

  const isExpired = (expiresAt?: string) =>
    expiresAt ? new Date(expiresAt) < new Date() : false;

  const openQrModal = (url: any) => {
    const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${shortUrlBase}/${url.shortKey}`;
    setQrUrl(qrApi);
    setShowQrModal(true);
  };

  return (
    <div className="min-h-screen bg-bg-primary-light dark:bg-bg-primary-dark dark:text-dark-text px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-8 mb-6">
        <button
          onClick={() => router.push("/urls")}
          className="px-3 py-1 rounded-md text-xs font-medium border"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold">URL History</h1>
      </div>

      <div className="rounded-xl shadow-sm border overflow-hidden">
        {loading && <p className="p-6 text-gray-500">Loading...</p>}
        {error && <p className="p-6 text-red-500">{error}</p>}
        {!loading && urls.length === 0 && (
          <p className="p-6 text-gray-500">No URLs found</p>
        )}

        {urls.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Short URL</th>
                  <th className="px-4 py-3 text-left">Original URL</th>
                  <th className="px-4 py-3 text-center">Created</th>
                  <th className="px-4 py-3 text-center">Expires</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">QR</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {urls.map((url) => (
                  <tr key={url._id}>
                    <td className="px-4 py-3 text-blue-600">
                      <a
                        href={`${shortUrlBase}/${url.shortKey}`}
                        target="_blank"
                      >
                        {shortUrlBase}/{url.shortKey}
                      </a>
                    </td>

                    <td className="px-4 py-3 max-w-xs truncate">
                      {url.originalUrl}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {url.expiresAt
                        ? new Date(url.expiresAt).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isExpired(url.expiresAt) ? (
                        <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                          Expired
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openQrModal(url)}
                        className="px-3 py-1 text-xs rounded-md border"
                      >
                        View
                      </button>
                    </td>

                    <td className="px-4 py-3 flex gap-2 justify-center">
                      <button
                        onClick={() =>
                          copyToClipboard(url.shortKey, url._id)
                        }
                        className={`px-3 py-1 rounded-md text-xs ${
                          copiedId === url._id
                            ? "bg-green-100 text-green-700"
                            : "bg-teal-500 text-white"
                        }`}
                      >
                        {copiedId === url._id ? "Copied" : "Copy"}
                      </button>

                      <button
                        onClick={() => handleDelete(url.shortKey)}
                        className="px-3 py-1 rounded-md text-xs border border-red-300 text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQrModal && qrUrl && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 relative">
            <button
              onClick={() => setShowQrModal(false)}
              aria-label="Close QR code popup"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              <IoClose className="text-2xl cursor-pointer" />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">QR Code</h2>
            <div className="relative mx-auto mb-4 h-[250px] w-[250px]">
              <img src={qrUrl} alt="QR" className="h-full w-full" />
              <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
                <img
                  src={BotrixAI_Light.src}
                  alt="BotrixAI logo"
                  className="h-4  rounded-full "
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
                className="px-4 py-2 text-sm border rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 rounded-md border text-sm disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() =>
              setPage((p) => Math.min(p + 1, totalPages - 1))
            }
            disabled={page === totalPages - 1}
            className="px-4 py-2 rounded-md border text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
