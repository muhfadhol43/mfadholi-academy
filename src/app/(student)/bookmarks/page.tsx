import Link from "next/link";
import Image from "next/image";
import { Bookmark, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMyBookmarks } from "@/lib/actions/student.queries";

export const metadata = { title: "Bookmark" };

export default async function BookmarksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const bookmarks = await getMyBookmarks(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookmark Saya</h1>
        <p className="text-sm text-muted-foreground">Lesson yang Anda simpan untuk dipelajari nanti</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Bookmark className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">Anda belum menyimpan bookmark apapun.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bm: any) => (
            <Link
              key={bm.id}
              href={`/courses/${bm.lessons?.courses?.slug}/lessons/${bm.lessons?.slug}`}
              className="flex gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-accent/5"
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                {bm.lessons?.courses?.thumbnail_url ? (
                  <Image src={bm.lessons.courses.thumbnail_url} alt="" fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-100 to-sakura-100">
                    <BookOpen className="h-5 w-5 text-primary/40" />
                  </div>
                )}
              </div>
              <div>
                <p className="line-clamp-1 text-sm font-semibold">{bm.lessons?.title}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{bm.lessons?.courses?.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
