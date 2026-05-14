create extension if not exists "pgcrypto";

create table if not exists public.creator_profiles (
  id uuid primary key,
  full_name text not null,
  avatar_url text,
  role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.creator_profiles(id) on delete cascade,
  platform text not null,
  handle text not null,
  platform_user_id text,
  connected boolean not null default false,
  followers integer not null default 0,
  change_percent numeric(6,2) not null default 0,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, platform)
);

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.creator_profiles(id) on delete cascade,
  platform text not null,
  platform_post_id text not null,
  title text not null,
  format text,
  published_at timestamptz not null,
  views integer not null default 0,
  likes integer not null default 0,
  comments integer not null default 0,
  shares integer not null default 0,
  saves integer not null default 0,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, platform_post_id)
);

create table if not exists public.follower_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.creator_profiles(id) on delete cascade,
  platform text not null,
  snapshot_date date not null,
  followers integer not null,
  created_at timestamptz not null default now(),
  unique (user_id, platform, snapshot_date)
);

create table if not exists public.audience_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.creator_profiles(id) on delete cascade,
  platform text not null,
  snapshot_date date not null,
  age_groups jsonb not null,
  gender jsonb not null,
  countries jsonb not null,
  best_times jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, platform, snapshot_date)
);

create table if not exists public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.creator_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  impact text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create schema if not exists private;

create or replace function private.handle_new_creator_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.creator_profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    'Creator strategist'
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure private.handle_new_creator_profile();

alter table public.creator_profiles enable row level security;
alter table public.social_accounts enable row level security;
alter table public.social_posts enable row level security;
alter table public.follower_snapshots enable row level security;
alter table public.audience_snapshots enable row level security;
alter table public.ai_insights enable row level security;

create policy "creator_profiles_select_own"
on public.creator_profiles
for select
to authenticated
using (auth.uid() = id);

create policy "creator_profiles_insert_own"
on public.creator_profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "creator_profiles_update_own"
on public.creator_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "social_accounts_select_own"
on public.social_accounts
for select
to authenticated
using (auth.uid() = user_id);

create policy "social_accounts_insert_own"
on public.social_accounts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "social_accounts_update_own"
on public.social_accounts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "social_posts_select_own"
on public.social_posts
for select
to authenticated
using (auth.uid() = user_id);

create policy "social_posts_insert_own"
on public.social_posts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "social_posts_update_own"
on public.social_posts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "follower_snapshots_select_own"
on public.follower_snapshots
for select
to authenticated
using (auth.uid() = user_id);

create policy "follower_snapshots_insert_own"
on public.follower_snapshots
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "follower_snapshots_update_own"
on public.follower_snapshots
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "audience_snapshots_select_own"
on public.audience_snapshots
for select
to authenticated
using (auth.uid() = user_id);

create policy "audience_snapshots_insert_own"
on public.audience_snapshots
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "audience_snapshots_update_own"
on public.audience_snapshots
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "ai_insights_select_own"
on public.ai_insights
for select
to authenticated
using (auth.uid() = user_id);

create policy "ai_insights_insert_own"
on public.ai_insights
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "ai_insights_update_own"
on public.ai_insights
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
