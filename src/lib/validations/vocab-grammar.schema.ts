import { z } from "zod";

export const vocabularySchema = z.object({
  lesson_id: z.string().uuid("Lesson wajib dipilih"),
  kanji: z.string().optional().or(z.literal("")),
  hiragana: z.string().min(1, "Hiragana wajib diisi"),
  romaji: z.string().optional().or(z.literal("")),
  meaning_id: z.string().min(1, "Arti wajib diisi"),
  order_index: z.coerce.number().int().min(1),
});
export type VocabularyInput = z.infer<typeof vocabularySchema>;

export const grammarSchema = z.object({
  lesson_id: z.string().uuid("Lesson wajib dipilih"),
  pattern: z.string().min(1, "Pola kalimat wajib diisi"),
  explanation: z.string().min(5, "Penjelasan minimal 5 karakter"),
  example_sentence_jp: z.string().min(1, "Contoh kalimat Jepang wajib diisi"),
  example_sentence_id: z.string().min(1, "Contoh kalimat Indonesia wajib diisi"),
  order_index: z.coerce.number().int().min(1),
});
export type GrammarInput = z.infer<typeof grammarSchema>;
