import Image from "next/image";
import { MessageSquare, BookOpen } from "lucide-react";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { RegistrationChart } from "@/components/admin/registration-chart";
import { LevelDistributionChart } from "@/components/admin/level-distribution-chart";
import { AdminQuickActions } from "@/components/admin/admin-quick-actions";
import {
  getAdminOverviewStats,
  getRegistrationStats,
  getPopularCourses,
  getLevelDistribution,
  getRecentComments,
  getRecentAdminActivity,
} from "@/lib/actions/admin.queries";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const metadata = { title: "Dashboard Admin" };

export default async function AdminDashboardPage() {
  const [stats, registrationData, popularCourses, levelDistribution, comments, activity] = await Promise.all([
    getAdminOverviewStats(),
    getRegistrationStats(7),
    getPopularCourses(5),
    getLevelDistribution(),
    getRecentComments(5),
    getRecentAdminActivity(6),
  ]);

  return (
    <div className="space-y-6">
      <AdminStatsCards {...stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Statistik Pendaftaran</h3>
            <span className="text-xs text-muted-foreground">7 Hari Terakhir</span>
          </div>
          <RegistrationChart data={registrationData} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-2 text-sm font-semibold">Persentase Level</h3>
          <LevelDistributionChart data={levelDistribution} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold">Kelas Terpopuler</h3>
          <div className="space-y-3">
            {popularCourses.map((course, i) => (
              <div key={course.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {course.thumbnail_url ? (
                    <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-medium">{course.title}</p>
                  <p className="text-xs text-muted-foreground">{course.total_students.toLocaleString("id-ID")} Siswa</p>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{course.level}</span>
              </div>
            ))}
          </div>
        </div>

        <AdminQuickActions />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Komentar Terbaru</h3>
          <div className="space-y-3">
            {comments.length === 0 && <p className="text-sm text-muted-foreground">Belum ada komentar.</p>}
            {comments.map((c: any) => (
              <div key={c.id} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sakura-500 text-xs font-bold text-white">
                  {c.profiles?.full_name?.charAt(0) ?? "?"}
                </span>
                <div>
                  <p className="text-sm font-medium">{c.profiles?.full_name ?? "Pengguna"}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{c.content}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: idLocale })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            {activity.map((a) => (
              <div key={a.id} className="flex items-center gap-3 text-sm">
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                <p className="flex-1">
                  Kelas baru ditambahkan: <span className="font-medium">{a.title}</span>
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(a.created_at), { addSuffix: true, locale: idLocale })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
