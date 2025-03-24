
-- NOTE: This file is for documentation only.
-- To set up these tables, you'll need to run these SQL commands in your Supabase dashboard.

-- Enable RLS (Row Level Security)
alter default privileges in schema public deny all on tables to public;
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all privileges on all tables in schema public to postgres, service_role;
grant select on all tables in schema public to anon;
grant all privileges on all tables in schema public to authenticated;

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  user_id uuid references auth.users on delete cascade,
  username text,
  wallet_address text,
  balance text default '1000 PT',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policy for profiles
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = user_id);

-- Create transactions table
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade,
  transaction_type text check (transaction_type in ('buy', 'sell', 'transfer')),
  amount integer,
  token_type text check (token_type in ('power', 'nft')),
  token_id text,
  price numeric,
  status text check (status in ('completed', 'pending', 'failed')),
  counterparty text,
  tx_hash text,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policy for transactions
create policy "Users can view their own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

-- Create power token listings table
create table if not exists public.power_listings (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references auth.users on delete cascade,
  seller_address text,
  amount integer,
  price numeric,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policy for power listings
create policy "Anyone can view power listings"
  on power_listings for select
  to anon, authenticated
  using (true);

create policy "Users can insert their own power listings"
  on power_listings for insert
  with check (auth.uid() = seller_id);

create policy "Users can update their own power listings"
  on power_listings for update
  using (auth.uid() = seller_id);

-- Create NFT listings table
create table if not exists public.nft_listings (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references auth.users on delete cascade,
  seller_address text,
  title text,
  description text,
  price numeric,
  nft_type text,
  token_id text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policy for NFT listings
create policy "Anyone can view NFT listings"
  on nft_listings for select
  to anon, authenticated
  using (true);

create policy "Users can insert their own NFT listings"
  on nft_listings for insert
  with check (auth.uid() = seller_id);

create policy "Users can update their own NFT listings"
  on nft_listings for update
  using (auth.uid() = seller_id);

-- Create trigger to update timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.power_listings
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.nft_listings
  for each row
  execute procedure public.handle_updated_at();
