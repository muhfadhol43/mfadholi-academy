import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter").max(150),
  slug: z
    .string()
    .min(5, "Slug minimal 5 karakter")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  level: z.enum(["N5", "N4", "N3", "N2", "N1"]),
  sensei_name: z.string().min(3, "Nama sensei minimal 3 karakter"),
  duration_minutes: z.coerce.number().int().min(0, "Durasi tidak boleh negatif"),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  is_premium: z.coerce.boolean(),
  status: z.enum(["draft", "published", "archived"]),
  thumbnail_url: z.string().optional().nullable(),
});
export type CourseInput = z.infer<typeof courseSchema>;
