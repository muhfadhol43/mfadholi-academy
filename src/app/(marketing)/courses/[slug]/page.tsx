import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Star, Clock, Users, BookOpen } from "lucide-react";
import { CourseCurriculum } from "@/components/course/course-curriculum";
import { EnrollButton } from "@/components/course/enroll-button";
import { getCourseBySlug, getCourseCurriculum } from "@/lib/actions/course.queries";
import { checkEnrollment } from "@/lib/actions/enrollment.actions";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};

  return {
    title: course.title,
    description: course.description,
    openGraph: { images: course.thumbnail_url ? [course.thumbnail_url] : [] },
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const [chapters, enrollment] = await Promise.all([
    getCourseCurriculum(course.id),
    checkEnrollment(course.id),
  ]);

  const firstLesson = chapters[0]?.lessons?.[0];
  const firstLessonHref = firstLesson ? `/courses/${course.slug}/lessons/${firstLesson.slug}` : undefined;

  return (
    <div className="container py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <span className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Level {course.level}
            </span>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="mt-2 text-muted-foreground">{course.description}</p>

            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">{course.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {course.total_students.toLocaleString("id-ID")} Siswa
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {course.duration_minutes} Menit
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" /> Sensei {course.sensei_name}
              </div>
            </div>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
            {course.thumbnail_url ? (
              <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-100 to-sakura-100 text-5xl font-bold text-primary/30">
                日本語
              </div>
            )}
          </div>

          <CourseCurriculum chapters={chapters} courseSlug={course.slug} isEnrolled={enrollment.isEnrolled} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4 rounded-2xl border border-border bg-card p-5">
            <p className="text-2xl font-bold">
              {course.is_premium ? `Rp ${course.price.toLocaleString("id-ID")}` : "Gratis"}
            </p>
            <EnrollButton
              courseId={course.id}
              isEnrolled={enrollment.isEnrolled}
              isPremium={course.is_premium}
              firstLessonHref={firstLessonHref}
            />
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Akses video pembelajaran berkualitas</li>
              <li>✓ Materi kosakata & grammar terstruktur</li>
              <li>✓ Latihan & quiz interaktif</li>
              <li>✓ Sertifikat setelah menyelesaikan kelas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
