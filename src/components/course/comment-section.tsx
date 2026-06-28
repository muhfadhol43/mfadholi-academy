"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { addCommentAction } from "@/lib/actions/lesson-interaction.actions";

interface CommentItem {
  id: string;
  content: string;
  created_at: string;
  profiles: { full_name: string; avatar_url: string | null } | null;
}

export function CommentSection({ lessonId, comments }: { lessonId: string; comments: CommentItem[] }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await addCommentAction(lessonId, content);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setContent("");
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Textarea
          placeholder="Tulis pertanyaan atau komentar Anda..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} variant="gradient" size="sm" isLoading={isSubmitting} disabled={!content.trim()}>
            <Send className="h-4 w-4" /> Kirim Komentar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={c.profiles?.avatar_url ?? undefined} />
                <AvatarFallback>{c.profiles?.full_name?.charAt(0) ?? "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-xl border border-border bg-muted/20 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{c.profiles?.full_name ?? "Pengguna"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: idLocale })}
                  </p>
                </div>
                <p className="mt-1 text-sm">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
