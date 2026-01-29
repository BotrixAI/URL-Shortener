const RESERVED_SHORT_KEYS = new Set([
  "api",
  "auth",
  "history",
  "profile",
  "urls",
  "about",
  "favicon",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

const SHORT_KEY_REGEX = /^[a-z0-9_-]{3,32}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_URL_LENGTH = 2048;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const isValidEmail = (email: string) => EMAIL_REGEX.test(email);

export const normalizeShortKey = (key: string) => key.trim().toLowerCase();

export const isValidShortKey = (key: string) =>
  SHORT_KEY_REGEX.test(key) && !RESERVED_SHORT_KEYS.has(key.toLowerCase());

export const isValidUrl = (input: string) => {
  if (!input || input.length > MAX_URL_LENGTH) return false;
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const parseExpiryDate = (raw: unknown) => {
  if (!raw || typeof raw !== "string") return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  if (parsed.getTime() <= Date.now()) return null;
  return parsed;
};

