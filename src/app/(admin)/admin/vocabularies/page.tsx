import { Type } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { VocabularyFormDialog } from "@/components/admin/vocabulary-form-dialog";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { getLessonsForSelect } from "@/lib/actions/vocabulary.actions";
import { getVocabulariesByLesson, deleteVocabularyAction } from "@/lib/actions/vocabulary.actions";

export const metadata = { title: "Kelola Kosakata" };

export default async function AdminVocabulariesPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson_id?: string }>;
}) {
  const { lesson_id } = await searchParams;
  const [lessons, vocabularies] = await Promise.all([getLessonsForSelect(), getVocabulariesByLesson(lesson_id)]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Kosakata</h1>
          <p className="text-sm text-muted-foreground">Total {vocabularies.length} kosakata</p>
        </div>
        <VocabularyFormDialog lessons={lessons as any} defaultLessonId={lesson_id} />
      </div>

      {vocabularies.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">Kanji</th>
                <th className="px-4 py-3">Hiragana</th>
                <th className="px-4 py-3">Romaji</th>
                <th className="px-4 py-3">Arti</th>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {vocabularies.map((v: any) => (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-accent/5">
                  <td className="px-4 py-3 font-japanese text-lg">{v.kanji || "-"}</td>
                  <td className="px-4 py-3">{v.hiragana}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.romaji || "-"}</td>
                  <td className="px-4 py-3">{v.meaning_id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.lessons?.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <VocabularyFormDialog lessons={lessons as any} vocabulary={v} />
                      <DeleteEntityButton
                        entityLabel="Kosakata"
                        entityName={v.hiragana}
                        onDelete={deleteVocabularyAction.bind(null, v.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Type} title="Belum ada kosakata" description="Tambahkan kosakata pertama untuk lesson Anda." />
      )}
    </div>
  );
}
