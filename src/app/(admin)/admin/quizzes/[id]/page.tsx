import { notFound } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { QuestionFormDialog } from "@/components/admin/question-form-dialog";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { getQuizWithQuestions, deleteQuestionAction } from "@/lib/actions/quiz.actions";

export const metadata = { title: "Detail Quiz" };

export default async function QuizDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quiz = await getQuizWithQuestions(id);
  if (!quiz) notFound();

  const nextOrderIndex = (quiz.quiz_questions?.length ?? 0) + 1;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            Lesson: {quiz.lessons?.title} &middot; Nilai Lulus: {quiz.passing_score} &middot; Waktu: {quiz.time_limit_minutes} Menit
          </p>
        </div>
        <QuestionFormDialog quizId={quiz.id} nextOrderIndex={nextOrderIndex} />
      </div>

      <div className="space-y-4">
        {(quiz.quiz_questions ?? [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((q: any, idx: number) => (
            <div key={q.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-3 flex items-start justify-between">
                <p className="font-medium">
                  {idx + 1}. {q.question}
                </p>
                <DeleteEntityButton
                  entityLabel="Pertanyaan"
                  entityName={`pertanyaan #${idx + 1}`}
                  onDelete={deleteQuestionAction.bind(null, q.id)}
                />
              </div>
              <div className="space-y-1.5">
                {(q.quiz_answers ?? []).map((a: any) => (
                  <div key={a.id} className="flex items-center gap-2 text-sm">
                    {a.is_correct ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground/40" />
                    )}
                    <span className={a.is_correct ? "font-medium text-emerald-700" : "text-muted-foreground"}>
                      {a.answer_text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {(quiz.quiz_questions ?? []).length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            Belum ada pertanyaan. Klik &quot;Tambah Pertanyaan&quot; untuk mulai membuat soal quiz.
          </div>
        )}
      </div>
    </div>
  );
}
