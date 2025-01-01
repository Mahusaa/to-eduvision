import Link from "next/link";
import { Button } from "~/components/ui/button";
import { getAnswerKeyArray, getUserAnswerBySubtest } from "~/server/queries";

export default async function HomePage() {
  const answer = await getAnswerKeyArray(7, "kk")
  const answerUser = await getUserAnswerBySubtest(9, "pu")
  const formattedData = answerUser.map(item => ({
    userId: item.userId,
    name: item.name,
    answers: item.answer ? item.answer.split(",") : []
  }));

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Tryout Platform</h1>
      <p className="text-xl mb-8">Prepare for your UTBK with our comprehensive tryout system</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/dashboard">Start Tryout</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-in">Login</Link>
        </Button>
        {JSON.stringify(formattedData, null, 2)}
      </div>
    </main>);
}
