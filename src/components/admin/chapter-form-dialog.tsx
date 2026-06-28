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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { chapterSchema, type ChapterInput } from "@/lib/validations/chapter-lesson.schema";
import { createChapterAction, updateChapterAction } from "@/lib/actions/chapter.actions";
import type { Chapter } from "@/types/database.types";

interface ChapterFormDialogProps {
  courses: { id: string; title: string }[];
  chapter?: Chapter;
  defaultCourseId?: string;
}

export function ChapterFormDialog({ courses, chapter, defaultCourseId }: ChapterFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChapterInput>({
    resolver: zodResolver(chapterSchema),
    defaultValues: chapter
      ? {
          course_id: chapter.course_id,
          title: chapter.title,
          description: chapter.description ?? "",
          order_index: chapter.order_index,
        }
      : { course_id: defaultCourseId ?? "", order_index: 1 },
  });

  const onSubmit = async (values: ChapterInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("course_id", values.course_id);
    formData.append("title", values.title);
    formData.append("description", values.description ?? "");
    formData.append("order_index", String(values.order_index));

    const result = chapter
      ? await updateChapterAction(chapter.id, formData)
      : await createChapterAction(formData);

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
        {chapter ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="gradient">
            <Plus className="h-4 w-4" /> Tambah Chapter
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{chapter ? "Edit Chapter" : "Tambah Chapter"}</DialogTitle>
          <DialogDescription>Lengkapi informasi chapter di bawah ini.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Kelas</Label>
            <select
              {...register("course_id")}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">Pilih Kelas</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {errors.course_id && <p className="text-xs text-destructive">{errors.course_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Judul Chapter</Label>
            <Input id="title" {...register("title")} placeholder="Bab 1 - Perkenalan Diri" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (opsional)</Label>
            <Textarea id="description" {...register("description")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order_index">Urutan</Label>
            <Input id="order_index" type="number" {...register("order_index")} />
            {errors.order_index && <p className="text-xs text-destructive">{errors.order_index.message}</p>}
          </div>

          <Button type="submit" variant="gradient" className="w-full" isLoading={isSubmitting}>
            {chapter ? "Simpan Perubahan" : "Buat Chapter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
