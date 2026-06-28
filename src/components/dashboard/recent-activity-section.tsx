import Link from "next/link";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface ActivityItem {
  id: string;
  is_completed: boolean;
  updated_at: string;
  lessons: { title: string; slug: string; courses: { title: string; slug: string } | null } | null;
}

export function RecentActivitySection({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Belum ada aktivitas terbaru.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Aktivitas Terbaru</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/courses/${item.lessons?.courses?.slug}/lessons/${item.lessons?.slug}`}
            className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent/5"
          >
            <span className={`mt-0.5 rounded-full p-1.5 ${item.is_completed ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"}`}>
              {item.is_completed ? <CheckCircle2 className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
            </span>
            <div>
              <p className="text-sm font-medium">
                {item.is_completed ? "Menyelesaikan" : "Belajar"} {item.lessons?.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.lessons?.courses?.title} &middot;{" "}
                {formatDistanceToNow(new Date(item.updated_at), { addSuffix: true, locale: idLocale })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
