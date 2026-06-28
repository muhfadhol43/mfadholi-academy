import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteCourseButton } from "@/components/admin/delete-course-button";
import { getAdminCourseList } from "@/lib/actions/course.actions";

export const metadata = { title: "Kelola Kelas" };

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { courses, total, pageSize } = await getAdminCourseList({ search: params.search, page });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Kelas</h1>
          <p className="text-sm text-muted-foreground">Total {total} kelas terdaftar</p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/admin/courses/new">
            <Plus className="h-4 w-4" /> Tambah Kelas
          </Link>
        </Button>
      </div>

      <SearchInput placeholder="Cari judul kelas..." />

      {courses && courses.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Sensei</th>
                <th className="px-4 py-3">Siswa</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-border last:border-0 hover:bg-accent/5">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {course.thumbnail_url ? (
                        <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <span className="line-clamp-1 font-medium">{course.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{course.level}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{course.sensei_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{course.total_students.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={course.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/courses/${course.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteCourseButton courseId={course.id} courseTitle={course.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Belum ada kelas"
          description="Mulai dengan menambahkan kelas pertama Anda."
          actionLabel="Tambah Kelas"
          actionHref="/admin/courses/new"
        />
      )}

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
