-- Digital Product Passport schema
-- Run this in Supabase SQL editor (or psql) before seed.sql

create extension if not exists pgcrypto;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  model text not null,
  manufacturer text not null,
  attributes jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  event_type text not null,
  actor text not null,
  location text,
  notes text,
  attributes jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists events_product_id_created_at_idx
  on events (product_id, created_at desc);
