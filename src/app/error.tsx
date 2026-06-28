"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <h1 className="text-2xl font-bold">Terjadi Kesalahan</h1>
      <p className="max-w-sm text-muted-foreground">
        Maaf, terjadi kesalahan pada sistem. Silakan coba lagi atau muat ulang halaman.
      </p>
      <Button variant="gradient" onClick={() => reset()}>
        Coba Lagi
      </Button>
    </div>
  );
}
