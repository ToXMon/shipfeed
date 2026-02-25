-- ShipFeed initial schema
-- Run in Supabase SQL editor or via migration tooling.

create extension if not exists pgcrypto;

create type public.changelog_status as enum ('draft', 'published');
create type public.subscription_plan as enum ('free', 'pro');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.changelogs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  content text not null,
  version varchar(50) not null,
  status public.changelog_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  author_id uuid not null references public.profiles(id) on delete cascade
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  email text not null,
  confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  unique(project_id, email)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan public.subscription_plan not null default 'free',
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id)
);

-- Auto-create profile row when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.changelogs enable row level security;
alter table public.subscribers enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles policies
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Projects policies
create policy "Owners can manage own projects"
  on public.projects for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Public can read project if it has published changelogs"
  on public.projects for select
  using (
    exists (
      select 1 from public.changelogs c
      where c.project_id = projects.id
      and c.status = 'published'
    )
    or auth.uid() = owner_id
  );

-- Changelog policies
create policy "Owners and authors can manage changelogs"
  on public.changelogs for all
  using (
    auth.uid() = author_id
    or exists (
      select 1 from public.projects p
      where p.id = changelogs.project_id
      and p.owner_id = auth.uid()
    )
  )
  with check (
    auth.uid() = author_id
    or exists (
      select 1 from public.projects p
      where p.id = changelogs.project_id
      and p.owner_id = auth.uid()
    )
  );

create policy "Public can read published changelogs"
  on public.changelogs for select
  using (status = 'published' or auth.uid() = author_id or exists (
    select 1 from public.projects p
    where p.id = changelogs.project_id and p.owner_id = auth.uid()
  ));

-- Subscriber policies
create policy "Owners can read subscribers of their projects"
  on public.subscribers for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = subscribers.project_id and p.owner_id = auth.uid()
    )
  );

create policy "Public can subscribe"
  on public.subscribers for insert
  with check (true);

create policy "Owners can delete subscribers"
  on public.subscribers for delete
  using (
    exists (
      select 1 from public.projects p
      where p.id = subscribers.project_id and p.owner_id = auth.uid()
    )
  );

-- Subscription policies
create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can update own subscription metadata"
  on public.subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
