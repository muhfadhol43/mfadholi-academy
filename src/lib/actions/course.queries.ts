import { createClient } from "@/lib/supabase/server";
import type { CourseLevel } from "@/types/database.types";

export async function getFeaturedCourses(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("total_students", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

export async function getLatestCourses(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

export async function getCoursesByLevel(level: CourseLevel, limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .eq("level", level)
    .order("rating", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

export async function getCourseCurriculum(courseId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("chapters")
    .select("*, lessons(id, title, slug, duration_minutes, order_index, is_free_preview)")
    .eq("course_id", courseId)
    .order("order_index");

  return (data ?? []).map((chapter) => ({
    ...chapter,
    lessons: (chapter.lessons ?? []).sort((a: any, b: any) => a.order_index - b.order_index),
  }));
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function getAllCourses(params?: {
  search?: string;
  level?: CourseLevel;
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createClient();
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("courses").select("*", { count: "exact" }).eq("status", "published");

  if (params?.search) {
    query = query.ilike("title", `%${params.search}%`);
  }
  if (params?.level) {
    query = query.eq("level", params.level);
  }

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);

  if (error) throw new Error(error.message);
  return { courses: data, total: count ?? 0, page, pageSize };
}
