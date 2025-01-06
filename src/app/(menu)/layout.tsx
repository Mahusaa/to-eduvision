import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Header from "~/components/Header";
import { auth } from "~/server/auth";
import { Toaster } from "~/components/ui/toaster";

export const metadata: Metadata = {
  title: "Tryout Eduvision | Platform Belajar menuju SNBT 2025",
  description: "Mau lolos PTN impian? EduVision siap jadi partner belajar kamu! Dengan tutor kece, metode belajar anti boring, dan tips UTBK yang relatable banget, EduVision bikin belajar jadi lebih seru dan maksimal.",
  icons: [{ rel: "icon", url: "/favicons.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex flex-col h-screen bg-gradient-to-b from-white to-blue-50 ">
        {/*@ts-expect-error: my User token.role doesnt define in my User */}
        <Header session={session} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
