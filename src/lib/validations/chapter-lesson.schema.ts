import { z } from "zod";

export const chapterSchema = z.object({
  course_id: z.string().uuid("Kelas wajib dipilih"),
  title: z.string().min(3, "Judul chapter minimal 3 karakter").max(150),
  description: z.string().optional().or(z.literal("")),
  order_index: z.coerce.number().int().min(1, "Urutan minimal 1"),
});
export type ChapterInput = z.infer<typeof chapterSchema>;

export const lessonSchema = z.object({
  chapter_id: z.string().uuid("Chapter wajib dipilih"),
  course_id: z.string().uuid("Kelas wajib dipilih"),
  title: z.string().min(3, "Judul lesson minimal 3 karakter").max(150),
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  summary: z.string().optional().or(z.literal("")),
  duration_minutes: z.coerce.number().int().min(0),
  order_index: z.coerce.number().int().min(1),
  is_free_preview: z.coerce.boolean(),
  youtube_url: z.string().url("URL YouTube tidak valid").optional().or(z.literal("")),
});
export type LessonInput = z.infer<typeof lessonSchema>;
