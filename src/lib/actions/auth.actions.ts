"use server";

import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  resetPasswordRequestSchema,
  resetPasswordConfirmSchema,
} from "@/lib/validations/auth.schema";
import { redirect } from "next/navigation";

type ActionResult = { success: boolean; message: string };

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    console.error("[loginAction] Supabase error:", error.message);
    return { success: false, message: `Gagal login: ${error.message}` };
  }

  return { success: true, message: "Login berhasil!" };
}

export async function registerAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    fullName: formData.get("fullName") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("[registerAction] Supabase error:", error.message);
    if (error.message.includes("already registered")) {
      return { success: false, message: "Email sudah terdaftar." };
    }
    return { success: false, message: `Gagal mendaftar: ${error.message}` };
  }

  return {
    success: true,
    message: "Pendaftaran berhasil! Silakan cek email untuk verifikasi.",
  };
}

export async function loginWithGoogleAction() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });

  if (error || !data.url) {
    return { success: false, message: "Gagal login dengan Google." };
  }

  redirect(data.url);
}

export async function requestResetPasswordAction(formData: FormData): Promise<ActionResult> {
  const raw = { email: formData.get("email") as string };
  const parsed = resetPasswordRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password/confirm`,
  });

  if (error) {
    return { success: false, message: "Gagal mengirim email reset password." };
  }

  return { success: true, message: "Link reset password telah dikirim ke email Anda." };
}

export async function confirmResetPasswordAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = resetPasswordConfirmSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { success: false, message: "Gagal mengubah password." };
  }

  return { success: true, message: "Password berhasil diubah." };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}