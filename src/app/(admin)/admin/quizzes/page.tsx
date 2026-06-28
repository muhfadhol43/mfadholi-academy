import Link from "next/link";
import { HelpCircle, ListChecks } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { QuizFormDialog } from "@/components/admin/quiz-form-dialog";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { getLessonsForSelect } from "@/lib/actions/vocabulary.actions";
import { getQuizzesByLesson, deleteQuizAction } from "@/lib/actions/quiz.actions";

export const metadata = { title: "Kelola Quiz" };

export default async function AdminQuizzesPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson_id?: string }>;
}) {
  const { lesson_id } = await searchParams;
  const [lessons, quizzes] = await Promise.all([getLessonsForSelect(), getQuizzesByLesson(lesson_id)]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Quiz</h1>
          <p className="text-sm text-muted-foreground">Total {quizzes.length} quiz</p>
        </div>
        <QuizFormDialog lessons={lessons as any} defaultLessonId={lesson_id} />
      </div>

      {quizzes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {quizzes.map((quiz: any) => (
            <div key={quiz.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="font-semibold">{quiz.title}</p>
                  <p className="text-xs text-muted-foreground">Lesson: {quiz.lessons?.title}</p>
                </div>
                <div className="flex gap-1">
                  <QuizFormDialog lessons={lessons as any} quiz={quiz} />
                  <DeleteEntityButton entityLabel="Quiz" entityName={quiz.title} onDelete={deleteQuizAction.bind(null, quiz.id)} />
                </div>
              </div>
              <div className="mb-3 flex gap-4 text-xs text-muted-foreground">
                <span>Nilai Lulus: {quiz.passing_score}</span>
                <span>Waktu: {quiz.time_limit_minutes} Menit</span>
                <span>{quiz.quiz_questions?.length ?? 0} Pertanyaan</span>
              </div>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href={`/admin/quizzes/${quiz.id}`}>
                  <ListChecks className="h-4 w-4" /> Kelola Pertanyaan
                </Link>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={HelpCircle} title="Belum ada quiz" description="Tambahkan quiz pertama untuk lesson Anda." />
      )}
    </div>
  );
}
