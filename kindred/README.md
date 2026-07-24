# Kindred

Kindred is a demand-first donation platform that connects donors with organizations
whose declared needs match available donations. This repository contains the
React MVP through Module 7: account roles, profiles, donation management,
rule-based organization recommendations, lifecycle tracking, and impact views.

Completed modules cover the project foundation; authentication and role access;
shared dashboard UI; organization profiles, inventory, and needs; donor profiles
and donations; recommendations; donation tracking; and impact/deployment
readiness.

## Technology

- React 18 and Vite
- Tailwind CSS
- React Router
- Firebase Authentication, Cloud Firestore, and Firebase Storage
- Recharts and Lucide React

The recommendation engine is deterministic and rule-based. It does not use AI.

## Local setup

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Create a Firebase web application and fill in the six `VITE_FIREBASE_*`
   variables in `.env`.
5. In Firebase Authentication, enable the Email/Password sign-in provider.
6. Create a Cloud Firestore database and a Firebase Storage bucket.
7. Run `npm run dev`, then open the URL printed by Vite.

Never commit `.env`; Vite embeds `VITE_*` values into the browser bundle, so
Firebase Security Rules remain the authorization boundary.

## Firebase data model

- `users/{uid}`: account identity, role, and donor profile fields.
- `organizations/{uid}`: organization profile, accepted categories, needs,
  inventory, and server-protected trust score.
- `donations/{donationId}`: donation details, owner, assignment, image
  references, and current lifecycle status.
- `tracking/{donationId}`: status history for an assigned donation.
- Storage path `donation-images/{donorId}/{donationId}/{fileName}`: donation
  images owned for writes by the donor.

Deploy the included rules after selecting or aliasing a Firebase project:

```sh
firebase deploy --only firestore:rules,storage
```

Deploying the frontend does not deploy these rules. They must be deployed to the
Firebase project before the application is exposed to users.

The Firestore rules enforce role ownership, immutable protected fields,
forward-only lifecycle transitions, and no broad fallback access. Organization
profiles are readable by any authenticated account because donor
recommendations query them. Donation images are likewise readable by
authenticated accounts; Storage Rules cannot inspect Firestore assignment data
without a separate access-token or backend design.

## Demo flow

1. Register an organization account.
2. Complete its profile and select accepted donation categories.
3. Add an active need and inventory values.
4. Sign out and register a donor account.
5. Complete the donor profile.
6. Create a donation and optionally upload an image.
7. Open the donation, review the scored recommendations, and select the
   organization.
8. Sign in as that organization and open Incoming Donations.
9. Accept the donation, then advance it through Ready for Pickup, Received, and
   Completed.
10. Progress the donation through each remaining status.
11. Sign back in as the donor and view the tracking timeline.
12. Open the Impact dashboard as both roles to view metrics, distributions, and
    recent history.

Impact quantities count only completed donations. Organization and donor counts
are de-duplicated by their IDs.

## Routes

Public routes are `/`, `/login`, and `/register`. Donor pages live under
`/donor`; organization pages live under `/organization`. Protected routes
validate both authentication and the Firestore role before rendering. Major
pages are lazy-loaded and share one Suspense loading state.

## Production deployment

Import the repository into Vercel, add the same Firebase environment variables
to the project settings, and deploy. `vercel.json` rewrites unknown paths to
`index.html`, allowing React Router URLs to load directly.

For Firebase Hosting or another provider, configure the equivalent SPA fallback
and deploy the Firebase rules separately with the Firebase CLI.

## MVP limitations

- No administration, moderation, notifications, maps, payments, or backend
  automation.
- Recommendation distance is based on the location data available in the MVP,
  not a live geocoding service.
- Impact metrics are computed client-side from documents the signed-in role may
  read; large deployments should move aggregation to trusted backend jobs.
- Firebase emulator tests and production deployment require a configured
  Firebase project and are not performed automatically by the application.
