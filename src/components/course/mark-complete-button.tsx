"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { markLessonCompleteAction } from "@/lib/actions/lesson-interaction.actions";

export function MarkCompleteButton({
  lessonId,
  courseId,
  isCompleted,
}: {
  lessonId: string;
  courseId: string;
  isCompleted: boolean;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(isCompleted);
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    const result = await markLessonCompleteAction(lessonId, courseId);
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setCompleted(true);
    toast.success(result.message);
    router.refresh();
  };

  if (completed) {
    return (
      <Button variant="outline" size="sm" disabled className="border-emerald-300 text-emerald-600">
        <CheckCircle2 className="h-4 w-4" /> Selesai
      </Button>
    );
  }

  return (
    <Button variant="gradient" size="sm" onClick={handleComplete} isLoading={isLoading}>
      <CheckCircle2 className="h-4 w-4" /> Tandai Selesai
    </Button>
  );
}
