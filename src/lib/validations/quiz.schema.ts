import { z } from "zod";

export const quizSchema = z.object({
  lesson_id: z.string().uuid("Lesson wajib dipilih"),
  title: z.string().min(3, "Judul quiz minimal 3 karakter"),
  passing_score: z.coerce.number().int().min(0).max(100),
  time_limit_minutes: z.coerce.number().int().min(1),
});
export type QuizInput = z.infer<typeof quizSchema>;

export const questionAnswerSchema = z.object({
  text: z.string().min(1, "Teks jawaban wajib diisi"),
});

export const quizQuestionSchema = z.object({
  quiz_id: z.string().uuid(),
  question: z.string().min(5, "Pertanyaan minimal 5 karakter"),
  question_type: z.enum(["single", "multiple"]),
  order_index: z.coerce.number().int().min(1),
  answers: z
    .array(
      z.object({
        answer_text: z.string().min(1, "Jawaban tidak boleh kosong"),
        is_correct: z.boolean(),
      })
    )
    .min(2, "Minimal 2 pilihan jawaban")
    .refine((answers) => answers.some((a) => a.is_correct), "Minimal 1 jawaban benar harus dipilih"),
});
export type QuizQuestionInput = z.infer<typeof quizQuestionSchema>;
