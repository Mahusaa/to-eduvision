import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Eduvision",
  description: "Eduvision Tryout",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  if (!session) redirect("/sign-in")
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex flex-col h-screen">
        {children}
      </body>
    </html>
  );
}
