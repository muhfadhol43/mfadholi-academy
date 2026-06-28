"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlayCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { enrollCourseAction } from "@/lib/actions/enrollment.actions";

interface EnrollButtonProps {
  courseId: string;
  isEnrolled: boolean;
  isPremium: boolean;
  firstLessonHref?: string;
}

export function EnrollButton({ courseId, isEnrolled, isPremium, firstLessonHref }: EnrollButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isEnrolled) {
    return (
      <Button variant="gradient" size="lg" className="w-full" onClick={() => router.push(firstLessonHref ?? "#")}>
        <PlayCircle className="h-4 w-4" /> Lanjutkan Belajar
      </Button>
    );
  }

  const handleEnroll = async () => {
    setIsSubmitting(true);
    const result = await enrollCourseAction(courseId);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      if (result.message.includes("login")) router.push("/login");
      return;
    }

    toast.success(result.message);
    router.refresh();
  };

  return (
    <Button variant="gradient" size="lg" className="w-full" onClick={handleEnroll} isLoading={isSubmitting}>
      {isPremium ? <Lock className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
      {isPremium ? "Beli & Mulai Belajar" : "Daftar Kelas Gratis"}
    </Button>
  );
}
