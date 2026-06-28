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

export async function getAllCertificates(params?: { page?: number; pageSize?: number }) {
  const supabase = await assertAdmin();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from("certificates")
    .select("*, profiles(full_name, avatar_url), courses(title, level)", { count: "exact" })
    .order("issued_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  return { certificates: data, total: count ?? 0, page, pageSize };
}

export async function getEligibleStudentsForCertificate() {
  const supabase = await assertAdmin();
  const { data } = await supabase
    .from("course_progress")
    .select("user_id, course_id, profiles(full_name), courses(title)")
    .eq("is_completed", true);

  return data ?? [];
}

function generateCertificateNumber() {
  const date = new Date();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `MFA-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}-${random}`;
}

export async function issueCertificateAction(userId: string, courseId: string): Promise<ActionResult> {
  const supabase = await assertAdmin();

  const { error } = await supabase.from("certificates").insert({
    user_id: userId,
    course_id: courseId,
    certificate_number: generateCertificateNumber(),
  });

  if (error) {
    return {
      success: false,
      message: error.message.includes("duplicate") ? "Sertifikat untuk siswa ini sudah pernah diterbitkan." : "Gagal menerbitkan sertifikat.",
    };
  }

  revalidatePath("/admin/certificates");
  return { success: true, message: "Sertifikat berhasil diterbitkan." };
}

export async function deleteCertificateAction(certificateId: string): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("certificates").delete().eq("id", certificateId);
  if (error) return { success: false, message: "Gagal menghapus sertifikat." };

  revalidatePath("/admin/certificates");
  return { success: true, message: "Sertifikat berhasil dihapus." };
}
