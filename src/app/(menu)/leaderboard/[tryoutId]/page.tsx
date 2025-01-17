import Leaderboard from "~/components/leaderboard/Leaderboard";
import type { LeaderboardEntryType } from "~/components/leaderboard/LeaderboardEntry";
import { getAllUserScore } from "~/server/queries";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Params = Promise<{ tryoutId: number }>
export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const tryoutId = params.tryoutId;
  const allUserScore = await getAllUserScore(tryoutId)
  const leaderboardData: LeaderboardEntryType[] = allUserScore.map((user, index) => ({
    id: index + 1, // Assign a unique ID (can also use user.userId if it's unique)
    name: user.userName,
    scores: [
      parseInt(user.puScore ?? "0", 10),
      parseInt(user.pbmScore ?? "0", 10),
      parseInt(user.ppuScore ?? "0", 10),
      parseInt(user.kkScore ?? "0", 10),
      parseInt(user.lbindScore ?? "0", 10),
      parseInt(user.lbingScore ?? "0", 10),
      parseInt(user.pmScore ?? "0", 10),
    ],
  }));
  return (
    <main className="min-h-screen bg-white  px-4  sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className="mb-3 text-gray-700 hover:text-gray-900 px-0"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#1855F3] mb-4 sm:mb-6">
          Leaderboard Tryout
        </h1>
        <p className="text-center text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
          View top performers across 7 subtests. Sort by average score or individual subtest scores.
        </p>
        <div className="bg-[#1855F3] rounded-lg p-6">
          <Leaderboard data={leaderboardData} />
        </div>
      </div>
    </main>
  )
}


