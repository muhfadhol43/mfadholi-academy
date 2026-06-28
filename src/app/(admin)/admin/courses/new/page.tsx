import { CourseForm } from "@/components/admin/course-form";

export const metadata = { title: "Tambah Kelas" };

export default function NewCoursePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tambah Kelas Baru</h1>
        <p className="text-sm text-muted-foreground">Lengkapi informasi kelas di bawah ini</p>
      </div>
      <CourseForm />
    </div>
  );
}
