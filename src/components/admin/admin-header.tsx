import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Profile } from "@/types/database.types";

export function AdminHeader({ profile }: { profile: Profile }) {
  return (
    <header className="flex items-center justify-end border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold">{profile.full_name}</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <Avatar>
          <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name} />
          <AvatarFallback>{profile.full_name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
