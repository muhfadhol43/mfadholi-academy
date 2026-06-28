"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function markLessonCompleteAction(lessonId: string, courseId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Anda harus login." };

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      course_id: courseId,
      is_completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  );

  if (error) return { success: false, message: "Gagal menandai lesson selesai." };

  try {
    await supabase.rpc("recompute_course_progress", { p_user_id: user.id, p_course_id: courseId });
  } catch {
    // ignore error silently
  }

  await supabase.from("course_progress").update({ last_lesson_id: lessonId }).eq("user_id", user.id).eq("course_id", courseId);

  revalidatePath("/dashboard");
  return { success: true, message: "Lesson ditandai selesai!" };
}

export async function toggleBookmarkAction(lessonId: string): Promise<ActionResult & { bookmarked?: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Anda harus login." };

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (existing) {
    await supabase.from("bookmarks").delete().eq("id", existing.id);
    revalidatePath("/bookmarks");
    return { success: true, message: "Bookmark dihapus.", bookmarked: false };
  }

  const { error } = await supabase.from("bookmarks").insert({ user_id: user.id, lesson_id: lessonId });
  if (error) return { success: false, message: "Gagal menambah bookmark." };

  revalidatePath("/bookmarks");
  return { success: true, message: "Lesson ditambahkan ke bookmark.", bookmarked: true };
}

export async function addCommentAction(lessonId: string, content: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Anda harus login untuk berkomentar." };

  if (!content.trim()) return { success: false, message: "Komentar tidak boleh kosong." };

  const { error } = await supabase.from("comments").insert({
    lesson_id: lessonId,
    user_id: user.id,
    content: content.trim(),
  });

  if (error) return { success: false, message: "Gagal mengirim komentar." };

  revalidatePath(`/courses`);
  return { success: true, message: "Komentar berhasil dikirim." };
}

export async function submitQuizAttemptAction(payload: {
  lessonId: string;
  courseId: string;
  score: number;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Anda harus login." };

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: payload.lessonId,
      course_id: payload.courseId,
      quiz_score: payload.score,
      is_completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  );

  if (error) return { success: false, message: "Gagal menyimpan hasil quiz." };

  try {
    await supabase.rpc("recompute_course_progress", { p_user_id: user.id, p_course_id: payload.courseId });
  } catch {
    // ignore error silently
  }

  return { success: true, message: "Hasil quiz berhasil disimpan." };
}