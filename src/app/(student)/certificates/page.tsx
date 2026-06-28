import Image from "next/image";
import { Award, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { getMyCertificates } from "@/lib/actions/student.queries";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const metadata = { title: "Sertifikat" };

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const certificates = await getMyCertificates(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sertifikat Saya</h1>
        <p className="text-sm text-muted-foreground">Kumpulan sertifikat dari kelas yang telah Anda selesaikan</p>
      </div>

      {certificates.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Award className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">Selesaikan sebuah kelas untuk mendapatkan sertifikat.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert: any) => (
            <div key={cert.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-indigo-600 to-sakura-500 p-6 text-center text-white">
                <div>
                  <Award className="mx-auto mb-2 h-8 w-8" />
                  <p className="text-sm font-bold leading-tight">{cert.courses?.title}</p>
                  <p className="mt-1 text-xs opacity-80">No. {cert.certificate_number}</p>
                </div>
              </div>
              <div className="space-y-3 p-4">
                <p className="text-xs text-muted-foreground">
                  Diterbitkan: {format(new Date(cert.issued_at), "dd MMMM yyyy", { locale: idLocale })}
                </p>
                <Button size="sm" variant="outline" className="w-full" disabled={!cert.certificate_url}>
                  <Download className="h-4 w-4" /> Unduh Sertifikat
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
