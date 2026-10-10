# CleanGo

**CleanGo** is a responsive cleaning-service marketplace starter built with Next.js, TypeScript, Tailwind CSS, and optional Supabase integration.

## Current MVP

- Responsive Indonesian landing page
- Six service categories with starting-price estimates
- Booking modal with customer contact, address, schedule, property type, and notes
- Local browser demo storage when Supabase is not configured
- Optional Supabase booking insert when environment variables are present
- Designed for future customer, provider, and admin workflows

> The service prices are sample starting prices for the prototype, not binding quotes. The “verified partner” concept is a product goal and must not be interpreted as proof that real partners have already been verified.

## Run locally

Requirements: Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Open https://vercel.com/new and import `rouffadilah/clean-go`.
2. Keep the framework preset as **Next.js**.
3. If you have not configured Supabase yet, deploy without environment variables to preview the landing page and demo booking.
4. Click **Deploy**.

## Optional Supabase setup

Create a Supabase project at https://supabase.com/dashboard and add these Vercel environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then run the SQL migration in `supabase/migrations/0001_initial.sql` in the Supabase SQL Editor. Redeploy the Vercel project after adding environment variables.

### Booking storage safety

The migration creates Row Level Security policies. This starter intentionally allows anonymous visitors to submit bookings only. It does not yet include authenticated customer/provider/admin dashboards, payments, provider matching, or production-grade role-specific permissions. Those must be implemented before operating the marketplace with real customers.

## Next milestones

1. Supabase data model and security
2. Authentication and role-based access
3. Customer booking history
4. Provider onboarding and job management
5. Admin operations dashboard
6. Notifications, payment integration, and operational monitoring
