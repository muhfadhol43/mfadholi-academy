import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonNavProps {
  courseSlug: string;
  prevLesson: { slug: string; title: string } | null;
  nextLesson: { slug: string; title: string } | null;
}

export function LessonNav({ courseSlug, prevLesson, nextLesson }: LessonNavProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
      {prevLesson ? (
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseSlug}/lessons/${prevLesson.slug}`}>
            <ChevronLeft className="h-4 w-4" /> Sebelumnya
          </Link>
        </Button>
      ) : (
        <span />
      )}

      {nextLesson ? (
        <Button variant="gradient" asChild>
          <Link href={`/courses/${courseSlug}/lessons/${nextLesson.slug}`}>
            Selanjutnya <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}
