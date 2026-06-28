import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseCard } from "@/components/course/course-card";
import { getFeaturedCourses, getLatestCourses } from "@/lib/actions/course.queries";

export async function FeaturedCourseSection() {
  const courses = await getFeaturedCourses(4);

  if (courses.length === 0) return null;

  return (
    <section className="container py-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Kelas Terpopuler</h2>
          <p className="mt-2 text-muted-foreground">Kelas favorit dengan siswa terbanyak</p>
        </div>
        <Link href="/courses" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex">
          Lihat Semua <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}

export async function LatestCourseSection() {
  const courses = await getLatestCourses(4);

  if (courses.length === 0) return null;

  return (
    <section className="container py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Kelas Terbaru</h2>
          <p className="mt-2 text-muted-foreground">Kelas terbaru yang siap membantumu belajar</p>
        </div>
        <Link href="/courses" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex">
          Lihat Semua <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
