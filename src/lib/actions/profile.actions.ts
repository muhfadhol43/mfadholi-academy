"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/validations/profile.schema";

type ActionResult = { success: boolean; message: string };

export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Anda harus login." };

  const raw = {
    fullName: formData.get("fullName") as string,
    username: (formData.get("username") as string) ?? "",
    bio: (formData.get("bio") as string) ?? "",
  };

  const parsed = updateProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      username: parsed.data.username || null,
      bio: parsed.data.bio || null,
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, message: error.message.includes("duplicate") ? "Username sudah digunakan." : "Gagal memperbarui profil." };
  }

  revalidatePath("/settings");
  return { success: true, message: "Profil berhasil diperbarui." };
}

export async function uploadAvatarAction(file: File): Promise<ActionResult & { url?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Anda harus login." };

  const ext = file.name.split(".").pop();
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
    upsert: true,
  });

  if (uploadError) {
    return { success: false, message: "Gagal mengupload avatar." };
  }

  const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrlData.publicUrl })
    .eq("id", user.id);

  if (updateError) {
    return { success: false, message: "Gagal menyimpan avatar." };
  }

  revalidatePath("/settings");
  return { success: true, message: "Avatar berhasil diperbarui.", url: publicUrlData.publicUrl };
}
