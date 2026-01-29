# BotrixAI URL Shortener

## Overview
BotrixAI URL Shortener is a production‑ready link shortener built with Next.js App Router. It supports public and authenticated shortening, custom short codes, expiry rules, and a clean sharing experience with QR codes. Authenticated users get URL history, profile, and deletion controls while public users can still create time‑boxed links.

## Highlights
- Public links expire after 30 days; signed‑in users can set custom expiries.
- Custom short codes with validation and reserved route protection.
- OAuth + credentials auth with JWT sessions.
- Link history, profile, and management views.
- QR code generation and social sharing shortcuts.

## Tech Stack
- Next.js (App Router) + React 19
- NextAuth.js (JWT sessions)
- MongoDB + Mongoose
- Tailwind CSS
- Resend (email delivery)

## Folder Structure
```
src/
  app/
    [key]/            # Redirect handler
    about/            # About page
    api/              # API routes (auth, URLs)
    auth/             # Login/signup
    forgot-password/  # Password reset request
    reset-password/   # Password reset
    history/          # URL history
    profile/          # Profile and stats
    urls/             # URL generator
  components/         # UI components
  lib/                # Auth, DB, email, validators, storage helpers
  models/             # Mongoose schemas
  assets/             # Images and icons
```

## Environment
This project relies on the following environment variables:
- `MONGODB_URI`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`

Set them in `.env.local` for local development and in your Vercel project settings for production.

## Local Development
```
npm install
npm run dev
```

## Build & Run
```
npm run build
npm run start
```

## Deployment (Vercel)
1. Import the repo into Vercel.
2. Configure the environment variables listed above.
3. Deploy.

## Operational Notes
- Unauthenticated links default to a 30‑day TTL.
- Custom short keys are validated and reserved paths are blocked.
- Password resets use signed email links and expire in 15 minutes.
