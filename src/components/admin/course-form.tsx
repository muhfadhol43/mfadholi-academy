"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbnailUploader } from "@/components/admin/thumbnail-uploader";
import { courseSchema, type CourseInput } from "@/lib/validations/course.schema";
import { createCourseAction, updateCourseAction, uploadThumbnailAction } from "@/lib/actions/course.actions";
import type { Course } from "@/types/database.types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function CourseForm({ course }: { course?: Course }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseInput>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          title: course.title,
          slug: course.slug,
          description: course.description,
          level: course.level,
          sensei_name: course.sensei_name,
          duration_minutes: course.duration_minutes,
          price: course.price,
          is_premium: course.is_premium,
          status: course.status,
          thumbnail_url: course.thumbnail_url,
        }
      : {
          level: "N5",
          status: "draft",
          is_premium: false,
          duration_minutes: 0,
          price: 0,
        },
  });

  const titleValue = watch("title");

  const onSubmit = async (values: CourseInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "is_premium") {
        if (value) formData.append("is_premium", "on");
      } else {
        formData.append(key, String(value ?? ""));
      }
    });

    const result = course
      ? await updateCourseAction(course.id, formData)
      : await createCourseAction(formData);

    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.push("/admin/courses");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Kelas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Thumbnail Kelas</Label>
            <ThumbnailUploader
              name="thumbnail_url"
              defaultValue={course?.thumbnail_url}
              uploadAction={uploadThumbnailAction}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Judul Kelas</Label>
            <Input
              id="title"
              {...register("title")}
              onBlur={(e) => {
                if (!course) setValue("slug", slugify(e.target.value));
              }}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" {...register("slug")} placeholder="contoh-judul-kelas" />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" rows={4} {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Level JLPT</Label>
              <Controller
                control={control}
                name="level"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["N5", "N4", "N3", "N2", "N1"].map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sensei_name">Nama Sensei</Label>
              <Input id="sensei_name" {...register("sensei_name")} />
              {errors.sensei_name && <p className="text-xs text-destructive">{errors.sensei_name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Durasi (Menit)</Label>
              <Input id="duration_minutes" type="number" {...register("duration_minutes")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input id="price" type="number" {...register("price")} />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <Label htmlFor="is_premium" className="cursor-pointer">
                Kelas Premium
              </Label>
              <Controller
                control={control}
                name="is_premium"
                render={({ field }) => (
                  <Switch id="is_premium" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/courses")}>
          Batal
        </Button>
        <Button type="submit" variant="gradient" isLoading={isSubmitting}>
          {course ? "Simpan Perubahan" : "Buat Kelas"}
        </Button>
      </div>
    </form>
  );
}
