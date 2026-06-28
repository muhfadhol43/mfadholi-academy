import { BookOpen, Clock, Flame, Award } from "lucide-react";

interface StatsCardsProps {
  activeCourses: number;
  totalHours: number;
  streakDays: number;
  certificatesCount: number;
}

export function StudentStatsCards({ activeCourses, totalHours, streakDays, certificatesCount }: StatsCardsProps) {
  const stats = [
    { label: "Kelas Aktif", value: activeCourses, icon: BookOpen, color: "text-indigo-600 bg-indigo-100" },
    { label: "Total Jam Belajar", value: `${totalHours} Jam`, icon: Clock, color: "text-emerald-600 bg-emerald-100" },
    { label: "Streak", value: `${streakDays} Hari`, icon: Flame, color: "text-orange-600 bg-orange-100" },
    { label: "Sertifikat", value: certificatesCount, icon: Award, color: "text-sakura-600 bg-sakura-100" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
            <stat.icon className="h-5 w-5" />
          </span>
          <p className="mt-3 text-2xl font-bold">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
