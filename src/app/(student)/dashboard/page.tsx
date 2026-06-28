import { createClient } from "@/lib/supabase/server";
import { StudentStatsCards } from "@/components/dashboard/student-stats-cards";
import { ContinueLearningSection } from "@/components/dashboard/continue-learning-section";
import { RecentActivitySection } from "@/components/dashboard/recent-activity-section";
import {
  getStudentStats,
  getContinueLearning,
  getStreakDays,
  getRecentActivity,
} from "@/lib/actions/student.queries";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [stats, continueLearning, streakDays, activity] = await Promise.all([
    getStudentStats(user.id),
    getContinueLearning(user.id),
    getStreakDays(user.id),
    getRecentActivity(user.id),
  ]);

  return (
    <div className="space-y-8">
      <StudentStatsCards
        activeCourses={stats.activeCourses}
        totalHours={stats.totalHours}
        streakDays={streakDays}
        certificatesCount={stats.certificatesCount}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ContinueLearningSection items={continueLearning as any} />
        </div>
        <div>
          <RecentActivitySection items={activity as any} />
        </div>
      </div>
    </div>
  );
}
