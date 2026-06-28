import { BookOpen } from "lucide-react";
import { CourseCard } from "@/components/course/course-card";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { getAllCourses } from "@/lib/actions/course.queries";
import type { CourseLevel } from "@/types/database.types";

export const metadata = { title: "Semua Kelas" };

const levels: CourseLevel[] = ["N5", "N4", "N3", "N2", "N1"];

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; level?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const level = params.level as CourseLevel | undefined;

  const { courses, total, pageSize } = await getAllCourses({ search: params.search, level, page });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Semua Kelas</h1>
        <p className="mt-2 text-muted-foreground">Temukan kelas bahasa Jepang yang sesuai dengan levelmu</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <SearchInput placeholder="Cari judul kelas..." />
        <div className="flex flex-wrap gap-2">
          <a
            href="/courses"
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${!level ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent/10"}`}
          >
            Semua
          </a>
          {levels.map((l) => (
            <a
              key={l}
              href={`/courses?level=${l}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${level === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent/10"}`}
            >
              {l}
            </a>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">Menampilkan {total} kelas</p>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState icon={BookOpen} title="Kelas tidak ditemukan" description="Coba ubah kata kunci pencarian atau filter level." />
      )}

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
