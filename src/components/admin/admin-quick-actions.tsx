import Link from "next/link";
import { Plus, Upload, FileBarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminQuickActions() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold">Quick Action</h3>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="default" className="bg-indigo-600 hover:bg-indigo-700" asChild>
          <Link href="/admin/courses/new">
            <Plus className="h-4 w-4" /> Tambah Kelas
          </Link>
        </Button>
        <Button variant="default" className="bg-sky-600 hover:bg-sky-700" asChild>
          <Link href="/admin/lessons/new">
            <Plus className="h-4 w-4" /> Tambah Lesson
          </Link>
        </Button>
        <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700" asChild>
          <Link href="/admin/lessons">
            <Upload className="h-4 w-4" /> Upload Materi
          </Link>
        </Button>
        <Button variant="default" className="bg-orange-500 hover:bg-orange-600" asChild>
          <Link href="/admin/users">
            <FileBarChart className="h-4 w-4" /> Lihat Laporan
          </Link>
        </Button>
      </div>
    </div>
  );
}
