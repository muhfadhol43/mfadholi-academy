import { MessageSquare } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { getAllComments, deleteCommentAction } from "@/lib/actions/comment.actions";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const metadata = { title: "Kelola Komentar" };

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { comments, total, pageSize } = await getAllComments({ search: params.search, page });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kelola Komentar</h1>
        <p className="text-sm text-muted-foreground">Total {total} komentar dari seluruh siswa</p>
      </div>

      <SearchInput placeholder="Cari isi komentar..." />

      {comments && comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((c: any) => (
            <div key={c.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={c.profiles?.avatar_url ?? undefined} />
                <AvatarFallback>{c.profiles?.full_name?.charAt(0) ?? "?"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{c.profiles?.full_name ?? "Pengguna"}</p>
                  <DeleteEntityButton
                    entityLabel="Komentar"
                    entityName="komentar ini"
                    onDelete={deleteCommentAction.bind(null, c.id)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.lessons?.courses?.title} &middot; {c.lessons?.title}
                </p>
                <p className="mt-1 text-sm">{c.content}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: idLocale })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={MessageSquare} title="Belum ada komentar" description="Belum ada komentar dari siswa." />
      )}

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
