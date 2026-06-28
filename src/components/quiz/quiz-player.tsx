"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Trophy, RotateCcw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { submitQuizAttemptAction } from "@/lib/actions/lesson-interaction.actions";

interface QuizAnswer {
  id: string;
  answer_text: string;
  is_correct: boolean;
}
interface QuizQuestion {
  id: string;
  question: string;
  quiz_answers: QuizAnswer[];
}
interface Quiz {
  id: string;
  title: string;
  passing_score: number;
  time_limit_minutes: number;
  quiz_questions: QuizQuestion[];
}

export function QuizPlayer({ quiz, lessonId, courseId }: { quiz: Quiz; lessonId: string; courseId: string }) {
  const router = useRouter();
  const questions = quiz.quiz_questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  const handleSelect = (questionId: string, answerId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    questions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const correctAnswer = q.quiz_answers.find((a) => a.is_correct);
      if (selected && correctAnswer && selected === correctAnswer.id) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);

    setIsSaving(true);
    const result = await submitQuizAttemptAction({ lessonId, courseId, score: finalScore });
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    router.refresh();
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  if (questions.length === 0) {
    return <p className="text-sm text-muted-foreground">Quiz untuk lesson ini belum memiliki pertanyaan.</p>;
  }

  if (isSubmitted) {
    const isPassed = score >= quiz.passing_score;
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <span
          className={cn(
            "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full",
            isPassed ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
          )}
        >
          <Trophy className="h-8 w-8" />
        </span>
        <h3 className="text-2xl font-bold">{score}%</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {isPassed ? "Selamat! Anda lulus quiz ini." : `Belum lulus. Nilai minimum adalah ${quiz.passing_score}%.`}
        </p>
        <Button variant="outline" className="mt-5" onClick={handleRetry} disabled={isSaving}>
          <RotateCcw className="h-4 w-4" /> Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Soal {currentIndex + 1} dari {questions.length}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {quiz.time_limit_minutes} Menit
        </span>
      </div>
      <Progress value={progressPercent} />

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="mb-4 font-medium">{currentQuestion.question}</p>
        <div className="space-y-2">
          {currentQuestion.quiz_answers.map((answer) => {
            const isSelected = selectedAnswers[currentQuestion.id] === answer.id;
            return (
              <button
                key={answer.id}
                onClick={() => handleSelect(currentQuestion.id, answer.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors",
                  isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-accent/5"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
                {answer.answer_text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="gradient"
          onClick={handleNext}
          disabled={!selectedAnswers[currentQuestion.id]}
          isLoading={isSaving && currentIndex === questions.length - 1}
        >
          {currentIndex < questions.length - 1 ? "Soal Selanjutnya" : "Selesai & Lihat Hasil"}
        </Button>
      </div>
    </div>
  );
}
