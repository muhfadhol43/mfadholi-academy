"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return supabase;
}

export async function getAllComments(params?: { search?: string; page?: number; pageSize?: number }) {
  const supabase = await assertAdmin();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("comments")
    .select("*, profiles(full_name, avatar_url), lessons(title, courses(title))", { count: "exact" });

  if (params?.search) {
    query = query.ilike("content", `%${params.search}%`);
  }

  const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, to);
  if (error) throw new Error(error.message);

  return { comments: data, total: count ?? 0, page, pageSize };
}

export async function deleteCommentAction(commentId: string): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) return { success: false, message: "Gagal menghapus komentar." };

  revalidatePath("/admin/comments");
  return { success: true, message: "Komentar berhasil dihapus." };
}
