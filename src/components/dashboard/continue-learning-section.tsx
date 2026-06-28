import Link from "next/link";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ContinueLearningItem {
  id: string;
  progress_percent: number;
  courses: { title: string; slug: string; thumbnail_url: string | null } | null;
  lessons: { title: string; slug: string; chapters: { title: string } | null } | null;
}

export function ContinueLearningSection({ items }: { items: ContinueLearningItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">Anda belum memulai kelas apapun.</p>
        <Button variant="gradient" className="mt-4" asChild>
          <Link href="/courses">Jelajahi Kelas</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Lanjutkan Belajar</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
              {item.courses?.thumbnail_url ? (
                <Image src={item.courses.thumbnail_url} alt={item.courses.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-100 to-sakura-100 text-lg font-bold text-primary/40">
                  日本語
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="line-clamp-1 text-sm font-semibold">{item.courses?.title}</p>
                {item.lessons?.chapters?.title && (
                  <p className="text-xs text-muted-foreground">{item.lessons.chapters.title}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.progress_percent}%</span>
                </div>
                <Progress value={item.progress_percent} />
              </div>
              <Button size="sm" variant="gradient" asChild className="mt-2 w-fit">
                <Link href={`/courses/${item.courses?.slug}/lessons/${item.lessons?.slug ?? ""}`}>
                  Lanjutkan
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
