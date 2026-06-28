-- =====================================================================
-- Mfadholi.Dev Academy — Initial Schema
-- =====================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =====================================================================
-- ENUM TYPES
-- =====================================================================
create type user_role as enum ('admin', 'student');
create type course_level as enum ('N5', 'N4', 'N3', 'N2', 'N1');
create type course_status as enum ('draft', 'published', 'archived');
create type quiz_question_type as enum ('single', 'multiple');
create type notification_type as enum ('info', 'success', 'warning', 'system');
create type download_type as enum ('pdf', 'worksheet', 'vocab_sheet');

-- =====================================================================
-- TABLE: profiles
-- =====================================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  username text unique,
  avatar_url text,
  role user_role not null default 'student',
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_profiles_role on profiles(role);
create index idx_profiles_username on profiles(username);

-- =====================================================================
-- TABLE: courses
-- =====================================================================
create table courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null,
  thumbnail_url text,
  level course_level not null,
  duration_minutes integer not null default 0,
  sensei_name text not null,
  sensei_avatar_url text,
  price numeric(12,2) not null default 0,
  is_premium boolean not null default false,
  status course_status not null default 'draft',
  rating numeric(3,2) not null default 0,
  total_students integer not null default 0,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_courses_slug on courses(slug);
create index idx_courses_level on courses(level);
create index idx_courses_status on courses(status);

-- =====================================================================
-- TABLE: chapters
-- =====================================================================
create table chapters (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  description text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, order_index)
);
create index idx_chapters_course_id on chapters(course_id);

-- =====================================================================
-- TABLE: lessons
-- =====================================================================
create table lessons (
  id uuid primary key default uuid_generate_v4(),
  chapter_id uuid not null references chapters(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  title text not null,
  slug text not null,
  summary text,
  duration_minutes integer not null default 0,
  order_index integer not null default 0,
  is_free_preview boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(chapter_id, order_index),
  unique(course_id, slug)
);
create index idx_lessons_chapter_id on lessons(chapter_id);
create index idx_lessons_course_id on lessons(course_id);

-- =====================================================================
-- TABLE: lesson_videos
-- =====================================================================
create table lesson_videos (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  youtube_url text not null,
  youtube_id text not null,
  duration_seconds integer not null default 0,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);
create index idx_lesson_videos_lesson_id on lesson_videos(lesson_id);

-- =====================================================================
-- TABLE: lesson_audios
-- =====================================================================
create table lesson_audios (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  title text not null,
  audio_url text not null,
  duration_seconds integer not null default 0,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);
create index idx_lesson_audios_lesson_id on lesson_audios(lesson_id);

-- =====================================================================
-- TABLE: vocabularies
-- =====================================================================
create table vocabularies (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  kanji text,
  hiragana text not null,
  romaji text,
  meaning_id text not null,
  audio_url text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);
create index idx_vocabularies_lesson_id on vocabularies(lesson_id);

-- =====================================================================
-- TABLE: grammars
-- =====================================================================
create table grammars (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  pattern text not null,
  explanation text not null,
  example_sentence_jp text not null,
  example_sentence_id text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);
create index idx_grammars_lesson_id on grammars(lesson_id);

-- =====================================================================
-- TABLE: downloads
-- =====================================================================
create table downloads (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  title text not null,
  file_url text not null,
  type download_type not null,
  file_size_kb integer,
  created_at timestamptz not null default now()
);
create index idx_downloads_lesson_id on downloads(lesson_id);

-- =====================================================================
-- TABLE: quizzes
-- =====================================================================
create table quizzes (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  title text not null,
  passing_score integer not null default 70,
  time_limit_minutes integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_quizzes_lesson_id on quizzes(lesson_id);

-- =====================================================================
-- TABLE: quiz_questions
-- =====================================================================
create table quiz_questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  question text not null,
  question_type quiz_question_type not null default 'single',
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);
create index idx_quiz_questions_quiz_id on quiz_questions(quiz_id);

-- =====================================================================
-- TABLE: quiz_answers
-- =====================================================================
create table quiz_answers (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid not null references quiz_questions(id) on delete cascade,
  answer_text text not null,
  is_correct boolean not null default false,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);
create index idx_quiz_answers_question_id on quiz_answers(question_id);

-- =====================================================================
-- TABLE: lesson_progress
-- =====================================================================
create table lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  is_completed boolean not null default false,
  watched_seconds integer not null default 0,
  quiz_score integer,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);
create index idx_lesson_progress_user_id on lesson_progress(user_id);
create index idx_lesson_progress_course_id on lesson_progress(course_id);

-- =====================================================================
-- TABLE: course_progress
-- =====================================================================
create table course_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  progress_percent integer not null default 0,
  is_completed boolean not null default false,
  last_lesson_id uuid references lessons(id) on delete set null,
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, course_id)
);
create index idx_course_progress_user_id on course_progress(user_id);
create index idx_course_progress_course_id on course_progress(course_id);

-- =====================================================================
-- TABLE: bookmarks
-- =====================================================================
create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);
create index idx_bookmarks_user_id on bookmarks(user_id);

-- =====================================================================
-- TABLE: comments
-- =====================================================================
create table comments (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  content text not null,
  is_edited boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_comments_lesson_id on comments(lesson_id);
create index idx_comments_user_id on comments(user_id);
create index idx_comments_parent_id on comments(parent_id);

-- =====================================================================
-- TABLE: notifications
-- =====================================================================
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type notification_type not null default 'info',
  is_read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);
create index idx_notifications_user_id on notifications(user_id);
create index idx_notifications_is_read on notifications(is_read);

-- =====================================================================
-- TABLE: certificates
-- =====================================================================
create table certificates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  certificate_number text not null unique,
  certificate_url text,
  issued_at timestamptz not null default now(),
  unique(user_id, course_id)
);
create index idx_certificates_user_id on certificates(user_id);

-- =====================================================================
-- updated_at trigger function
-- =====================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated_at before update on profiles for each row execute function set_updated_at();
create trigger trg_courses_updated_at before update on courses for each row execute function set_updated_at();
create trigger trg_chapters_updated_at before update on chapters for each row execute function set_updated_at();
create trigger trg_lessons_updated_at before update on lessons for each row execute function set_updated_at();
create trigger trg_quizzes_updated_at before update on quizzes for each row execute function set_updated_at();
create trigger trg_lesson_progress_updated_at before update on lesson_progress for each row execute function set_updated_at();
create trigger trg_course_progress_updated_at before update on course_progress for each row execute function set_updated_at();
create trigger trg_comments_updated_at before update on comments for each row execute function set_updated_at();

-- =====================================================================
-- auto create profile on signup
-- =====================================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    'student'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
