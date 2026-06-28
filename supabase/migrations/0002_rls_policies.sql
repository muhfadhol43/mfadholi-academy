-- =====================================================================
-- Mfadholi.Dev Academy — Row Level Security Policies
-- =====================================================================

alter table profiles enable row level security;
alter table courses enable row level security;
alter table chapters enable row level security;
alter table lessons enable row level security;
alter table lesson_videos enable row level security;
alter table lesson_audios enable row level security;
alter table vocabularies enable row level security;
alter table grammars enable row level security;
alter table downloads enable row level security;
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_answers enable row level security;
alter table lesson_progress enable row level security;
alter table course_progress enable row level security;
alter table bookmarks enable row level security;
alter table comments enable row level security;
alter table notifications enable row level security;
alter table certificates enable row level security;

-- helper function: is current user admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- =====================================================================
-- PROFILES
-- =====================================================================
create policy "profiles_select_own_or_admin" on profiles
  for select using (auth.uid() = id or is_admin());

create policy "profiles_select_public" on profiles
  for select using (true);

create policy "profiles_update_own" on profiles
  for update using (auth.uid() = id or is_admin());

create policy "profiles_insert_own" on profiles
  for insert with check (auth.uid() = id);

-- =====================================================================
-- COURSES (public read published, admin full access)
-- =====================================================================
create policy "courses_select_published" on courses
  for select using (status = 'published' or is_admin());

create policy "courses_admin_all" on courses
  for all using (is_admin()) with check (is_admin());

-- =====================================================================
-- CHAPTERS
-- =====================================================================
create policy "chapters_select_all" on chapters
  for select using (true);

create policy "chapters_admin_write" on chapters
  for insert with check (is_admin());
create policy "chapters_admin_update" on chapters
  for update using (is_admin());
create policy "chapters_admin_delete" on chapters
  for delete using (is_admin());

-- =====================================================================
-- LESSONS
-- =====================================================================
create policy "lessons_select_all" on lessons
  for select using (true);

create policy "lessons_admin_write" on lessons
  for insert with check (is_admin());
create policy "lessons_admin_update" on lessons
  for update using (is_admin());
create policy "lessons_admin_delete" on lessons
  for delete using (is_admin());

-- =====================================================================
-- LESSON CONTENT (videos, audios, vocab, grammar, downloads)
-- read: any authenticated user; write: admin only
-- =====================================================================
create policy "lesson_videos_select" on lesson_videos for select using (true);
create policy "lesson_videos_admin" on lesson_videos for all using (is_admin()) with check (is_admin());

create policy "lesson_audios_select" on lesson_audios for select using (true);
create policy "lesson_audios_admin" on lesson_audios for all using (is_admin()) with check (is_admin());

create policy "vocabularies_select" on vocabularies for select using (true);
create policy "vocabularies_admin" on vocabularies for all using (is_admin()) with check (is_admin());

create policy "grammars_select" on grammars for select using (true);
create policy "grammars_admin" on grammars for all using (is_admin()) with check (is_admin());

create policy "downloads_select" on downloads for select using (true);
create policy "downloads_admin" on downloads for all using (is_admin()) with check (is_admin());

-- =====================================================================
-- QUIZZES
-- =====================================================================
create policy "quizzes_select" on quizzes for select using (true);
create policy "quizzes_admin" on quizzes for all using (is_admin()) with check (is_admin());

create policy "quiz_questions_select" on quiz_questions for select using (true);
create policy "quiz_questions_admin" on quiz_questions for all using (is_admin()) with check (is_admin());

create policy "quiz_answers_select" on quiz_answers for select using (true);
create policy "quiz_answers_admin" on quiz_answers for all using (is_admin()) with check (is_admin());

-- =====================================================================
-- LESSON PROGRESS (own data only)
-- =====================================================================
create policy "lesson_progress_select_own" on lesson_progress
  for select using (auth.uid() = user_id or is_admin());
create policy "lesson_progress_insert_own" on lesson_progress
  for insert with check (auth.uid() = user_id);
create policy "lesson_progress_update_own" on lesson_progress
  for update using (auth.uid() = user_id or is_admin());

-- =====================================================================
-- COURSE PROGRESS (own data only)
-- =====================================================================
create policy "course_progress_select_own" on course_progress
  for select using (auth.uid() = user_id or is_admin());
create policy "course_progress_insert_own" on course_progress
  for insert with check (auth.uid() = user_id);
create policy "course_progress_update_own" on course_progress
  for update using (auth.uid() = user_id or is_admin());

-- =====================================================================
-- BOOKMARKS (own data only)
-- =====================================================================
create policy "bookmarks_select_own" on bookmarks
  for select using (auth.uid() = user_id);
create policy "bookmarks_insert_own" on bookmarks
  for insert with check (auth.uid() = user_id);
create policy "bookmarks_delete_own" on bookmarks
  for delete using (auth.uid() = user_id);

-- =====================================================================
-- COMMENTS (read all, write own, admin moderate)
-- =====================================================================
create policy "comments_select_all" on comments
  for select using (true);
create policy "comments_insert_own" on comments
  for insert with check (auth.uid() = user_id);
create policy "comments_update_own" on comments
  for update using (auth.uid() = user_id or is_admin());
create policy "comments_delete_own_or_admin" on comments
  for delete using (auth.uid() = user_id or is_admin());

-- =====================================================================
-- NOTIFICATIONS (own data only)
-- =====================================================================
create policy "notifications_select_own" on notifications
  for select using (auth.uid() = user_id);
create policy "notifications_update_own" on notifications
  for update using (auth.uid() = user_id);
create policy "notifications_admin_insert" on notifications
  for insert with check (is_admin() or auth.uid() = user_id);
create policy "notifications_delete_own" on notifications
  for delete using (auth.uid() = user_id);

-- =====================================================================
-- CERTIFICATES (own data only, admin issues)
-- =====================================================================
create policy "certificates_select_own" on certificates
  for select using (auth.uid() = user_id or is_admin());
create policy "certificates_admin_insert" on certificates
  for insert with check (is_admin());
create policy "certificates_admin_update" on certificates
  for update using (is_admin());
create policy "certificates_admin_delete" on certificates
  for delete using (is_admin());
