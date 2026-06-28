"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateUserRoleAction } from "@/lib/actions/user.actions";

export function UserRoleSelect({ userId, role }: { userId: string; role: "admin" | "student" }) {
  const router = useRouter();
  const [value, setValue] = useState(role);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (newRole: string) => {
    setIsUpdating(true);
    const result = await updateUserRoleAction(userId, newRole as "admin" | "student");
    setIsUpdating(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setValue(newRole as "admin" | "student");
    toast.success(result.message);
    router.refresh();
  };

  return (
    <Select value={value} onValueChange={handleChange} disabled={isUpdating}>
      <SelectTrigger className="h-8 w-28 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="student">Student</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
