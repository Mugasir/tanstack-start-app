create or replace function public.touch_updated_at()
returns trigger language plpgsql
security definer set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

drop policy "public read media" on storage.objects;
create policy "public read media files" on storage.objects
  for select using (bucket_id = 'media' and (storage.foldername(name))[1] is not null);