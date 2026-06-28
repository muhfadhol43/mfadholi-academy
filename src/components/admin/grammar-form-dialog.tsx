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
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { grammarSchema, type GrammarInput } from "@/lib/validations/vocab-grammar.schema";
import { createGrammarAction, updateGrammarAction } from "@/lib/actions/grammar.actions";

interface GrammarFormDialogProps {
  lessons: { id: string; title: string }[];
  grammar?: any;
  defaultLessonId?: string;
}

export function GrammarFormDialog({ lessons, grammar, defaultLessonId }: GrammarFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GrammarInput>({
    resolver: zodResolver(grammarSchema),
    defaultValues: grammar
      ? {
          lesson_id: grammar.lesson_id,
          pattern: grammar.pattern,
          explanation: grammar.explanation,
          example_sentence_jp: grammar.example_sentence_jp,
          example_sentence_id: grammar.example_sentence_id,
          order_index: grammar.order_index,
        }
      : { lesson_id: defaultLessonId ?? "", order_index: 1 },
  });

  const onSubmit = async (values: GrammarInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value ?? "")));

    const result = grammar ? await updateGrammarAction(grammar.id, formData) : await createGrammarAction(formData);
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
        {grammar ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="gradient">
            <Plus className="h-4 w-4" /> Tambah Grammar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{grammar ? "Edit Grammar" : "Tambah Grammar"}</DialogTitle>
          <DialogDescription>Lengkapi pola tata bahasa di bawah ini.</DialogDescription>
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
            <Label htmlFor="pattern">Pola Kalimat</Label>
            <Input id="pattern" {...register("pattern")} placeholder="N1 は N2 です" />
            {errors.pattern && <p className="text-xs text-destructive">{errors.pattern.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Penjelasan</Label>
            <Textarea id="explanation" {...register("explanation")} />
            {errors.explanation && <p className="text-xs text-destructive">{errors.explanation.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="example_sentence_jp">Contoh Kalimat (Jepang)</Label>
            <Input id="example_sentence_jp" {...register("example_sentence_jp")} placeholder="わたしはファディエルです。" />
            {errors.example_sentence_jp && <p className="text-xs text-destructive">{errors.example_sentence_jp.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="example_sentence_id">Contoh Kalimat (Indonesia)</Label>
            <Input id="example_sentence_id" {...register("example_sentence_id")} placeholder="Saya adalah Fadhiel." />
            {errors.example_sentence_id && <p className="text-xs text-destructive">{errors.example_sentence_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Urutan</Label>
            <Input id="order_index" type="number" {...register("order_index")} />
          </div>

          <Button type="submit" variant="gradient" className="w-full" isLoading={isSubmitting}>
            {grammar ? "Simpan Perubahan" : "Tambah Grammar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
