insert into public.creator_profiles (id, full_name, avatar_url, role)
values (
  '11111111-1111-1111-1111-111111111111',
  'Mara Vega',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
  'Creator strategist'
)
on conflict (id) do update
set
  full_name = excluded.full_name,
  avatar_url = excluded.avatar_url,
  role = excluded.role;
