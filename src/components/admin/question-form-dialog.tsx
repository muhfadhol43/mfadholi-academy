"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { quizQuestionSchema, type QuizQuestionInput } from "@/lib/validations/quiz.schema";
import { createQuestionWithAnswersAction } from "@/lib/actions/quiz.actions";

export function QuestionFormDialog({ quizId, nextOrderIndex }: { quizId: string; nextOrderIndex: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<QuizQuestionInput>({
    resolver: zodResolver(quizQuestionSchema),
    defaultValues: {
      quiz_id: quizId,
      question_type: "single",
      order_index: nextOrderIndex,
      answers: [
        { answer_text: "", is_correct: true },
        { answer_text: "", is_correct: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "answers" });

  const onSubmit = async (values: QuizQuestionInput) => {
    setIsSubmitting(true);
    const result = await createQuestionWithAnswersAction(values);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setOpen(false);
    reset();
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm">
          <Plus className="h-4 w-4" /> Tambah Pertanyaan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Tambah Pertanyaan</DialogTitle>
          <DialogDescription>Lengkapi pertanyaan dan minimal 2 pilihan jawaban, tandai jawaban yang benar.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Pertanyaan</Label>
            <Textarea id="question" {...register("question")} placeholder="Apa arti dari「わたし」?" />
            {errors.question && <p className="text-xs text-destructive">{errors.question.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Pilihan Jawaban</Label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Controller
                    control={control}
                    name={`answers.${index}.is_correct`}
                    render={({ field: checkField }) => (
                      <input
                        type="checkbox"
                        checked={checkField.value}
                        onChange={(e) => checkField.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-input accent-primary"
                      />
                    )}
                  />
                  <Input
                    {...register(`answers.${index}.answer_text`)}
                    placeholder={`Pilihan jawaban ${index + 1}`}
                  />
                  {fields.length > 2 && (
                    <button type="button" onClick={() => remove(index)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.answers && <p className="text-xs text-destructive">{errors.answers.message as string}</p>}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ answer_text: "", is_correct: false })}
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Pilihan
            </Button>
          </div>

          <Button type="submit" variant="gradient" className="w-full" isLoading={isSubmitting}>
            Simpan Pertanyaan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
