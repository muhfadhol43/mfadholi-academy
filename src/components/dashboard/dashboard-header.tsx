import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import type { Profile, Notification } from "@/types/database.types";

interface DashboardHeaderProps {
  profile: Profile;
  notifications: Notification[];
}

export function DashboardHeader({ profile, notifications }: DashboardHeaderProps) {
  const hour = new Date().getHours();
  const greeting = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div>
        <h1 className="text-xl font-bold">
          {greeting}, {profile.full_name.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground">Semangat belajar hari ini!</p>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard/history" className="hidden text-sm font-medium text-primary hover:underline md:block">
          Lihat Statistik
        </Link>
        <NotificationBell notifications={notifications} />
        <Link href="/settings">
          <Avatar>
            <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name} />
            <AvatarFallback>{profile.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
