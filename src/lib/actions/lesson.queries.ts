import { createClient } from "@/lib/supabase/server";

export async function getLessonDetail(courseSlug: string, lessonSlug: string) {
  const supabase = await createClient();

  const { data: course } = await supabase.from("courses").select("*").eq("slug", courseSlug).single();
  if (!course) return null;

  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      "*, chapters(title, order_index), lesson_videos(*), lesson_audios(*), vocabularies(*), grammars(*), downloads(*)"
    )
    .eq("course_id", course.id)
    .eq("slug", lessonSlug)
    .single();

  if (!lesson) return null;

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("*, quiz_questions(*, quiz_answers(*))")
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id, slug, title, order_index, chapter_id, chapters(order_index)")
    .eq("course_id", course.id);

  const sorted = (allLessons ?? []).sort((a: any, b: any) => {
    const chapterDiff = (a.chapters?.order_index ?? 0) - (b.chapters?.order_index ?? 0);
    if (chapterDiff !== 0) return chapterDiff;
    return a.order_index - b.order_index;
  });

  const currentIndex = sorted.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const nextLesson = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return { course, lesson, quiz, prevLesson, nextLesson };
}

export async function getLessonComments(lessonId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("*, profiles(full_name, avatar_url)")
    .eq("lesson_id", lessonId)
    .is("parent_id", null)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getLessonProgressStatus(userId: string, lessonId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  return data;
}

export async function getBookmarkStatus(userId: string, lessonId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  return !!data;
}
