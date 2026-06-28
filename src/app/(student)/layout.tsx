import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StudentSidebar } from "@/components/dashboard/student-sidebar";
import { StudentMobileNav } from "@/components/dashboard/student-mobile-nav";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="flex min-h-screen bg-muted/20">
      <StudentSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader profile={profile} notifications={notifications ?? []} />
        <main className="flex-1 p-6 pb-24 md:pb-6">{children}</main>
      </div>
      <StudentMobileNav />
    </div>
  );
}
