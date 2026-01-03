"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useRequireLogin } from "@/lib/auth/useRequireLogin";
import Loading from "@/components/ui/Loading";

interface LoginCheckProps {
  children: React.ReactNode;
}

export function LoginCheck({ children }: LoginCheckProps) {
  const { language } = useLanguage();
  const ready = useRequireLogin();

  if (!ready) {
    return <Loading />;
  }

  return <>{children}</>;
}
