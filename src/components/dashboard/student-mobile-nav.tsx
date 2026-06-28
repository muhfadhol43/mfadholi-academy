"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Bookmark, Award, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const menu = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Kelas", href: "/dashboard/courses", icon: BookOpen },
  { title: "Bookmark", href: "/bookmarks", icon: Bookmark },
  { title: "Sertifikat", href: "/certificates", icon: Award },
  { title: "Setting", href: "/settings", icon: Settings },
];

export function StudentMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-between border-t border-border bg-card/95 px-2 py-2 backdrop-blur-lg md:hidden">
      {menu.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[10px] font-medium text-muted-foreground",
              isActive && "text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
