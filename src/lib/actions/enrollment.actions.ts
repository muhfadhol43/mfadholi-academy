"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

export async function enrollCourseAction(courseId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Anda harus login untuk mendaftar kelas ini." };
  }

  const { data: existing } = await supabase
    .from("course_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (existing) {
    return { success: true, message: "Anda sudah terdaftar di kelas ini." };
  }

  const { error } = await supabase.from("course_progress").insert({
    user_id: user.id,
    course_id: courseId,
    progress_percent: 0,
  });

  if (error) {
    return { success: false, message: "Gagal mendaftar kelas." };
  }

  try {
    await supabase.rpc("increment_total_students", { course_id_input: courseId });
  } catch {
    // ignore error silently
  }

  revalidatePath(`/dashboard`);
  return { success: true, message: "Berhasil mendaftar! Selamat belajar." };
}

export async function checkEnrollment(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isEnrolled: false, isOwner: false };

  const { data } = await supabase
    .from("course_progress")
    .select("id, progress_percent, last_lesson_id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  return { isEnrolled: !!data, progress: data };
}