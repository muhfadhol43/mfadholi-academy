"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { quizSchema, type QuizInput } from "@/lib/validations/quiz.schema";
import { createQuizAction, updateQuizAction } from "@/lib/actions/quiz.actions";

interface QuizFormDialogProps {
  lessons: { id: string; title: string }[];
  quiz?: any;
  defaultLessonId?: string;
}

export function QuizFormDialog({ lessons, quiz, defaultLessonId }: QuizFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizInput>({
    resolver: zodResolver(quizSchema),
    defaultValues: quiz
      ? {
          lesson_id: quiz.lesson_id,
          title: quiz.title,
          passing_score: quiz.passing_score,
          time_limit_minutes: quiz.time_limit_minutes,
        }
      : { lesson_id: defaultLessonId ?? "", passing_score: 70, time_limit_minutes: 10 },
  });

  const onSubmit = async (values: QuizInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value ?? "")));

    const result = quiz ? await updateQuizAction(quiz.id, formData) : await createQuizAction(formData);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {quiz ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="gradient">
            <Plus className="h-4 w-4" /> Tambah Quiz
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{quiz ? "Edit Quiz" : "Tambah Quiz"}</DialogTitle>
          <DialogDescription>Lengkapi informasi quiz di bawah ini.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Lesson</Label>
            <select {...register("lesson_id")} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">Pilih Lesson</option>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
            {errors.lesson_id && <p className="text-xs text-destructive">{errors.lesson_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Judul Quiz</Label>
            <Input id="title" {...register("title")} placeholder="Quiz Bab 1 - Perkenalan Diri" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passing_score">Nilai Minimum Lulus</Label>
              <Input id="passing_score" type="number" {...register("passing_score")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time_limit_minutes">Batas Waktu (Menit)</Label>
              <Input id="time_limit_minutes" type="number" {...register("time_limit_minutes")} />
            </div>
          </div>

          <Button type="submit" variant="gradient" className="w-full" isLoading={isSubmitting}>
            {quiz ? "Simpan Perubahan" : "Buat Quiz"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
