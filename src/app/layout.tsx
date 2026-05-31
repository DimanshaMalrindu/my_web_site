import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getProfile, getSettings } from "@/lib/content";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const jbMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: { default: settings.siteTitle, template: `%s — ${settings.siteTitle.split("—")[0].trim()}` },
    description: settings.siteDescription,
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      type: "website",
      images: settings.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
    twitter: { card: "summary_large_image" },
    icons: { icon: "/favicon.ico" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  const accent = profile.accentColor || "#0ea5e9";
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jbMono.variable}`}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--accent:${accent};--accent-foreground:#fff;}`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
