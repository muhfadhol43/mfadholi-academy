import { createClient } from "@/lib/supabase/server";

export async function getAdminOverviewStats() {
  const supabase = await createClient();

  const [{ count: totalUsers }, { count: totalCourses }, { count: totalLessons }, { data: videos }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("courses").select("*", { count: "exact", head: true }),
      supabase.from("lessons").select("*", { count: "exact", head: true }),
      supabase.from("lesson_videos").select("id"),
    ]);

  return {
    totalUsers: totalUsers ?? 0,
    totalCourses: totalCourses ?? 0,
    totalLessons: totalLessons ?? 0,
    totalVideos: videos?.length ?? 0,
  };
}

export async function getRegistrationStats(days = 7) {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", since.toISOString());

  const buckets: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i + 1);
    const key = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    buckets[key] = 0;
  }

  (data ?? []).forEach((row) => {
    const key = new Date(row.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    if (key in buckets) buckets[key] += 1;
  });

  return Object.entries(buckets).map(([date, total]) => ({ date, total }));
}

export async function getPopularCourses(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, level, total_students, thumbnail_url")
    .order("total_students", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getLevelDistribution() {
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("level, total_students");

  const totals: Record<string, number> = { N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 };
  (data ?? []).forEach((c) => {
    totals[c.level] = (totals[c.level] ?? 0) + (c.total_students ?? 0);
  });

  const sum = Object.values(totals).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(totals)
    .filter(([, value]) => value > 0)
    .map(([level, value]) => ({ level, percent: Math.round((value / sum) * 100) }));
}

export async function getRecentComments(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("comments")
    .select("id, content, created_at, profiles(full_name, avatar_url), lessons(title)")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export async function getRecentAdminActivity(limit = 6) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
