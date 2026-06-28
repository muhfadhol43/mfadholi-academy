import type { Grammar } from "@/types/database.types";

export function GrammarList({ grammars }: { grammars: Grammar[] }) {
  if (grammars.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada materi grammar untuk lesson ini.</p>;
  }

  return (
    <div className="space-y-4">
      {grammars.map((g) => (
        <div key={g.id} className="rounded-xl border border-border p-4">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{g.pattern}</span>
          <p className="mt-2 text-sm text-muted-foreground">{g.explanation}</p>
          <div className="mt-3 space-y-1 rounded-lg bg-muted/40 p-3">
            <p className="font-japanese text-base">{g.example_sentence_jp}</p>
            <p className="text-sm text-muted-foreground">{g.example_sentence_id}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
