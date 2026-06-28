import { notFound } from "next/navigation";
import Link from "next/link";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseForm } from "@/components/admin/course-form";
import { getAdminCourseById } from "@/lib/actions/course.actions";

export const metadata = { title: "Edit Kelas" };

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getAdminCourseById(id);

  if (!course) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Kelas</h1>
          <p className="text-sm text-muted-foreground">{course.title}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/admin/chapters?course_id=${course.id}`}>
            <Layers className="h-4 w-4" /> Kelola Chapter & Lesson
          </Link>
        </Button>
      </div>
      <CourseForm course={course} />
    </div>
  );
}
