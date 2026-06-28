"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { grammarSchema } from "@/lib/validations/vocab-grammar.schema";

type ActionResult = { success: boolean; message: string };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return supabase;
}

export async function getGrammarsByLesson(lessonId?: string) {
  const supabase = await assertAdmin();
  let query = supabase.from("grammars").select("*, lessons(title)").order("order_index");
  if (lessonId) query = query.eq("lesson_id", lessonId);
  const { data } = await query;
  return data ?? [];
}

export async function createGrammarAction(formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const raw = {
    lesson_id: formData.get("lesson_id") as string,
    pattern: formData.get("pattern") as string,
    explanation: formData.get("explanation") as string,
    example_sentence_jp: formData.get("example_sentence_jp") as string,
    example_sentence_id: formData.get("example_sentence_id") as string,
    order_index: formData.get("order_index") as string,
  };

  const parsed = grammarSchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const { error } = await supabase.from("grammars").insert(parsed.data);
  if (error) return { success: false, message: "Gagal menambahkan grammar." };

  revalidatePath("/admin/grammars");
  return { success: true, message: "Grammar berhasil ditambahkan." };
}

export async function updateGrammarAction(id: string, formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const raw = {
    lesson_id: formData.get("lesson_id") as string,
    pattern: formData.get("pattern") as string,
    explanation: formData.get("explanation") as string,
    example_sentence_jp: formData.get("example_sentence_jp") as string,
    example_sentence_id: formData.get("example_sentence_id") as string,
    order_index: formData.get("order_index") as string,
  };

  const parsed = grammarSchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const { error } = await supabase.from("grammars").update(parsed.data).eq("id", id);
  if (error) return { success: false, message: "Gagal memperbarui grammar." };

  revalidatePath("/admin/grammars");
  return { success: true, message: "Grammar berhasil diperbarui." };
}

export async function deleteGrammarAction(id: string): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("grammars").delete().eq("id", id);
  if (error) return { success: false, message: "Gagal menghapus grammar." };

  revalidatePath("/admin/grammars");
  return { success: true, message: "Grammar berhasil dihapus." };
}
