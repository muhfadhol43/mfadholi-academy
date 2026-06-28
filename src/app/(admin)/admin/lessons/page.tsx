import Link from "next/link";
import { FileText, Type, BookText, HelpCircle, Download } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { LessonFormDialog } from "@/components/admin/lesson-form-dialog";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { getChaptersForSelect, getLessonsByChapter, deleteLessonAction } from "@/lib/actions/lesson.actions";

export const metadata = { title: "Kelola Lesson" };

export default async function AdminLessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ chapter_id?: string }>;
}) {
  const { chapter_id } = await searchParams;
  const [chapters, lessons] = await Promise.all([getChaptersForSelect(), getLessonsByChapter(chapter_id)]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Lesson</h1>
          <p className="text-sm text-muted-foreground">Total {lessons.length} lesson</p>
        </div>
        <LessonFormDialog chapters={chapters} />
      </div>

      {lessons.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">Urutan</th>
                <th className="px-4 py-3">Judul Lesson</th>
                <th className="px-4 py-3">Chapter</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Konten</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson: any) => (
                <tr key={lesson.id} className="border-b border-border last:border-0 hover:bg-accent/5">
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{lesson.order_index}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">{lesson.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lesson.chapters?.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lesson.courses?.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Link
                        href={`/admin/vocabularies?lesson_id=${lesson.id}`}
                        title="Kosakata"
                        className="rounded-md bg-rose-100 p-1.5 text-rose-600 hover:bg-rose-200"
                      >
                        <Type className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/grammars?lesson_id=${lesson.id}`}
                        title="Grammar"
                        className="rounded-md bg-indigo-100 p-1.5 text-indigo-600 hover:bg-indigo-200"
                      >
                        <BookText className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/quizzes?lesson_id=${lesson.id}`}
                        title="Quiz"
                        className="rounded-md bg-amber-100 p-1.5 text-amber-600 hover:bg-amber-200"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/lessons/${lesson.id}/downloads`}
                        title="Download"
                        className="rounded-md bg-emerald-100 p-1.5 text-emerald-600 hover:bg-emerald-200"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <LessonFormDialog chapters={chapters} lesson={lesson} />
                      <DeleteEntityButton
                        entityLabel="Lesson"
                        entityName={lesson.title}
                        onDelete={deleteLessonAction.bind(null, lesson.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={FileText} title="Belum ada lesson" description="Tambahkan lesson pertama untuk chapter Anda." />
      )}
    </div>
  );
}
