"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { quizSchema } from "@/lib/validations/quiz.schema";

type ActionResult = { success: boolean; message: string };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return supabase;
}

export async function getQuizzesByLesson(lessonId?: string) {
  const supabase = await assertAdmin();
  let query = supabase
    .from("quizzes")
    .select("*, lessons(title), quiz_questions(id)")
    .order("created_at", { ascending: false });
  if (lessonId) query = query.eq("lesson_id", lessonId);
  const { data } = await query;
  return data ?? [];
}

export async function getQuizWithQuestions(quizId: string) {
  const supabase = await assertAdmin();
  const { data } = await supabase
    .from("quizzes")
    .select("*, lessons(title), quiz_questions(*, quiz_answers(*))")
    .eq("id", quizId)
    .single();
  return data;
}

export async function createQuizAction(formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const raw = {
    lesson_id: formData.get("lesson_id") as string,
    title: formData.get("title") as string,
    passing_score: formData.get("passing_score") as string,
    time_limit_minutes: formData.get("time_limit_minutes") as string,
  };

  const parsed = quizSchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const { error } = await supabase.from("quizzes").insert(parsed.data);
  if (error) return { success: false, message: "Gagal membuat quiz." };

  revalidatePath("/admin/quizzes");
  return { success: true, message: "Quiz berhasil dibuat." };
}

export async function updateQuizAction(quizId: string, formData: FormData): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const raw = {
    lesson_id: formData.get("lesson_id") as string,
    title: formData.get("title") as string,
    passing_score: formData.get("passing_score") as string,
    time_limit_minutes: formData.get("time_limit_minutes") as string,
  };

  const parsed = quizSchema.safeParse(raw);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0].message };

  const { error } = await supabase.from("quizzes").update(parsed.data).eq("id", quizId);
  if (error) return { success: false, message: "Gagal memperbarui quiz." };

  revalidatePath("/admin/quizzes");
  return { success: true, message: "Quiz berhasil diperbarui." };
}

export async function deleteQuizAction(quizId: string): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("quizzes").delete().eq("id", quizId);
  if (error) return { success: false, message: "Gagal menghapus quiz." };

  revalidatePath("/admin/quizzes");
  return { success: true, message: "Quiz berhasil dihapus." };
}

export async function createQuestionWithAnswersAction(payload: {
  quiz_id: string;
  question: string;
  question_type: "single" | "multiple";
  order_index: number;
  answers: { answer_text: string; is_correct: boolean }[];
}): Promise<ActionResult> {
  const supabase = await assertAdmin();

  const { data: question, error: questionError } = await supabase
    .from("quiz_questions")
    .insert({
      quiz_id: payload.quiz_id,
      question: payload.question,
      question_type: payload.question_type,
      order_index: payload.order_index,
    })
    .select()
    .single();

  if (questionError || !question) {
    return { success: false, message: "Gagal menambahkan pertanyaan." };
  }

  const answersToInsert = payload.answers.map((a, i) => ({
    question_id: question.id,
    answer_text: a.answer_text,
    is_correct: a.is_correct,
    order_index: i + 1,
  }));

  const { error: answerError } = await supabase.from("quiz_answers").insert(answersToInsert);
  if (answerError) {
    return { success: false, message: "Gagal menambahkan jawaban." };
  }

  revalidatePath("/admin/quizzes");
  return { success: true, message: "Pertanyaan berhasil ditambahkan." };
}

export async function deleteQuestionAction(questionId: string): Promise<ActionResult> {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("quiz_questions").delete().eq("id", questionId);
  if (error) return { success: false, message: "Gagal menghapus pertanyaan." };

  revalidatePath("/admin/quizzes");
  return { success: true, message: "Pertanyaan berhasil dihapus." };
}
