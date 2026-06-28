import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-indigo-50 via-white to-sakura-50 p-4 text-center dark:from-background dark:via-background dark:to-background">
      <Sparkles className="h-10 w-10 text-primary" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="max-w-sm text-muted-foreground">
        Halaman yang Anda cari tidak ditemukan. Mungkin sudah dipindahkan atau dihapus.
      </p>
      <Button variant="gradient" asChild>
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
