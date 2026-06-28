import Link from "next/link";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import type { Course } from "@/types/database.types";

interface MyCourseItem {
  id: string;
  progress_percent: number;
  is_completed: boolean;
  courses: Course | null;
}

export function MyCoursesGrid({ items }: { items: MyCourseItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Anda belum terdaftar di kelas apapun.{" "}
        <Link href="/courses" className="font-medium text-primary hover:underline">
          Jelajahi kelas sekarang.
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Kelas Saya</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/courses/${item.courses?.slug}`}
            className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              {item.courses?.thumbnail_url ? (
                <Image
                  src={item.courses.thumbnail_url}
                  alt={item.courses.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-100 to-sakura-100 text-2xl font-bold text-primary/40">
                  日本語
                </div>
              )}
              <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                {item.courses?.level}
              </span>
            </div>
            <div className="space-y-2 p-3">
              <p className="line-clamp-1 text-xs font-semibold">{item.courses?.title}</p>
              <Progress value={item.progress_percent} className="h-1.5" />
              <p className="text-[10px] text-muted-foreground">{item.progress_percent}% selesai</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
