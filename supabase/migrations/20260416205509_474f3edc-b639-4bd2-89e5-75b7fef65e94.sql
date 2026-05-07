create type public.app_role as enum ('admin', 'editor', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = 'admin')
$$;

create policy "users can read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "admins can read all roles" on public.user_roles
  for select to authenticated using (public.is_admin(auth.uid()));
create policy "admins manage roles" on public.user_roles
  for all to authenticated using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create type public.content_status as enum ('draft', 'published');

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null, caption text, details text,
  image_url text not null,
  status content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null, caption text, details text,
  thumbnail_url text,
  media_type text not null default 'youtube',
  media_url text not null,
  status content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.daily_quotes (
  id uuid primary key default gen_random_uuid(),
  title text not null, caption text, details text, image_url text,
  status content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.livestream (
  id uuid primary key default gen_random_uuid(),
  title text not null, caption text, details text,
  embed_url text not null,
  is_live boolean not null default false,
  status content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id int primary key default 1,
  church_name text not null default 'Kanyinasheema Ministries International',
  tagline text default 'Prayer • Prophecy • Healing • Deliverance',
  contact_phone_1 text default '+256 755 668 815',
  contact_phone_2 text default '+256 761 487 769',
  whatsapp text default '+256 757 182 981',
  facebook text default 'Kanyinasheema Kmi',
  tiktok text default '@hamilo040',
  youtube text default 'KANYINASHEEMA MINISTRIES INTERNATIONAL',
  twitter text default '@kanyinasheema',
  address text default 'Kampala, Uganda',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.site_settings (id) values (1);

alter table public.gallery enable row level security;
alter table public.sermons enable row level security;
alter table public.daily_quotes enable row level security;
alter table public.livestream enable row level security;
alter table public.site_settings enable row level security;

create policy "public read published gallery" on public.gallery for select using (status = 'published');
create policy "admin full gallery" on public.gallery for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "public read published sermons" on public.sermons for select using (status = 'published');
create policy "admin full sermons" on public.sermons for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "public read published quotes" on public.daily_quotes for select using (status = 'published');
create policy "admin full quotes" on public.daily_quotes for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "public read published livestream" on public.livestream for select using (status = 'published');
create policy "admin full livestream" on public.livestream for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "public read site settings" on public.site_settings for select using (true);
create policy "admin update site settings" on public.site_settings for update to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger t_gallery before update on public.gallery for each row execute function public.touch_updated_at();
create trigger t_sermons before update on public.sermons for each row execute function public.touch_updated_at();
create trigger t_quotes before update on public.daily_quotes for each row execute function public.touch_updated_at();
create trigger t_livestream before update on public.livestream for each row execute function public.touch_updated_at();
create trigger t_settings before update on public.site_settings for each row execute function public.touch_updated_at();

insert into storage.buckets (id, name, public) values ('media', 'media', true);

create policy "public read media" on storage.objects for select using (bucket_id = 'media');
create policy "admin upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin(auth.uid()));
create policy "admin update media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_admin(auth.uid()));
create policy "admin delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_admin(auth.uid()));