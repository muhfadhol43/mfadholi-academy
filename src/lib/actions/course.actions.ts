"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { courseSchema } from "@/lib/validations/course.schema";

type ActionResult = { success: boolean; message: string };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");

  return supabase;
}

export async function createCourseAction(formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();

  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    level: formData.get("level") as string,
    sensei_name: formData.get("sensei_name") as string,
    duration_minutes: formData.get("duration_minutes") as string,
    price: formData.get("price") as string,
    is_premium: formData.get("is_premium") === "on",
    status: formData.get("status") as string,
    thumbnail_url: (formData.get("thumbnail_url") as string) || null,
  };

  const parsed = courseSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("courses").insert({
    ...parsed.data,
    created_by: user?.id,
  });

  if (error) {
    return {
      success: false,
      message: error.message.includes("duplicate") ? "Slug sudah digunakan." : "Gagal membuat kelas.",
    };
  }

  revalidatePath("/admin/courses");
  return { success: true, message: "Kelas berhasil dibuat." };
}

export async function updateCourseAction(courseId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();

  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    level: formData.get("level") as string,
    sensei_name: formData.get("sensei_name") as string,
    duration_minutes: formData.get("duration_minutes") as string,
    price: formData.get("price") as string,
    is_premium: formData.get("is_premium") === "on",
    status: formData.get("status") as string,
    thumbnail_url: (formData.get("thumbnail_url") as string) || null,
  };

  const parsed = courseSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase.from("courses").update(parsed.data).eq("id", courseId);

  if (error) {
    return { success: false, message: "Gagal memperbarui kelas." };
  }

  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);
  return { success: true, message: "Kelas berhasil diperbarui." };
}

export async function deleteCourseAction(courseId: string): Promise<ActionResult> {
  const supabase = await assertAdmin();

  const { error } = await supabase.from("courses").delete().eq("id", courseId);

  if (error) {
    return { success: false, message: "Gagal menghapus kelas." };
  }

  revalidatePath("/admin/courses");
  return { success: true, message: "Kelas berhasil dihapus." };
}

export async function uploadThumbnailAction(file: File): Promise<ActionResult & { url?: string }> {
  const supabase = await assertAdmin();

  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("thumbnails").upload(path, file);
  if (error) {
    return { success: false, message: "Gagal mengupload thumbnail." };
  }

  const { data } = supabase.storage.from("thumbnails").getPublicUrl(path);
  return { success: true, message: "Thumbnail berhasil diupload.", url: data.publicUrl };
}

export async function getAdminCourseList(params?: { search?: string; page?: number; pageSize?: number }) {
  const supabase = await assertAdmin();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("courses").select("*", { count: "exact" });
  if (params?.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, to);
  if (error) throw new Error(error.message);

  return { courses: data, total: count ?? 0, page, pageSize };
}

export async function getAdminCourseById(courseId: string) {
  const supabase = await assertAdmin();
  const { data } = await supabase.from("courses").select("*").eq("id", courseId).single();
  return data;
}
