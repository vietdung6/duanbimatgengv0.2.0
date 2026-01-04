"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/components/ui/ToastContext";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { AppProgressProvider as ProgressProvider, Progress } from "@bprogress/next";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <ProgressProvider height="6px" color="#AA8000" options={{ showSpinner: false }} shallowRouting>
              {children}
              <Progress />
            </ProgressProvider>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryProvider>
  );
}

