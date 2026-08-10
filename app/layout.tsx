import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Syauqi Ashadullah — @qyzh",
  description: "Syauqi Ashadullah (@qyzh) — communication student from Sorowako, Indonesia. Into coffee, DotA, photography.",
  openGraph: {
    title: "Syauqi Ashadullah",
    description: "Syauqi Ashadullah (@qyzh) — communication student from Sorowako, Indonesia.",
    url: "https://kyxis.my.id",
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: "Syauqi Ashadullah",
    creator: "@asetdunia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased font-mono`}>
        <div className="noise-overlay"></div>
        {children}
      </body>
    </html>
  );
}
