import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/database.types";

interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({ course, className }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className={cn(
        "group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-100 to-sakura-100 text-3xl font-bold text-primary/40 dark:from-indigo-950 dark:to-sakura-950">
            日本語
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
          {course.level}
        </span>

        {course.is_premium && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white">
            <Lock className="h-3 w-3" /> Premium
          </span>
        )}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug">{course.title}</h3>
        <p className="text-sm text-muted-foreground">Sensei {course.sensei_name}</p>

        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{course.rating.toFixed(1)}</span>
            <span>({course.total_students} Siswa)</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration_minutes} Menit</span>
          </div>
        </div>

        <div className="pt-1">
          {course.is_premium ? (
            <span className="font-bold text-primary">Rp {course.price.toLocaleString("id-ID")}</span>
          ) : (
            <span className="font-bold text-emerald-600">Gratis</span>
          )}
        </div>
      </div>
    </Link>
  );
}
