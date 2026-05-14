create index if not exists social_posts_user_id_idx on public.social_posts (user_id);
create index if not exists ai_insights_user_id_idx on public.ai_insights (user_id);

drop policy if exists "creator_profiles_select_own" on public.creator_profiles;
drop policy if exists "creator_profiles_insert_own" on public.creator_profiles;
drop policy if exists "creator_profiles_update_own" on public.creator_profiles;
drop policy if exists "social_accounts_select_own" on public.social_accounts;
drop policy if exists "social_accounts_insert_own" on public.social_accounts;
drop policy if exists "social_accounts_update_own" on public.social_accounts;
drop policy if exists "social_posts_select_own" on public.social_posts;
drop policy if exists "social_posts_insert_own" on public.social_posts;
drop policy if exists "social_posts_update_own" on public.social_posts;
drop policy if exists "follower_snapshots_select_own" on public.follower_snapshots;
drop policy if exists "follower_snapshots_insert_own" on public.follower_snapshots;
drop policy if exists "follower_snapshots_update_own" on public.follower_snapshots;
drop policy if exists "audience_snapshots_select_own" on public.audience_snapshots;
drop policy if exists "audience_snapshots_insert_own" on public.audience_snapshots;
drop policy if exists "audience_snapshots_update_own" on public.audience_snapshots;
drop policy if exists "ai_insights_select_own" on public.ai_insights;
drop policy if exists "ai_insights_insert_own" on public.ai_insights;
drop policy if exists "ai_insights_update_own" on public.ai_insights;

create policy "creator_profiles_select_own"
on public.creator_profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "creator_profiles_insert_own"
on public.creator_profiles
for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "creator_profiles_update_own"
on public.creator_profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "social_accounts_select_own"
on public.social_accounts
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "social_accounts_insert_own"
on public.social_accounts
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "social_accounts_update_own"
on public.social_accounts
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "social_posts_select_own"
on public.social_posts
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "social_posts_insert_own"
on public.social_posts
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "social_posts_update_own"
on public.social_posts
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "follower_snapshots_select_own"
on public.follower_snapshots
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "follower_snapshots_insert_own"
on public.follower_snapshots
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "follower_snapshots_update_own"
on public.follower_snapshots
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "audience_snapshots_select_own"
on public.audience_snapshots
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "audience_snapshots_insert_own"
on public.audience_snapshots
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "audience_snapshots_update_own"
on public.audience_snapshots
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "ai_insights_select_own"
on public.ai_insights
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "ai_insights_insert_own"
on public.ai_insights
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "ai_insights_update_own"
on public.ai_insights
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
