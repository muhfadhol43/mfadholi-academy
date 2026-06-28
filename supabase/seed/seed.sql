-- =====================================================================
-- Mfadholi.Dev Academy — Seed Data
-- NOTE: run after creating at least 1 admin user via Supabase Auth,
-- then update its profile role manually:
--   update profiles set role = 'admin' where id = '<auth_user_uuid>';
-- =====================================================================

-- Courses
insert into courses (id, title, slug, description, thumbnail_url, level, duration_minutes, sensei_name, price, is_premium, status, rating, total_students)
values
  ('11111111-1111-1111-1111-111111111111', 'Minna no Nihongo Bab 1 - Perkenalan Diri', 'minna-no-nihongo-bab-1-perkenalan-diri',
   'Belajar memperkenalkan diri dalam bahasa Jepang sesuai buku Minna no Nihongo.', '/thumbnails/course-1.jpg', 'N5', 120,
   'Sensei Fadhiel', 0, false, 'published', 4.9, 2450),
  ('22222222-2222-2222-2222-222222222222', 'Hiragana Dasar Lengkap untuk Pemula', 'hiragana-dasar-lengkap-untuk-pemula',
   'Kuasai seluruh huruf hiragana beserta cara baca dan tulisnya.', '/thumbnails/course-2.jpg', 'N5', 90,
   'Sensei Yuki', 0, false, 'published', 4.8, 1980),
  ('33333333-3333-3333-3333-333333333333', 'Kosakata Sehari-hari Bahasa Jepang', 'kosakata-sehari-hari-bahasa-jepang',
   'Kumpulan kosakata yang sering dipakai dalam percakapan sehari-hari.', '/thumbnails/course-3.jpg', 'N5', 90,
   'Sensei Fadhiel', 0, false, 'published', 4.9, 1750),
  ('44444444-4444-4444-4444-444444444444', 'Minna no Nihongo Bab 13 - Makan di Restoran', 'minna-no-nihongo-bab-13-makan-di-restoran',
   'Pelajari percakapan dan tata bahasa untuk situasi makan di restoran.', '/thumbnails/course-4.jpg', 'N4', 110,
   'Sensei Yuki', 149000, true, 'published', 4.9, 1420);

-- Chapters for course 1
insert into chapters (id, course_id, title, order_index) values
  ('aaaaaaa1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Bab 1 - Perkenalan Diri', 1),
  ('aaaaaaa1-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Bab 2 - Ini, Itu, Siapa', 2),
  ('aaaaaaa1-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Bab 3 - Keluarga Saya', 3),
  ('aaaaaaa1-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Bab 4 - Kegiatan Sehari-hari', 4),
  ('aaaaaaa1-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Bab 5 - Waktu dan Tanggal', 5);

-- Lessons for chapter 1
insert into lessons (id, chapter_id, course_id, title, slug, summary, duration_minutes, order_index, is_free_preview) values
  ('bbbbbbb1-0000-0000-0000-000000000001', 'aaaaaaa1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Video Pembelajaran', 'video-pembelajaran', 'Pengantar perkenalan diri dalam bahasa Jepang.', 25, 1, true),
  ('bbbbbbb1-0000-0000-0000-000000000002', 'aaaaaaa1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Kosakata', 'kosakata', 'Kosakata penting bab perkenalan diri.', 10, 2, false),
  ('bbbbbbb1-0000-0000-0000-000000000003', 'aaaaaaa1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Grammar', 'grammar', 'Pola kalimat dasar memperkenalkan diri.', 15, 3, false),
  ('bbbbbbb1-0000-0000-0000-000000000004', 'aaaaaaa1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Contoh Kalimat', 'contoh-kalimat', 'Contoh penerapan kalimat perkenalan diri.', 8, 4, false),
  ('bbbbbbb1-0000-0000-0000-000000000005', 'aaaaaaa1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Latihan', 'latihan', 'Latihan interaktif bab 1.', 15, 5, false),
  ('bbbbbbb1-0000-0000-0000-000000000006', 'aaaaaaa1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Quiz', 'quiz', 'Quiz evaluasi bab 1.', 10, 6, false),
  ('bbbbbbb1-0000-0000-0000-000000000007', 'aaaaaaa1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Ringkasan', 'ringkasan', 'Ringkasan materi bab 1.', 5, 7, false);

-- Lesson video for "Video Pembelajaran"
insert into lesson_videos (lesson_id, youtube_url, youtube_id, duration_seconds, order_index) values
  ('bbbbbbb1-0000-0000-0000-000000000001', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 1500, 1);

-- Vocabularies for lesson "Kosakata"
insert into vocabularies (lesson_id, kanji, hiragana, romaji, meaning_id, order_index) values
  ('bbbbbbb1-0000-0000-0000-000000000002', '私', 'わたし', 'watashi', 'Saya', 1),
  ('bbbbbbb1-0000-0000-0000-000000000002', '学生', 'がくせい', 'gakusei', 'Mahasiswa / Pelajar', 2),
  ('bbbbbbb1-0000-0000-0000-000000000002', '日本', 'にほん', 'nihon', 'Jepang', 3),
  ('bbbbbbb1-0000-0000-0000-000000000002', '人', 'ひと', 'hito', 'Orang', 4);

-- Grammar for lesson "Grammar"
insert into grammars (lesson_id, pattern, explanation, example_sentence_jp, example_sentence_id, order_index) values
  ('bbbbbbb1-0000-0000-0000-000000000003', 'N1 は N2 です', 'Digunakan untuk menyatakan bahwa N1 adalah N2.', 'わたしはファディエルです。', 'Saya adalah Fadhiel.', 1),
  ('bbbbbbb1-0000-0000-0000-000000000003', 'N1 は N2 ですか', 'Bentuk pertanyaan dari pola N1 は N2 です.', 'あなたはがくせいですか。', 'Apakah kamu seorang pelajar?', 2);

-- Quiz for lesson "Quiz"
insert into quizzes (id, lesson_id, title, passing_score, time_limit_minutes) values
  ('ccccccc1-0000-0000-0000-000000000001', 'bbbbbbb1-0000-0000-0000-000000000006', 'Quiz Bab 1 - Perkenalan Diri', 70, 10);

insert into quiz_questions (id, quiz_id, question, question_type, order_index) values
  ('ddddddd1-0000-0000-0000-000000000001', 'ccccccc1-0000-0000-0000-000000000001', 'Apa arti dari「わたし」?', 'single', 1),
  ('ddddddd1-0000-0000-0000-000000000002', 'ccccccc1-0000-0000-0000-000000000001', 'Pilih pola kalimat yang benar untuk memperkenalkan diri.', 'single', 2);

insert into quiz_answers (question_id, answer_text, is_correct, order_index) values
  ('ddddddd1-0000-0000-0000-000000000001', 'Saya', true, 1),
  ('ddddddd1-0000-0000-0000-000000000001', 'Kamu', false, 2),
  ('ddddddd1-0000-0000-0000-000000000001', 'Dia', false, 3),
  ('ddddddd1-0000-0000-0000-000000000001', 'Kita', false, 4),
  ('ddddddd1-0000-0000-0000-000000000002', 'わたしはファディエルです。', true, 1),
  ('ddddddd1-0000-0000-0000-000000000002', 'わたしファディエルはです。', false, 2),
  ('ddddddd1-0000-0000-0000-000000000002', 'ファディエルですわたしは。', false, 3);

-- Downloads
insert into downloads (lesson_id, title, file_url, type, file_size_kb) values
  ('bbbbbbb1-0000-0000-0000-000000000007', 'Ringkasan Bab 1.pdf', '/documents/ringkasan-bab-1.pdf', 'pdf', 450),
  ('bbbbbbb1-0000-0000-0000-000000000005', 'Worksheet Latihan Bab 1.pdf', '/documents/worksheet-bab-1.pdf', 'worksheet', 320),
  ('bbbbbbb1-0000-0000-0000-000000000002', 'Daftar Kosakata Bab 1.pdf', '/documents/kosakata-bab-1.pdf', 'vocab_sheet', 180);
