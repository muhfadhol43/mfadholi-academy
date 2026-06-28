import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="container py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-sakura-500 px-8 py-14 text-center text-white">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="relative z-10 mx-auto max-w-xl space-y-5">
          <h2 className="text-3xl font-bold">Siap Mulai Perjalanan Belajar Bahasa Jepangmu?</h2>
          <p className="text-white/90">
            Gabung bersama 10.000+ siswa lainnya dan raih sertifikat penguasaan bahasa Jepang.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">
              Daftar Gratis Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
