import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("slug, updated_at")
    .eq("status", "published");

  const courseUrls = (courses ?? []).map((course) => ({
    url: `${siteConfig.url}/courses/${course.slug}`,
    lastModified: new Date(course.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/courses`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/register`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    ...courseUrls,
  ];
}
