"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/components/ui/ToastContext";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            {children}
            <ProgressBar
              height="4px"
              color="#d4af37"
              options={{ showSpinner: false }}
              shallowRouting
            />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryProvider>
  );
}

