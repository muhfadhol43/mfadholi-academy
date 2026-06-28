"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { toggleUserActiveAction } from "@/lib/actions/user.actions";

export function UserActiveToggle({ userId, isActive }: { userId: string; isActive: boolean }) {
  const router = useRouter();
  const [checked, setChecked] = useState(isActive);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (value: boolean) => {
    setIsUpdating(true);
    const result = await toggleUserActiveAction(userId, value);
    setIsUpdating(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setChecked(value);
    toast.success(result.message);
    router.refresh();
  };

  return <Switch checked={checked} onCheckedChange={handleChange} disabled={isUpdating} />;
}
