import { createClient } from "@/lib/supabase/server";
import { MyCoursesGrid } from "@/components/dashboard/my-courses-grid";
import { getMyEnrolledCourses } from "@/lib/actions/student.queries";

export const metadata = { title: "Kelas Saya" };

export default async function MyCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const courses = await getMyEnrolledCourses(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kelas Saya</h1>
        <p className="text-sm text-muted-foreground">Semua kelas yang sedang dan telah Anda ikuti</p>
      </div>
      <MyCoursesGrid items={courses as any} />
    </div>
  );
}
