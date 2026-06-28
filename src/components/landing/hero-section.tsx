"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Users, Trophy, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sakura-50 py-16 dark:from-background dark:via-background dark:to-background md:py-24">
      <div className="container grid items-center gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            #1 Platform Belajar Bahasa Jepang Online
          </span>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Belajar Bahasa Jepang
            <br />
            Jadi Lebih <span className="text-primary">Mudah</span> &{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-sakura-500 bg-clip-text text-transparent">
              Menyenangkan
            </span>
          </h1>

          <p className="max-w-md text-muted-foreground">
            Video pembelajaran berkualitas, materi terstruktur, latihan interaktif, dan
            sertifikat untuk perjalanan belajarmu.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" variant="gradient" asChild>
              <Link href="/register">
                Mulai Belajar Gratis <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/courses">
                <PlayCircle className="h-4 w-4" /> Lihat Semua Kelas
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-8 pt-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <div>
                <p className="text-sm font-bold">4.9/5</p>
                <p className="text-xs text-muted-foreground">Rating Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-bold">10.000+</p>
                <p className="text-xs text-muted-foreground">Siswa Terdaftar</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-bold">95%</p>
                <p className="text-xs text-muted-foreground">Tingkat Kelulusan</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mx-auto h-[320px] w-full max-w-lg md:h-[420px]"
        >
          <Image
            src="/illustrations/hero-japan.svg"
            alt="Ilustrasi belajar bahasa Jepang"
            fill
            priority
            className="object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
