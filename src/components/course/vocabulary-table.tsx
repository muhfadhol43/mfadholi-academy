"use client";

import { Volume2 } from "lucide-react";
import type { Vocabulary } from "@/types/database.types";

export function VocabularyTable({ vocabularies }: { vocabularies: Vocabulary[] }) {
  const playAudio = (url: string | null) => {
    if (!url) return;
    new Audio(url).play();
  };

  if (vocabularies.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada kosakata untuk lesson ini.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
            <th className="px-4 py-3">Jepang</th>
            <th className="px-4 py-3">Hiragana</th>
            <th className="px-4 py-3">Arti</th>
            <th className="px-4 py-3">Audio</th>
          </tr>
        </thead>
        <tbody>
          {vocabularies.map((v) => (
            <tr key={v.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-japanese text-lg">{v.kanji || v.hiragana}</td>
              <td className="px-4 py-3 text-muted-foreground">{v.hiragana}</td>
              <td className="px-4 py-3">{v.meaning_id}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => playAudio(v.audio_url)}
                  disabled={!v.audio_url}
                  className="rounded-full bg-primary/10 p-1.5 text-primary disabled:opacity-30"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
