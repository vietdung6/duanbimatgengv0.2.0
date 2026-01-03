"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface MeResponse {
  user: unknown | null;
}

export function useRequireLogin(): boolean {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) {
          router.push(`/login?from=${encodeURIComponent(pathname)}`);
          return;
        }
        const data = (await res.json()) as MeResponse;
        if (!data.user) {
          router.push(`/login?from=${encodeURIComponent(pathname)}`);
          return;
        }
        if (!cancelled) {
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          router.push(`/login?from=${encodeURIComponent(pathname)}`);
        }
      }
    }

    void check();

    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  return ready;
}

