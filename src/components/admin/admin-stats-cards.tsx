import { Users, BookOpen, FileText, Video } from "lucide-react";

interface AdminStatsCardsProps {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalVideos: number;
}

export function AdminStatsCards({ totalUsers, totalCourses, totalLessons, totalVideos }: AdminStatsCardsProps) {
  const stats = [
    { label: "Total User", value: totalUsers, icon: Users, color: "bg-indigo-100 text-indigo-600" },
    { label: "Total Kelas", value: totalCourses, icon: BookOpen, color: "bg-emerald-100 text-emerald-600" },
    { label: "Total Lesson", value: totalLessons, icon: FileText, color: "bg-amber-100 text-amber-600" },
    { label: "Total Video", value: totalVideos, icon: Video, color: "bg-sakura-100 text-sakura-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
            <stat.icon className="h-5 w-5" />
          </span>
          <p className="mt-3 text-2xl font-bold">{stat.value.toLocaleString("id-ID")}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
