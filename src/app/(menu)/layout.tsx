import "~/styles/globals.css";

import Header from "~/components/Header";
import { auth } from "~/server/auth";
import { Toaster } from "~/components/ui/toaster";

export default async function MenuLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  return (
    <section className="flex flex-col min-h-screen ">
      {/*@ts-expect-error: my User token.role doesnt define in my User */}
      <Header session={session} />
      {children}
      <Toaster />
    </section>
  );
}
