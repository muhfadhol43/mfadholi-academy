"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Type, BookText, Trophy, GraduationCap, Library } from "lucide-react";

const categories = [
  { icon: Type, title: "Hiragana", desc: "Dasar membaca huruf Jepang", href: "/courses?category=hiragana", color: "bg-rose-100 text-rose-600" },
  { icon: BookText, title: "Katakana", desc: "Dasar membaca huruf Jepang", href: "/courses?category=katakana", color: "bg-amber-100 text-amber-600" },
  { icon: BookOpen, title: "Minna no Nihongo", desc: "Belajar dengan buku terpopuler", href: "/courses?category=minna", color: "bg-indigo-100 text-indigo-600" },
  { icon: Trophy, title: "JLPT N5", desc: "Persiapan ujian JLPT level N5", href: "/courses?level=N5", color: "bg-emerald-100 text-emerald-600" },
  { icon: GraduationCap, title: "JLPT N4", desc: "Persiapan ujian JLPT level N4", href: "/courses?level=N4", color: "bg-sky-100 text-sky-600" },
  { icon: Library, title: "JLPT N3", desc: "Persiapan ujian JLPT level N3", href: "/courses?level=N3", color: "bg-purple-100 text-purple-600" },
];

export function CategorySection() {
  return (
    <section className="container py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Kategori Populer</h2>
        <p className="mt-2 text-muted-foreground">Pilih kategori yang sesuai dengan tujuan belajarmu</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              href={cat.href}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.color}`}>
                <cat.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-sm font-semibold">{cat.title}</p>
                <p className="text-xs text-muted-foreground">{cat.desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
