import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/providers/Providers";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


