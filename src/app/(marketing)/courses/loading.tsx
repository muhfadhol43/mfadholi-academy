import { CourseCardSkeleton } from "@/components/course/course-card-skeleton";

export default function CoursesLoading() {
  return (
    <div className="container py-10">
      <div className="mb-8 h-10 w-64 animate-pulse rounded-lg bg-muted" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
