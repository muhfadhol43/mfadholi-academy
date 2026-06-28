export type UserRole = "admin" | "student";
export type CourseLevel = "N5" | "N4" | "N3" | "N2" | "N1";
export type CourseStatus = "draft" | "published" | "archived";
export type QuizQuestionType = "single" | "multiple";
export type NotificationType = "info" | "success" | "warning" | "system";
export type DownloadType = "pdf" | "worksheet" | "vocab_sheet";

export interface Profile {
  id: string;
  full_name: string;
  username: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  level: CourseLevel;
  duration_minutes: number;
  sensei_name: string;
  sensei_avatar_url: string | null;
  price: number;
  is_premium: boolean;
  status: CourseStatus;
  rating: number;
  total_students: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  chapter_id: string;
  course_id: string;
  title: string;
  slug: string;
  summary: string | null;
  duration_minutes: number;
  order_index: number;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonVideo {
  id: string;
  lesson_id: string;
  youtube_url: string;
  youtube_id: string;
  duration_seconds: number;
  order_index: number;
  created_at: string;
}

export interface LessonAudio {
  id: string;
  lesson_id: string;
  title: string;
  audio_url: string;
  duration_seconds: number;
  order_index: number;
  created_at: string;
}

export interface Vocabulary {
  id: string;
  lesson_id: string;
  kanji: string | null;
  hiragana: string;
  romaji: string | null;
  meaning_id: string;
  audio_url: string | null;
  order_index: number;
  created_at: string;
}

export interface Grammar {
  id: string;
  lesson_id: string;
  pattern: string;
  explanation: string;
  example_sentence_jp: string;
  example_sentence_id: string;
  order_index: number;
  created_at: string;
}

export interface Download {
  id: string;
  lesson_id: string;
  title: string;
  file_url: string;
  type: DownloadType;
  file_size_kb: number | null;
  created_at: string;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  passing_score: number;
  time_limit_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  question_type: QuizQuestionType;
  order_index: number;
  created_at: string;
}

export interface QuizAnswer {
  id: string;
  question_id: string;
  answer_text: string;
  is_correct: boolean;
  order_index: number;
  created_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  is_completed: boolean;
  watched_seconds: number;
  quiz_score: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  progress_percent: number;
  is_completed: boolean;
  last_lesson_id: string | null;
  enrolled_at: string;
  completed_at: string | null;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  lesson_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  lesson_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  certificate_url: string | null;
  issued_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      courses: { Row: Course; Insert: Partial<Course>; Update: Partial<Course> };
      chapters: { Row: Chapter; Insert: Partial<Chapter>; Update: Partial<Chapter> };
      lessons: { Row: Lesson; Insert: Partial<Lesson>; Update: Partial<Lesson> };
      lesson_videos: { Row: LessonVideo; Insert: Partial<LessonVideo>; Update: Partial<LessonVideo> };
      lesson_audios: { Row: LessonAudio; Insert: Partial<LessonAudio>; Update: Partial<LessonAudio> };
      vocabularies: { Row: Vocabulary; Insert: Partial<Vocabulary>; Update: Partial<Vocabulary> };
      grammars: { Row: Grammar; Insert: Partial<Grammar>; Update: Partial<Grammar> };
      downloads: { Row: Download; Insert: Partial<Download>; Update: Partial<Download> };
      quizzes: { Row: Quiz; Insert: Partial<Quiz>; Update: Partial<Quiz> };
      quiz_questions: { Row: QuizQuestion; Insert: Partial<QuizQuestion>; Update: Partial<QuizQuestion> };
      quiz_answers: { Row: QuizAnswer; Insert: Partial<QuizAnswer>; Update: Partial<QuizAnswer> };
      lesson_progress: { Row: LessonProgress; Insert: Partial<LessonProgress>; Update: Partial<LessonProgress> };
      course_progress: { Row: CourseProgress; Insert: Partial<CourseProgress>; Update: Partial<CourseProgress> };
      bookmarks: { Row: Bookmark; Insert: Partial<Bookmark>; Update: Partial<Bookmark> };
      comments: { Row: Comment; Insert: Partial<Comment>; Update: Partial<Comment> };
      notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification> };
      certificates: { Row: Certificate; Insert: Partial<Certificate>; Update: Partial<Certificate> };
    };
  };
}
