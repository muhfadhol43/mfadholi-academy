"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface ThumbnailUploaderProps {
  name: string;
  defaultValue?: string | null;
  uploadAction: (file: File) => Promise<{ success: boolean; message: string; url?: string }>;
}

export function ThumbnailUploader({ name, defaultValue, uploadAction }: ThumbnailUploaderProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsUploading(true);
    const result = await uploadAction(file);
    setIsUploading(false);

    if (!result.success || !result.url) {
      toast.error(result.message);
      return;
    }

    setPreview(result.url);
  };

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={preview ?? ""} readOnly />
      <div
        onClick={() => inputRef.current?.click()}
        className="relative flex aspect-video w-full max-w-sm cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/40 hover:border-primary/50"
      >
        {isUploading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : preview ? (
          <>
            <Image src={preview} alt="Thumbnail" fill className="object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
              }}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <ImagePlus className="h-6 w-6" />
            <span className="text-xs">Klik untuk upload thumbnail</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
