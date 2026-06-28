"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { vocabularySchema } from "@/lib/validations/vocab-grammar.schema";

type ActionResult = { success: boolean; message: string };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return supabase;
}

export async function getLessonsForSelect() {
  const supabase = await assertAdmin();
  const { data } = await supabase.from("lessons").select("id, title, courses(title)").order("title");
  return data ?? [];
}

export async function getVocabulariesByLesson(lessonId?: string) {
  const supabase = await assertAdmin();
  let query = supabase.from("vocabularies").select("*, lessons(title)").order("order_index");
  if (lessonId) query = query.eq("lesson_id", lessonId);
  const { data } = await query;
  return data ?? [];
}

export async function createVocabularyAction(formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const raw = {
    lesson_id: formData.get("lesson_id") as string,
    kanji: (formData.get("kanji") as string) ?? "",
    hiragana: formData.get("hiragana") as string,
    romaji: (formData.get("romaji") as string) ?? "",
    meaning_id: formData.get("meaning_id") as string,
    order_index: formData.get("order_index") as string,
  };

  const parsed = vocabularySchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const { error } = await supabase.from("vocabularies").insert(parsed.data);
  if (error) return { success: false, message: "Gagal menambahkan kosakata." };

  revalidatePath("/admin/vocabularies");
  return { success: true, message: "Kosakata berhasil ditambahkan." };
}

export async function updateVocabularyAction(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const raw = {
    lesson_id: formData.get("lesson_id") as string,
    kanji: (formData.get("kanji") as string) ?? "",
    hiragana: formData.get("hiragana") as string,
    romaji: (formData.get("romaji") as string) ?? "",
    meaning_id: formData.get("meaning_id") as string,
    order_index: formData.get("order_index") as string,
  };

  const parsed = vocabularySchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const { error } = await supabase.from("vocabularies").update(parsed.data).eq("id", id);
  if (error) return { success: false, message: "Gagal memperbarui kosakata." };

  revalidatePath("/admin/vocabularies");
  return { success: true, message: "Kosakata berhasil diperbarui." };
}

export async function deleteVocabularyAction(id: string): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("vocabularies").delete().eq("id", id);
  if (error) return { success: false, message: "Gagal menghapus kosakata." };

  revalidatePath("/admin/vocabularies");
  return { success: true, message: "Kosakata berhasil dihapus." };
}
