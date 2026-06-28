"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { lessonSchema, type LessonInput } from "@/lib/validations/chapter-lesson.schema";
import { createLessonAction, updateLessonAction } from "@/lib/actions/lesson.actions";

interface LessonFormDialogProps {
  chapters: { id: string; title: string; course_id: string }[];
  lesson?: any;
}

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export function LessonFormDialog({ chapters, lesson }: LessonFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LessonInput>({
    resolver: zodResolver(lessonSchema),
    defaultValues: lesson
      ? {
          chapter_id: lesson.chapter_id,
          course_id: lesson.course_id,
          title: lesson.title,
          slug: lesson.slug,
          summary: lesson.summary ?? "",
          duration_minutes: lesson.duration_minutes,
          order_index: lesson.order_index,
          is_free_preview: lesson.is_free_preview,
          youtube_url: lesson.lesson_videos?.[0]?.youtube_url ?? "",
        }
      : { order_index: 1, duration_minutes: 0, is_free_preview: false },
  });

  const chapterId = watch("chapter_id");

  useEffect(() => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (chapter) setValue("course_id", chapter.course_id);
  }, [chapterId, chapters, setValue]);

  const onSubmit = async (values: LessonInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "is_free_preview") {
        if (value) formData.append("is_free_preview", "on");
      } else {
        formData.append(key, String(value ?? ""));
      }
    });

    const result = lesson ? await updateLessonAction(lesson.id, formData) : await createLessonAction(formData);
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
        {lesson ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="gradient">
            <Plus className="h-4 w-4" /> Tambah Lesson
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit Lesson" : "Tambah Lesson"}</DialogTitle>
          <DialogDescription>Lengkapi informasi lesson di bawah ini.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Chapter</Label>
            <select {...register("chapter_id")} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">Pilih Chapter</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {errors.chapter_id && <p className="text-xs text-destructive">{errors.chapter_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Judul Lesson</Label>
            <Input
              id="title"
              {...register("title")}
              onBlur={(e) => {
                if (!lesson) setValue("slug", slugify(e.target.value));
              }}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug")} />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Ringkasan</Label>
            <Textarea id="summary" {...register("summary")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_url">Link YouTube</Label>
            <Input id="youtube_url" placeholder="https://youtube.com/watch?v=..." {...register("youtube_url")} />
            {errors.youtube_url && <p className="text-xs text-destructive">{errors.youtube_url.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Durasi (Menit)</Label>
              <Input id="duration_minutes" type="number" {...register("duration_minutes")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order_index">Urutan</Label>
              <Input id="order_index" type="number" {...register("order_index")} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <Label htmlFor="is_free_preview" className="cursor-pointer">
              Preview Gratis
            </Label>
            <Switch id="is_free_preview" checked={watch("is_free_preview")} onCheckedChange={(v) => setValue("is_free_preview", v)} />
          </div>

          <Button type="submit" variant="gradient" className="w-full" isLoading={isSubmitting}>
            {lesson ? "Simpan Perubahan" : "Buat Lesson"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
