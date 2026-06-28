-- =====================================================================
-- Mfadholi.Dev Academy — Storage Buckets
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('thumbnails', 'thumbnails', true, 5242880, array['image/png','image/jpeg','image/webp']),
  ('avatars', 'avatars', true, 2097152, array['image/png','image/jpeg','image/webp']),
  ('audios', 'audios', true, 20971520, array['audio/mpeg','audio/mp3','audio/wav']),
  ('documents', 'documents', true, 20971520, array['application/pdf']),
  ('certificates', 'certificates', true, 5242880, array['application/pdf','image/png'])
on conflict (id) do nothing;

-- THUMBNAILS bucket policies
create policy "thumbnails_public_read" on storage.objects
  for select using (bucket_id = 'thumbnails');
create policy "thumbnails_admin_write" on storage.objects
  for insert with check (bucket_id = 'thumbnails' and is_admin());
create policy "thumbnails_admin_update" on storage.objects
  for update using (bucket_id = 'thumbnails' and is_admin());
create policy "thumbnails_admin_delete" on storage.objects
  for delete using (bucket_id = 'thumbnails' and is_admin());

-- AVATARS bucket policies
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatars_owner_write" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid() is not null);
create policy "avatars_owner_update" on storage.objects
  for update using (bucket_id = 'avatars' and (owner = auth.uid() or is_admin()));
create policy "avatars_owner_delete" on storage.objects
  for delete using (bucket_id = 'avatars' and (owner = auth.uid() or is_admin()));

-- AUDIOS bucket policies
create policy "audios_public_read" on storage.objects
  for select using (bucket_id = 'audios');
create policy "audios_admin_write" on storage.objects
  for insert with check (bucket_id = 'audios' and is_admin());
create policy "audios_admin_update" on storage.objects
  for update using (bucket_id = 'audios' and is_admin());
create policy "audios_admin_delete" on storage.objects
  for delete using (bucket_id = 'audios' and is_admin());

-- DOCUMENTS bucket policies
create policy "documents_public_read" on storage.objects
  for select using (bucket_id = 'documents');
create policy "documents_admin_write" on storage.objects
  for insert with check (bucket_id = 'documents' and is_admin());
create policy "documents_admin_update" on storage.objects
  for update using (bucket_id = 'documents' and is_admin());
create policy "documents_admin_delete" on storage.objects
  for delete using (bucket_id = 'documents' and is_admin());

-- CERTIFICATES bucket policies
create policy "certificates_public_read" on storage.objects
  for select using (bucket_id = 'certificates');
create policy "certificates_admin_write" on storage.objects
  for insert with check (bucket_id = 'certificates' and is_admin());
create policy "certificates_admin_delete" on storage.objects
  for delete using (bucket_id = 'certificates' and is_admin());
