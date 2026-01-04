import type { Metadata, Viewport } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import "@bprogress/core/dist/index.css"; // Import core styles locally to ensure production build includes them
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/providers/Providers";
import FloatingSearchButton from "@/components/search/FloatingSearchButton";
import { headers, cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAuthToken, isStaff } from "@/lib/auth";
import MaintenancePage from "./maintenance/page";
import NotFoundPage from "@/app/not-found";
import ConsoleEasterEgg from "@/components/layout/ConsoleEasterEgg";
import HoneyPot from "@/components/layout/HoneyPot";

// Oswald supports Vietnamese better than Bebas Neue
const oswald = Oswald({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#FFD700",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Gen.G Fandom | League of Legends",
  description: "The ultimate fan destination for Gen.G Esports League of Legends team. Stats, news, and community.",
  keywords: ["Gen.G", "Esports", "League of Legends", "Chovy", "LCK", "Fandom"],
  icons: {
    icon: "/images/genrang_emote.png",
    shortcut: "/images/genrang_emote.png",
    apple: "/images/genrang_emote.png",
  },
};

export const dynamic = "force-dynamic"; // Ensure config is fetched fresh

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // 1. Check Maintenance Mode
  let isMaintenance = false;
  try {
    if (prisma.systemConfig) {
      const config = await prisma.systemConfig.findUnique({
        where: { key: "maintenance_mode" }
      });
      isMaintenance = config?.value === "true";
    }
  } catch (e) {
    console.error("Layout Config Error:", e);
  }

  // Security: Portal Login is ONLY available during Maintenance Mode
  // If Maintenance is OFF, hide this page completely (404)
  if (!isMaintenance && pathname.startsWith("/portal-login")) {
    return (
      <html lang="en" className={`${oswald.variable} ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
        <body className="min-h-screen flex flex-col items-center justify-center bg-black" suppressHydrationWarning>
          <Providers>
            <NotFoundPage />
          </Providers>
        </body>
      </html>
    );
  }



  // 2. Allow Admin/Staff Bypass
  let authorized = false;
  if (isMaintenance) {
    const cookieStore = await cookies();
    const token = cookieStore.get("geng_auth")?.value;
    if (token) {
      const user = verifyAuthToken(token);
      if (isStaff(user)) {
        authorized = true;
      }
    }
  }

  // 3. Block conditions
  // Block /login during maintenance (so users can't login via main gate)
  // Allow /portal-login (Backdoor for admins)
  // Don't block /maintenance (to avoid loop)
  // Allow /api (mostly) and static assets
  const isProtectedPath = !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".") &&
    pathname !== "/maintenance" &&
    !pathname.startsWith("/portal-login"); // Allow Backdoor

  // 4. Determine restriction type
  // If user has token but is NOT authorized (i.e. not staff), show "Access Denied" message
  const cookieStore = await cookies();
  const token = cookieStore.get("geng_auth")?.value;
  const isLoggedIn = !!token;
  const restrictedAccess = isLoggedIn && !authorized;

  if (isMaintenance && !authorized && isProtectedPath) {
    return (
      <html lang="en" className={`${oswald.variable} ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
        <body className="min-h-screen flex flex-col items-center justify-center bg-black" suppressHydrationWarning>
          <MaintenancePage restrictedAccess={restrictedAccess} />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>
          <HoneyPot />
          <ConsoleEasterEgg />
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <FloatingSearchButton />
        </Providers>

      </body>
    </html>
  );
}
