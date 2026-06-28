"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/database.types";

export function NotificationBell({ notifications }: { notifications: Notification[] }) {
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="relative rounded-full p-2 hover:bg-accent/10">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 rounded-xl border border-border bg-popover p-2 shadow-lg"
        >
          <p className="px-2 py-1.5 text-sm font-semibold">Notifikasi</p>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">Belum ada notifikasi.</p>
            ) : (
              notifications.map((n) => (
                <DropdownMenu.Item
                  key={n.id}
                  className={cn(
                    "cursor-pointer rounded-lg px-2 py-2 text-sm outline-none hover:bg-accent/10",
                    !n.is_read && "bg-primary/5"
                  )}
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </DropdownMenu.Item>
              ))
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
