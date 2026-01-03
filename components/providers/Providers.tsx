"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/components/ui/ToastContext";
import { QueryProvider } from "@/app/providers/QueryProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryProvider>
  );
}

