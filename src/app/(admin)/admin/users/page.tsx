import { Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SearchInput } from "@/components/shared/search-input";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { UserActiveToggle } from "@/components/admin/user-active-toggle";
import { getUserList, deleteUserAction } from "@/lib/actions/user.actions";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const metadata = { title: "Kelola User" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { users, total, pageSize } = await getUserList({ search: params.search, page });
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kelola User</h1>
        <p className="text-sm text-muted-foreground">Total {total} pengguna terdaftar</p>
      </div>

      <SearchInput placeholder="Cari nama user..." />

      {users && users.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Bergabung</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-accent/5">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name} />
                      <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground">@{user.username ?? "-"}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <UserRoleSelect userId={user.id} role={user.role} />
                  </td>
                  <td className="px-4 py-3">
                    <UserActiveToggle userId={user.id} isActive={user.is_active} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(user.created_at), "dd MMM yyyy", { locale: idLocale })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <DeleteEntityButton
                        entityLabel="User"
                        entityName={user.full_name}
                        onDelete={deleteUserAction.bind(null, user.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Users} title="Belum ada user" description="Belum ada pengguna yang terdaftar." />
      )}

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
