"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm hover:bg-accent/10",
          currentPage === 1 && "pointer-events-none opacity-40"
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {pages.map((page, idx) => (
        <React.Fragment key={page}>
          {idx > 0 && pages[idx - 1] !== page - 1 && <span className="px-1 text-muted-foreground">...</span>}
          <Link
            href={buildHref(page)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium",
              page === currentPage ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent/10"
            )}
          >
            {page}
          </Link>
        </React.Fragment>
      ))}

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-sm hover:bg-accent/10",
          currentPage === totalPages && "pointer-events-none opacity-40"
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
