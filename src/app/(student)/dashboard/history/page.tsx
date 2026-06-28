import { createClient } from "@/lib/supabase/server";
import { RecentActivitySection } from "@/components/dashboard/recent-activity-section";
import { getRecentActivity, getStudentStats, getStreakDays } from "@/lib/actions/student.queries";
import { StudentStatsCards } from "@/components/dashboard/student-stats-cards";

export const metadata = { title: "Riwayat Belajar" };

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [activity, stats, streakDays] = await Promise.all([
    getRecentActivity(user.id),
    getStudentStats(user.id),
    getStreakDays(user.id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Riwayat & Statistik Belajar</h1>
        <p className="text-sm text-muted-foreground">Pantau perkembangan belajar bahasa Jepang Anda</p>
      </div>

      <StudentStatsCards
        activeCourses={stats.activeCourses}
        totalHours={stats.totalHours}
        streakDays={streakDays}
        certificatesCount={stats.certificatesCount}
      />

      <RecentActivitySection items={activity as any} />
    </div>
  );
}
