import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24  ">
      <h1 className="text-4xl font-bold mb-8">Welcome to Eduvision Tryout Platform</h1>
      <p className="text-xl mb-8">Prepare for your UTBK with our comprehensive tryout system</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard">Get Started<ArrowRight className="w-4 h-4" /></Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-in">Login</Link>
        </Button>
      </div>
    </main>);
}
