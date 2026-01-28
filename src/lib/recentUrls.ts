"use client";

export type RecentUrl = {
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  shortKey?: string;
  claimed?: boolean;
};

export const RECENT_STORAGE_KEY = "recentShortUrls";

export const loadRecentUrls = (): RecentUrl[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item?.shortUrl && item?.originalUrl);
  } catch {
    return [];
  }
};

export const saveRecentUrls = (urls: RecentUrl[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(urls));
};

