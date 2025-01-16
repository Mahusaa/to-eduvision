import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tryout Eduvision | Platform Belajar menuju SNBT 2025",
  description: "Mau lolos PTN impian? EduVision siap jadi partner belajar kamu! Dengan tutor kece, metode belajar anti boring, dan tips UTBK yang relatable banget, EduVision bikin belajar jadi lebih seru dan maksimal.",
  icons: [{ rel: "icon", url: "/favicons.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex flex-col h-screen ">
        {children}
      </body>
    </html>
  );
}
