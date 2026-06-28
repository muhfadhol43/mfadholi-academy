import { BookText } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GrammarFormDialog } from "@/components/admin/grammar-form-dialog";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { getLessonsForSelect } from "@/lib/actions/vocabulary.actions";
import { getGrammarsByLesson, deleteGrammarAction } from "@/lib/actions/grammar.actions";

export const metadata = { title: "Kelola Grammar" };

export default async function AdminGrammarsPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson_id?: string }>;
}) {
  const { lesson_id } = await searchParams;
  const [lessons, grammars] = await Promise.all([getLessonsForSelect(), getGrammarsByLesson(lesson_id)]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Grammar</h1>
          <p className="text-sm text-muted-foreground">Total {grammars.length} pola tata bahasa</p>
        </div>
        <GrammarFormDialog lessons={lessons as any} defaultLessonId={lesson_id} />
      </div>

      {grammars.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {grammars.map((g: any) => (
            <div key={g.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-2 flex items-start justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{g.pattern}</span>
                <div className="flex gap-1">
                  <GrammarFormDialog lessons={lessons as any} grammar={g} />
                  <DeleteEntityButton entityLabel="Grammar" entityName={g.pattern} onDelete={deleteGrammarAction.bind(null, g.id)} />
                </div>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">{g.explanation}</p>
              <div className="space-y-1 rounded-lg bg-muted/40 p-3 text-sm">
                <p className="font-japanese">{g.example_sentence_jp}</p>
                <p className="text-xs text-muted-foreground">{g.example_sentence_id}</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Lesson: {g.lessons?.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={BookText} title="Belum ada grammar" description="Tambahkan pola tata bahasa pertama untuk lesson Anda." />
      )}
    </div>
  );
}
