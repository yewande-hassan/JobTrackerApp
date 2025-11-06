# Job Tracker App

React + Vite app backed by Firebase (Auth, Firestore, Storage). This doc covers local setup, Vercel deployment, required environment variables, and common production issues.

## Quick start

Local development:

```bash
npm install
cp .env.example .env # fill in your values
npm run dev
```

## Required environment variables

Create a `.env` for local dev or add these in Vercel (Project Settings → Environment Variables). All keys must be prefixed with `VITE_`:

- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECTID
- VITE_FIREBASE_STORAGEBUCKET
- VITE_FIREBASE_MESSAGINGSENDERID
- VITE_FIREBASE_APPID

Optional function URLs (if you have Cloud Functions):

- VITE_MATCH_FUNCTION_URL
- VITE_JOB_DESC_FUNCTION_URL

See `.env.example` for the expected format.

## Vercel deployment

1. Push this repo to GitHub and import it in Vercel.
2. Add the environment variables above in Vercel → Project Settings → Environment Variables.
3. Ensure your Firebase Auth authorized domains include your Vercel preview domain(s) and production domain.
4. We include a `vercel.json` that rewrites all routes to `/index.html` for SPA routing.
5. Deploy. The root route and deep links like `/dashboard` should render correctly.

## Troubleshooting a blank/white screen in production

If your deployed domain shows a blank screen:

1. Open the browser DevTools console on the production site and look for errors.
	- A common one is `auth/invalid-api-key` or other Firebase config errors when env vars are missing in the build environment.
2. Confirm Vercel environment variables are configured and match `.env.example`.
	- Variable names must start with `VITE_`.
	- Trigger a new deploy after adding/updating env vars.
3. Ensure the SPA rewrite is present (we ship `vercel.json`). Deep links should not 404.
4. Confirm your Firebase Auth → Authorized domains includes your Vercel domain (e.g., `your-app.vercel.app`) and custom domain.
5. Hard refresh and/or clear cache if you recently changed env vars and redeployed.

We also log a clear message at app startup if required Firebase env vars are missing (`src/services/firebase.js`).

## Scripts

- `npm run dev` – start local dev server
- `npm run build` – production build
- `npm run preview` – preview production build locally

## Tech

- React, Vite, React Router
- Firebase Auth, Firestore, Storage
