import { createClient } from "@/lib/supabase/server";

export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return profile;
}

export async function getStudentStats(userId: string) {
  const supabase = await createClient();

  const [{ data: enrollments }, { data: completedLessons }, { data: certificates }] = await Promise.all([
    supabase.from("course_progress").select("*", { count: "exact" }).eq("user_id", userId),
    supabase.from("lesson_progress").select("watched_seconds").eq("user_id", userId).eq("is_completed", true),
    supabase.from("certificates").select("id", { count: "exact" }).eq("user_id", userId),
  ]);

  const totalSeconds = (completedLessons ?? []).reduce((acc, l) => acc + (l.watched_seconds ?? 0), 0);

  return {
    activeCourses: (enrollments ?? []).filter((e) => !e.is_completed).length,
    totalHours: Math.round((totalSeconds / 3600) * 10) / 10,
    certificatesCount: certificates?.length ?? 0,
  };
}

export async function getContinueLearning(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("course_progress")
    .select("*, courses(*), lessons:last_lesson_id(title, slug, chapter_id, chapters(title))")
    .eq("user_id", userId)
    .eq("is_completed", false)
    .order("updated_at", { ascending: false })
    .limit(3);

  return data ?? [];
}

export async function getMyEnrolledCourses(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("course_progress")
    .select("*, courses(*)")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return data ?? [];
}

export async function getMyBookmarks(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookmarks")
    .select("*, lessons(*, courses(title, slug, thumbnail_url))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getMyCertificates(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select("*, courses(title, level, thumbnail_url)")
    .eq("user_id", userId)
    .order("issued_at", { ascending: false });

  return data ?? [];
}

export async function getStreakDays(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_progress")
    .select("updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (!data || data.length === 0) return 0;

  const dateSet = new Set(data.map((d) => new Date(d.updated_at).toDateString()));
  let streak = 0;
  const cursor = new Date();

  while (dateSet.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function getRecentActivity(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_progress")
    .select("*, lessons(title, slug, courses(title, slug))")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(6);

  return data ?? [];
}
