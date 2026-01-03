"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export function useRequireAdmin(): boolean {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login?from=/admin");
      return;
    }

    if (user.role !== "admin") {
      router.push("/"); // Redirect non-admins to home
      return;
    }

    setReady(true);
  }, [user, loading, router]);

  return ready;
}
