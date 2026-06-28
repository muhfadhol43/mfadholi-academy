"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { chapterSchema } from "@/lib/validations/chapter-lesson.schema";

type ActionResult = { success: boolean; message: string };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return supabase;
}

export async function getAllCoursesForSelect() {
  const supabase = await assertAdmin();
  const { data } = await supabase.from("courses").select("id, title").order("title");
  return data ?? [];
}

export async function getChaptersByCourse(courseId?: string) {
  const supabase = await assertAdmin();
  let query = supabase.from("chapters").select("*, courses(title)").order("order_index");
  if (courseId) query = query.eq("course_id", courseId);
  const { data } = await query;
  return data ?? [];
}

export async function createChapterAction(formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const raw = {
    course_id: formData.get("course_id") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) ?? "",
    order_index: formData.get("order_index") as string,
  };

  const parsed = chapterSchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const { error } = await supabase.from("chapters").insert(parsed.data);
  if (error) return { success: false, message: "Gagal membuat chapter. Pastikan urutan tidak duplikat." };

  revalidatePath("/admin/chapters");
  return { success: true, message: "Chapter berhasil dibuat." };
}

export async function updateChapterAction(chapterId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const raw = {
    course_id: formData.get("course_id") as string,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) ?? "",
    order_index: formData.get("order_index") as string,
  };

  const parsed = chapterSchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const { error } = await supabase.from("chapters").update(parsed.data).eq("id", chapterId);
  if (error) return { success: false, message: "Gagal memperbarui chapter." };

  revalidatePath("/admin/chapters");
  return { success: true, message: "Chapter berhasil diperbarui." };
}

export async function deleteChapterAction(chapterId: string): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("chapters").delete().eq("id", chapterId);
  if (error) return { success: false, message: "Gagal menghapus chapter." };

  revalidatePath("/admin/chapters");
  return { success: true, message: "Chapter berhasil dihapus." };
}
