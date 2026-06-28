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
import { vocabularySchema, type VocabularyInput } from "@/lib/validations/vocab-grammar.schema";
import { createVocabularyAction, updateVocabularyAction } from "@/lib/actions/vocabulary.actions";

interface VocabularyFormDialogProps {
  lessons: { id: string; title: string }[];
  vocabulary?: any;
  defaultLessonId?: string;
}

export function VocabularyFormDialog({ lessons, vocabulary, defaultLessonId }: VocabularyFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VocabularyInput>({
    resolver: zodResolver(vocabularySchema),
    defaultValues: vocabulary
      ? {
          lesson_id: vocabulary.lesson_id,
          kanji: vocabulary.kanji ?? "",
          hiragana: vocabulary.hiragana,
          romaji: vocabulary.romaji ?? "",
          meaning_id: vocabulary.meaning_id,
          order_index: vocabulary.order_index,
        }
      : { lesson_id: defaultLessonId ?? "", order_index: 1 },
  });

  const onSubmit = async (values: VocabularyInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value ?? "")));

    const result = vocabulary
      ? await updateVocabularyAction(vocabulary.id, formData)
      : await createVocabularyAction(formData);

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
        {vocabulary ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="gradient">
            <Plus className="h-4 w-4" /> Tambah Kosakata
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vocabulary ? "Edit Kosakata" : "Tambah Kosakata"}</DialogTitle>
          <DialogDescription>Lengkapi data kosakata di bawah ini.</DialogDescription>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kanji">Kanji (opsional)</Label>
              <Input id="kanji" {...register("kanji")} placeholder="私" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hiragana">Hiragana</Label>
              <Input id="hiragana" {...register("hiragana")} placeholder="わたし" />
              {errors.hiragana && <p className="text-xs text-destructive">{errors.hiragana.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="romaji">Romaji (opsional)</Label>
            <Input id="romaji" {...register("romaji")} placeholder="watashi" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meaning_id">Arti Bahasa Indonesia</Label>
            <Input id="meaning_id" {...register("meaning_id")} placeholder="Saya" />
            {errors.meaning_id && <p className="text-xs text-destructive">{errors.meaning_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Urutan</Label>
            <Input id="order_index" type="number" {...register("order_index")} />
          </div>

          <Button type="submit" variant="gradient" className="w-full" isLoading={isSubmitting}>
            {vocabulary ? "Simpan Perubahan" : "Tambah Kosakata"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
