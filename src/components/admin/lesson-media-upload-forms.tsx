"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, FileText, Music, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { uploadDocumentAction, addDownloadAction, addAudioAction } from "@/lib/actions/lesson.actions";

export function LessonDocumentUploadForm({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"pdf" | "worksheet" | "vocab_sheet">("pdf");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const result = await uploadDocumentAction(file, "pdf");
    setIsUploading(false);

    if (!result.success || !result.url) {
      toast.error(result.message);
      return;
    }
    setFileUrl(result.url);
    toast.success("PDF berhasil diupload.");
  };

  const handleSubmit = async () => {
    if (!fileUrl || !title) {
      toast.error("Judul dan file wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("lesson_id", lessonId);
    formData.append("title", title);
    formData.append("file_url", fileUrl);
    formData.append("type", type);

    const result = await addDownloadAction(formData);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setTitle("");
    setFileUrl(null);
    router.refresh();
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <FileText className="h-4 w-4" /> Upload PDF / Worksheet
      </h3>

      <div className="space-y-2">
        <Label>Judul File</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Worksheet Bab 1.pdf" />
      </div>

      <div className="space-y-2">
        <Label>Tipe File</Label>
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">Ringkasan PDF</SelectItem>
            <SelectItem value="worksheet">Worksheet</SelectItem>
            <SelectItem value="vocab_sheet">Daftar Kosakata</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>File PDF</Label>
        <div
          onClick={() => inputRef.current?.click()}
          className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/50"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : fileUrl ? (
            <span className="text-emerald-600">File berhasil diupload ✓</span>
          ) : (
            <>
              <Upload className="h-4 w-4" /> Klik untuk upload PDF
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
      </div>

      <Button onClick={handleSubmit} variant="gradient" className="w-full" isLoading={isSubmitting}>
        Simpan File
      </Button>
    </div>
  );
}

export function LessonAudioUploadForm({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const result = await uploadDocumentAction(file, "audio");
    setIsUploading(false);

    if (!result.success || !result.url) {
      toast.error(result.message);
      return;
    }
    setAudioUrl(result.url);
    toast.success("Audio berhasil diupload.");
  };

  const handleSubmit = async () => {
    if (!audioUrl || !title) {
      toast.error("Judul dan file wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("lesson_id", lessonId);
    formData.append("title", title);
    formData.append("audio_url", audioUrl);

    const result = await addAudioAction(formData);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setTitle("");
    setAudioUrl(null);
    router.refresh();
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Music className="h-4 w-4" /> Upload Audio
      </h3>

      <div className="space-y-2">
        <Label>Judul Audio</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Audio Latihan Bab 1" />
      </div>

      <div className="space-y-2">
        <Label>File Audio (MP3/WAV)</Label>
        <div
          onClick={() => inputRef.current?.click()}
          className="flex h-24 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/50"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : audioUrl ? (
            <span className="text-emerald-600">File berhasil diupload ✓</span>
          ) : (
            <>
              <Upload className="h-4 w-4" /> Klik untuk upload audio
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/wav"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
      </div>

      <Button onClick={handleSubmit} variant="gradient" className="w-full" isLoading={isSubmitting}>
        Simpan Audio
      </Button>
    </div>
  );
}
