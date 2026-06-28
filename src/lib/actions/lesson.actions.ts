"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { lessonSchema } from "@/lib/validations/chapter-lesson.schema";
import { extractYoutubeId } from "@/lib/youtube";

type ActionResult = { success: boolean; message: string };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return supabase;
}

export async function getChaptersForSelect(courseId?: string) {
  const supabase = await assertAdmin();
  let query = supabase.from("chapters").select("id, title, course_id").order("order_index");
  if (courseId) query = query.eq("course_id", courseId);
  const { data } = await query;
  return data ?? [];
}

export async function getLessonsByChapter(chapterId?: string) {
  const supabase = await assertAdmin();
  let query = supabase
    .from("lessons")
    .select("*, chapters(title), courses(title), lesson_videos(*)")
    .order("order_index");
  if (chapterId) query = query.eq("chapter_id", chapterId);
  const { data } = await query;
  return data ?? [];
}

export async function getLessonById(lessonId: string) {
  const supabase = await assertAdmin();
  const { data } = await supabase
    .from("lessons")
    .select("*, lesson_videos(*), vocabularies(*), grammars(*), downloads(*)")
    .eq("id", lessonId)
    .single();
  return data;
}

export async function createLessonAction(formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const raw = {
    chapter_id: formData.get("chapter_id") as string,
    course_id: formData.get("course_id") as string,
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    summary: (formData.get("summary") as string) ?? "",
    duration_minutes: formData.get("duration_minutes") as string,
    order_index: formData.get("order_index") as string,
    is_free_preview: formData.get("is_free_preview") === "on",
    youtube_url: (formData.get("youtube_url") as string) ?? "",
  };

  const parsed = lessonSchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const { youtube_url, ...lessonData } = parsed.data;

  const { data: lesson, error } = await supabase.from("lessons").insert(lessonData).select().single();
  if (error) return { success: false, message: "Gagal membuat lesson. Pastikan slug unik dalam satu kelas." };

  if (youtube_url) {
    const youtubeId = extractYoutubeId(youtube_url);
    if (youtubeId) {
      await supabase.from("lesson_videos").insert({
        lesson_id: lesson.id,
        youtube_url,
        youtube_id: youtubeId,
        order_index: 1,
      });
    }
  }

  revalidatePath("/admin/lessons");
  return { success: true, message: "Lesson berhasil dibuat." };
}

export async function updateLessonAction(lessonId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const raw = {
    chapter_id: formData.get("chapter_id") as string,
    course_id: formData.get("course_id") as string,
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    summary: (formData.get("summary") as string) ?? "",
    duration_minutes: formData.get("duration_minutes") as string,
    order_index: formData.get("order_index") as string,
    is_free_preview: formData.get("is_free_preview") === "on",
    youtube_url: (formData.get("youtube_url") as string) ?? "",
  };

  const parsed = lessonSchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const { youtube_url, ...lessonData } = parsed.data;

  const { error } = await supabase.from("lessons").update(lessonData).eq("id", lessonId);
  if (error) return { success: false, message: "Gagal memperbarui lesson." };

  if (youtube_url) {
    const youtubeId = extractYoutubeId(youtube_url);
    if (youtubeId) {
      await supabase.from("lesson_videos").delete().eq("lesson_id", lessonId);
      await supabase.from("lesson_videos").insert({
        lesson_id: lessonId,
        youtube_url,
        youtube_id: youtubeId,
        order_index: 1,
      });
    }
  }

  revalidatePath("/admin/lessons");
  return { success: true, message: "Lesson berhasil diperbarui." };
}

export async function deleteLessonAction(lessonId: string): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
  if (error) return { success: false, message: "Gagal menghapus lesson." };

  revalidatePath("/admin/lessons");
  return { success: true, message: "Lesson berhasil dihapus." };
}

export async function uploadDocumentAction(file: File, type: "pdf" | "audio"): Promise<ActionResult & { url?: string }> {
  const supabase = await assertAdmin();
  const bucket = type === "pdf" ? "documents" : "audios";
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) return { success: false, message: "Gagal mengupload file." };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { success: true, message: "File berhasil diupload.", url: data.publicUrl };
}

export async function addDownloadAction(formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const lessonId = formData.get("lesson_id") as string;
  const title = formData.get("title") as string;
  const fileUrl = formData.get("file_url") as string;
  const type = formData.get("type") as string;

  if (!lessonId || !title || !fileUrl) {
    return { success: false, message: "Data download tidak lengkap." };
  }

  const { error } = await supabase.from("downloads").insert({
    lesson_id: lessonId,
    title,
    file_url: fileUrl,
    type,
  });

  if (error) return { success: false, message: "Gagal menambahkan file download." };

  revalidatePath("/admin/lessons");
  return { success: true, message: "File download berhasil ditambahkan." };
}

export async function addAudioAction(formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const lessonId = formData.get("lesson_id") as string;
  const title = formData.get("title") as string;
  const audioUrl = formData.get("audio_url") as string;

  if (!lessonId || !title || !audioUrl) {
    return { success: false, message: "Data audio tidak lengkap." };
  }

  const { error } = await supabase.from("lesson_audios").insert({
    lesson_id: lessonId,
    title,
    audio_url: audioUrl,
  });

  if (error) return { success: false, message: "Gagal menambahkan audio." };

  revalidatePath("/admin/lessons");
  return { success: true, message: "Audio berhasil ditambahkan." };
}
