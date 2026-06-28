"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Award } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { issueCertificateAction } from "@/lib/actions/certificate.actions";

interface EligibleStudent {
  user_id: string;
  course_id: string;
  profiles: { full_name: string } | null;
  courses: { title: string } | null;
}

export function IssueCertificateDialog({ eligibleStudents }: { eligibleStudents: EligibleStudent[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIssue = async () => {
    if (!selected) {
      toast.error("Pilih siswa terlebih dahulu.");
      return;
    }
    const [userId, courseId] = selected.split("::");

    setIsSubmitting(true);
    const result = await issueCertificateAction(userId, courseId);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient">
          <Plus className="h-4 w-4" /> Terbitkan Sertifikat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terbitkan Sertifikat</DialogTitle>
          <DialogDescription>Pilih siswa yang telah menyelesaikan kelas untuk menerbitkan sertifikat.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Siswa & Kelas</Label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="">Pilih siswa yang telah lulus</option>
              {eligibleStudents.map((s) => (
                <option key={`${s.user_id}-${s.course_id}`} value={`${s.user_id}::${s.course_id}`}>
                  {s.profiles?.full_name} — {s.courses?.title}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleIssue} variant="gradient" className="w-full" isLoading={isSubmitting}>
            <Award className="h-4 w-4" /> Terbitkan Sertifikat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
