"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { CourseCard } from "@/components/course/course-card";
import { CourseCardSkeleton } from "@/components/course/course-card-skeleton";
import { cn } from "@/lib/utils";
import type { Course, CourseLevel } from "@/types/database.types";

const levels: CourseLevel[] = ["N5", "N4", "N3"];

export function LevelTabsSection() {
  const [activeLevel, setActiveLevel] = useState<CourseLevel>("N5");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchCourses = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("status", "published")
        .eq("level", activeLevel)
        .order("rating", { ascending: false })
        .limit(4);

      if (isMounted) {
        setCourses(data ?? []);
        setIsLoading(false);
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [activeLevel]);

  return (
    <section className="bg-muted/30 py-16">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Jelajahi Berdasarkan Level JLPT</h2>
          <p className="mt-2 text-muted-foreground">Pilih level yang sesuai dengan kemampuanmu saat ini</p>
        </div>

        <div className="mb-8 flex justify-center gap-2">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={cn(
                "rounded-full px-6 py-2 text-sm font-semibold transition-colors",
                activeLevel === level
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-background text-muted-foreground hover:bg-accent/10"
              )}
            >
              Level {level}
            </button>
          ))}
        </div>

        <motion.div
          key={activeLevel}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
            : courses.length > 0
              ? courses.map((course) => <CourseCard key={course.id} course={course} />)
              : (
                <div className="col-span-full rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
                  Belum ada kelas untuk level {activeLevel}.
                </div>
              )}
        </motion.div>
      </div>
    </section>
  );
}
