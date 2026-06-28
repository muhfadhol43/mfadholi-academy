import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoPlayer } from "@/components/course/video-player";
import { AudioPlayer } from "@/components/course/audio-player";
import { VocabularyTable } from "@/components/course/vocabulary-table";
import { GrammarList } from "@/components/course/grammar-list";
import { DownloadList } from "@/components/course/download-list";
import { CommentSection } from "@/components/course/comment-section";
import { BookmarkButton } from "@/components/course/bookmark-button";
import { MarkCompleteButton } from "@/components/course/mark-complete-button";
import { LessonNav } from "@/components/course/lesson-nav";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import {
  getLessonDetail,
  getLessonComments,
  getLessonProgressStatus,
  getBookmarkStatus,
} from "@/lib/actions/lesson.queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;
  const data = await getLessonDetail(slug, lessonSlug);
  return { title: data?.lesson.title ?? "Lesson" };
}

export default async function LessonLearningPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug, lessonSlug } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=/courses/${slug}/lessons/${lessonSlug}`);

  const data = await getLessonDetail(slug, lessonSlug);
  if (!data) notFound();

  const { course, lesson, quiz, prevLesson, nextLesson } = data;

  // Access guard: must be enrolled or lesson is free preview
  const { data: enrollment } = await supabase
    .from("course_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .maybeSingle();

  if (!enrollment && !lesson.is_free_preview) {
    redirect(`/courses/${slug}`);
  }

  const [comments, progress, isBookmarked] = await Promise.all([
    getLessonComments(lesson.id),
    getLessonProgressStatus(user.id, lesson.id),
    getBookmarkStatus(user.id, lesson.id),
  ]);

  const video = lesson.lesson_videos?.[0];

  return (
    <div className="container max-w-5xl py-8">
      <Link href={`/courses/${course.slug}`} className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Kelas Saya / {course.title} / {lesson.title}
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">
            {lesson.chapters?.title} &middot; {lesson.duration_minutes} Menit &middot; Sensei {course.sensei_name}
          </p>
        </div>
        <div className="flex gap-2">
          <BookmarkButton lessonId={lesson.id} initialBookmarked={isBookmarked} />
          <MarkCompleteButton lessonId={lesson.id} courseId={course.id} isCompleted={progress?.is_completed ?? false} />
        </div>
      </div>

      {video ? (
        <VideoPlayer youtubeId={video.youtube_id} />
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          Belum ada video untuk lesson ini.
        </div>
      )}

      <div className="mt-6">
        <Tabs defaultValue="ringkasan">
          <TabsList className="flex-wrap">
            <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
            <TabsTrigger value="kosakata">Kosakata</TabsTrigger>
            <TabsTrigger value="grammar">Grammar</TabsTrigger>
            <TabsTrigger value="contoh">Contoh Kalimat</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="quiz">Latihan / Quiz</TabsTrigger>
            <TabsTrigger value="download">Download</TabsTrigger>
            <TabsTrigger value="komentar">Komentar</TabsTrigger>
          </TabsList>

          <TabsContent value="ringkasan">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {lesson.summary || "Belum ada ringkasan materi untuk lesson ini."}
            </p>
          </TabsContent>

          <TabsContent value="kosakata">
            <VocabularyTable vocabularies={lesson.vocabularies ?? []} />
          </TabsContent>

          <TabsContent value="grammar">
            <GrammarList grammars={lesson.grammars ?? []} />
          </TabsContent>

          <TabsContent value="contoh">
            {(lesson.grammars ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada contoh kalimat.</p>
            ) : (
              <div className="space-y-3">
                {lesson.grammars.map((g: any) => (
                  <div key={g.id} className="rounded-xl bg-muted/30 p-3">
                    <p className="font-japanese">{g.example_sentence_jp}</p>
                    <p className="text-sm text-muted-foreground">{g.example_sentence_id}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="audio">
            {(lesson.lesson_audios ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada audio untuk lesson ini.</p>
            ) : (
              <div className="space-y-3">
                {lesson.lesson_audios.map((a: any) => (
                  <AudioPlayer key={a.id} title={a.title} src={a.audio_url} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quiz">
            {quiz ? (
              <QuizPlayer quiz={quiz as any} lessonId={lesson.id} courseId={course.id} />
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada quiz untuk lesson ini.</p>
            )}
          </TabsContent>

          <TabsContent value="download">
            <DownloadList downloads={lesson.downloads ?? []} />
          </TabsContent>

          <TabsContent value="komentar">
            <CommentSection lessonId={lesson.id} comments={comments as any} />
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-8">
        <LessonNav courseSlug={course.slug} prevLesson={prevLesson} nextLesson={nextLesson} />
      </div>
    </div>
  );
}
