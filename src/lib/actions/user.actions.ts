"use server";

import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

type ActionResult = { success: boolean; message: string };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return supabase;
}

export async function getUserList(params?: { search?: string; page?: number; pageSize?: number }) {
  const supabase = await assertAdmin();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("profiles").select("*", { count: "exact" });
  if (params?.search) {
    query = query.ilike("full_name", `%${params.search}%`);
  }

  const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, to);
  if (error) throw new Error(error.message);

  return { users: data, total: count ?? 0, page, pageSize };
}

export async function updateUserRoleAction(userId: string, role: "admin" | "student"): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
  if (error) return { success: false, message: "Gagal mengubah role user." };

  revalidatePath("/admin/users");
  return { success: true, message: "Role user berhasil diperbarui." };
}

export async function toggleUserActiveAction(userId: string, isActive: boolean): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", userId);
  if (error) return { success: false, message: "Gagal memperbarui status user." };

  revalidatePath("/admin/users");
  return { success: true, message: `User berhasil ${isActive ? "diaktifkan" : "dinonaktifkan"}.` };
}

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  await assertAdmin();
  const adminClient = await createAdminClient();

  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) return { success: false, message: "Gagal menghapus user." };

  revalidatePath("/admin/users");
  return { success: true, message: "User berhasil dihapus." };
}
