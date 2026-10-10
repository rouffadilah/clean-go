-- CleanGo initial booking schema.
-- Run this file in the Supabase SQL Editor after creating a project.

create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  service_id text not null,
  service_name text not null,
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  customer_phone text not null check (char_length(customer_phone) between 8 and 30),
  address text not null check (char_length(address) between 5 and 1000),
  booking_date date not null,
  booking_time time not null,
  property_type text not null check (property_type in ('Rumah', 'Apartemen', 'Kantor')),
  notes text,
  estimated_price integer not null check (estimated_price >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'))
);

alter table public.bookings enable row level security;

-- The public booking form can create a request. It cannot list or read customer records.
drop policy if exists "Public can submit booking requests" on public.bookings;
create policy "Public can submit booking requests"
  on public.bookings
  for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and estimated_price >= 0
    and booking_date >= current_date
  );

-- No SELECT/UPDATE/DELETE policy is intentionally granted to public users.
-- Add authenticated role-based policies before implementing dashboards.
