"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Dimas Pratama",
    role: "Mahasiswa, Persiapan JLPT N4",
    content:
      "Materinya runtut dan video penjelasannya gampang dimengerti. Dalam 3 bulan saya sudah berani ikut try out JLPT N4.",
    rating: 5,
  },
  {
    name: "Sarah Amalia",
    role: "Karyawan Swasta",
    content:
      "Latihan interaktif dan kosakata native sangat membantu pengucapan saya. Sensei juga responsif menjawab pertanyaan di komentar.",
    rating: 5,
  },
  {
    name: "Budi Santoso",
    role: "Pelajar SMA",
    content:
      "Awalnya saya kesulitan hiragana, tapi dengan kelas dasar di sini jadi lebih paham. Sertifikatnya juga keren buat portofolio.",
    rating: 4,
  },
];

export function TestimonialSection() {
  return (
    <section className="container py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Apa Kata Mereka?</h2>
        <p className="mt-2 text-muted-foreground">Pengalaman belajar dari ribuan siswa Mfadholi.Dev Academy</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="relative rounded-2xl border border-border bg-card p-6"
          >
            <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" />
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-4 w-4 ${idx < t.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>
            <p className="mb-4 text-sm text-muted-foreground">&ldquo;{t.content}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sakura-500 text-sm font-bold text-white">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
