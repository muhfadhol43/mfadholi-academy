import { FileText, FileSpreadsheet, BookOpenCheck, Download as DownloadIcon } from "lucide-react";
import type { Download } from "@/types/database.types";

const typeIcons: Record<string, any> = {
  pdf: FileText,
  worksheet: FileSpreadsheet,
  vocab_sheet: BookOpenCheck,
};

const typeLabels: Record<string, string> = {
  pdf: "Ringkasan PDF",
  worksheet: "Worksheet",
  vocab_sheet: "Daftar Kosakata",
};

export function DownloadList({ downloads }: { downloads: Download[] }) {
  if (downloads.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada file unduhan untuk lesson ini.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {downloads.map((d) => {
        const Icon = typeIcons[d.type] ?? FileText;
        return (
          <a
            key={d.id}
            href={d.file_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-accent/5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">{d.title}</p>
              <p className="text-xs text-muted-foreground">{typeLabels[d.type]}</p>
            </div>
            <DownloadIcon className="h-4 w-4 text-muted-foreground" />
          </a>
        );
      })}
    </div>
  );
}
