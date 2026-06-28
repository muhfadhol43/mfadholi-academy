import { Layers } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ChapterFormDialog } from "@/components/admin/chapter-form-dialog";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { getAllCoursesForSelect, getChaptersByCourse, deleteChapterAction } from "@/lib/actions/chapter.actions";

export const metadata = { title: "Kelola Chapter" };

export default async function AdminChaptersPage({
  searchParams,
}: {
  searchParams: Promise<{ course_id?: string }>;
}) {
  const { course_id } = await searchParams;
  const [courses, chapters] = await Promise.all([getAllCoursesForSelect(), getChaptersByCourse(course_id)]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Chapter</h1>
          <p className="text-sm text-muted-foreground">Total {chapters.length} chapter</p>
        </div>
        <ChapterFormDialog courses={courses} defaultCourseId={course_id} />
      </div>

      {chapters.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">Urutan</th>
                <th className="px-4 py-3">Judul Chapter</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter: any) => (
                <tr key={chapter.id} className="border-b border-border last:border-0 hover:bg-accent/5">
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{chapter.order_index}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">{chapter.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{chapter.courses?.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <ChapterFormDialog courses={courses} chapter={chapter} />
                      <DeleteEntityButton
                        entityLabel="Chapter"
                        entityName={chapter.title}
                        onDelete={deleteChapterAction.bind(null, chapter.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Layers} title="Belum ada chapter" description="Tambahkan chapter pertama untuk kelas Anda." />
      )}
    </div>
  );
}
