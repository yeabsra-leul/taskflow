-- Enable required extensions (for UUID user IDs)
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text,
  subscription_plan text check (subscription_plan in ('free', 'premium')) default 'free',
  boards_limit integer default 2,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);