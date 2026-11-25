import type { Metadata } from "next";
import { EB_Garamond, JetBrains_Mono, Silkscreen } from "next/font/google";
import { site } from "@/lib/content";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Heading face for the library theme.
const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Pixel heading face for the d2 theme (matches d2.thisnot.my.id).
const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "THIS NOT MY ID",
  description: "thisnot.my.id — select a chapter: dir-diare, ukbook, personal-d2.",
  openGraph: {
    title: "THIS NOT MY ID",
    description: "thisnot.my.id — select a chapter: dir-diare, ukbook, personal-d2.",
    url: "https://thisnot.my.id",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "THIS NOT MY ID",
    creator: "@asetdunia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={site.chapters[0].theme}
      className={`${jetbrainsMono.variable} ${garamond.variable} ${silkscreen.variable}`}
    >
      <body className="antialiased font-mono">
        {children}
      </body>
    </html>
  );
}
