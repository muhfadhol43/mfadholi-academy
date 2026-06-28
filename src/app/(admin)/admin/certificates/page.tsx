import { Award } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { DeleteEntityButton } from "@/components/admin/delete-entity-button";
import { IssueCertificateDialog } from "@/components/admin/issue-certificate-dialog";
import {
  getAllCertificates,
  getEligibleStudentsForCertificate,
  deleteCertificateAction,
} from "@/lib/actions/certificate.actions";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const metadata = { title: "Kelola Sertifikat" };

export default async function AdminCertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const [{ certificates, total, pageSize }, eligibleStudents] = await Promise.all([
    getAllCertificates({ page }),
    getEligibleStudentsForCertificate(),
  ]);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kelola Sertifikat</h1>
          <p className="text-sm text-muted-foreground">Total {total} sertifikat telah diterbitkan</p>
        </div>
        <IssueCertificateDialog eligibleStudents={eligibleStudents as any} />
      </div>

      {certificates && certificates.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">Siswa</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">No. Sertifikat</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert: any) => (
                <tr key={cert.id} className="border-b border-border last:border-0 hover:bg-accent/5">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={cert.profiles?.avatar_url ?? undefined} />
                      <AvatarFallback>{cert.profiles?.full_name?.charAt(0) ?? "?"}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{cert.profiles?.full_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    {cert.courses?.title} <span className="text-xs text-muted-foreground">({cert.courses?.level})</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{cert.certificate_number}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(cert.issued_at), "dd MMM yyyy", { locale: idLocale })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <DeleteEntityButton
                        entityLabel="Sertifikat"
                        entityName={cert.certificate_number}
                        onDelete={deleteCertificateAction.bind(null, cert.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon={Award} title="Belum ada sertifikat" description="Terbitkan sertifikat untuk siswa yang sudah lulus." />
      )}

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
