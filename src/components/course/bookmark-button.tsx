"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleBookmarkAction } from "@/lib/actions/lesson-interaction.actions";
import { cn } from "@/lib/utils";

export function BookmarkButton({ lessonId, initialBookmarked }: { lessonId: string; initialBookmarked: boolean }) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const result = await toggleBookmarkAction(lessonId);
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setBookmarked(result.bookmarked ?? false);
    toast.success(result.message);
    router.refresh();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleToggle} disabled={isLoading}>
      <Bookmark className={cn("h-4 w-4", bookmarked && "fill-primary text-primary")} />
      {bookmarked ? "Tersimpan" : "Simpan"}
    </Button>
  );
}
