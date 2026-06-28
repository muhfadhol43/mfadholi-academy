import Link from "next/link";
import { Lock, PlayCircle, Clock } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface CurriculumProps {
  chapters: any[];
  courseSlug: string;
  isEnrolled: boolean;
}

export function CourseCurriculum({ chapters, courseSlug, isEnrolled }: CurriculumProps) {
  const totalLessons = chapters.reduce((acc, c) => acc + c.lessons.length, 0);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Kurikulum Kelas</h3>
        <span className="text-xs text-muted-foreground">{chapters.length} Chapter &middot; {totalLessons} Lesson</span>
      </div>

      <Accordion type="multiple" defaultValue={[chapters[0]?.id]}>
        {chapters.map((chapter, idx) => (
          <AccordionItem key={chapter.id} value={chapter.id}>
            <AccordionTrigger>
              Bab {idx + 1} - {chapter.title}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1.5">
                {chapter.lessons.map((lesson: any) => {
                  const canAccess = isEnrolled || lesson.is_free_preview;
                  return (
                    <li key={lesson.id}>
                      {canAccess ? (
                        <Link
                          href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent/10"
                        >
                          <span className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4 text-primary" />
                            {lesson.title}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {lesson.duration_minutes}m
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Lock className="h-3.5 w-3.5" />
                            {lesson.title}
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" /> {lesson.duration_minutes}m
                          </span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
