"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  resetPasswordRequestSchema,
  type ResetPasswordRequestInput,
} from "@/lib/validations/auth.schema";
import { requestResetPasswordAction } from "@/lib/actions/auth.actions";

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordRequestInput>({ resolver: zodResolver(resetPasswordRequestSchema) });

  const onSubmit = async (values: ResetPasswordRequestInput) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("email", values.email);

    const result = await requestResetPasswordAction(formData);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sakura-50 p-4 dark:from-background dark:via-background dark:to-background">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-6 flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">
            Mfadholi<span className="text-primary">.Dev</span> Academy
          </span>
        </div>

        <Card className="border-border/60 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle>Lupa Password?</CardTitle>
            <CardDescription>
              {sent
                ? "Silakan cek email Anda untuk link reset password."
                : "Masukkan email Anda, kami akan mengirimkan link reset password."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!sent && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      className="pl-9"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <Button type="submit" variant="gradient" className="w-full" isLoading={isSubmitting}>
                  Kirim Link Reset Password
                </Button>
              </form>
            )}

            <Link
              href="/login"
              className="flex items-center justify-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke halaman masuk
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
