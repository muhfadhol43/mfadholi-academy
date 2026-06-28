import { notFound } from "next/navigation";
import { FileText, Music } from "lucide-react";
import { LessonDocumentUploadForm, LessonAudioUploadForm } from "@/components/admin/lesson-media-upload-forms";
import { getLessonById } from "@/lib/actions/lesson.actions";

export const metadata = { title: "Materi Lesson" };

export default async function LessonDownloadsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await getLessonById(id);
  if (!lesson) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Materi: {lesson.title}</h1>
        <p className="text-sm text-muted-foreground">Kelola file PDF, worksheet, dan audio untuk lesson ini</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <LessonDocumentUploadForm lessonId={lesson.id} />
        <LessonAudioUploadForm lessonId={lesson.id} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4" /> Daftar File Tersimpan
        </h3>
        {lesson.downloads.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada file yang diupload.</p>
        ) : (
          <ul className="space-y-2">
            {lesson.downloads.map((d: any) => (
              <li key={d.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span>{d.title}</span>
                <a href={d.file_url} target="_blank" className="text-primary hover:underline">
                  Lihat File
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
