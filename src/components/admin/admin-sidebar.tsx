"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  FileText,
  Type,
  BookText,
  HelpCircle,
  Users,
  MessageSquare,
  Award,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth.actions";

const menu = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Kelas", href: "/admin/courses", icon: BookOpen },
  { title: "Chapter", href: "/admin/chapters", icon: Layers },
  { title: "Lesson", href: "/admin/lessons", icon: FileText },
  { title: "Kosakata", href: "/admin/vocabularies", icon: Type },
  { title: "Grammar", href: "/admin/grammars", icon: BookText },
  { title: "Quiz", href: "/admin/quizzes", icon: HelpCircle },
  { title: "User", href: "/admin/users", icon: Users },
  { title: "Komentar", href: "/admin/comments", icon: MessageSquare },
  { title: "Sertifikat", href: "/admin/certificates", icon: Award },
  { title: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-[#0f1117] text-white md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <span className="text-sm font-bold leading-tight">
          Mfadholi<span className="text-primary">.Dev</span>
          <span className="block text-[10px] font-medium text-white/50">Academy Admin</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menu.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white",
                isActive && "text-white"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="admin-sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <item.icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
