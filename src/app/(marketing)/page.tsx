import { Suspense } from "react";
import { HeroSection } from "@/components/landing/hero-section";
import { CategorySection } from "@/components/landing/category-section";
import { FeaturedCourseSection, LatestCourseSection } from "@/components/landing/course-sections";
import { LevelTabsSection } from "@/components/landing/level-tabs-section";
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { CourseCardSkeleton } from "@/components/course/course-card-skeleton";

function CourseSectionSkeleton() {
  return (
    <div className="container py-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <Suspense fallback={<CourseSectionSkeleton />}>
        <FeaturedCourseSection />
      </Suspense>
      <LevelTabsSection />
      <Suspense fallback={<CourseSectionSkeleton />}>
        <LatestCourseSection />
      </Suspense>
      <TestimonialSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
