import Leaderboard from "~/components/leaderboard/Leaderboard";
import { LeaderboardEntryType } from "~/components/leaderboard/LeaderboardEntry";
import { getAllUserScore } from "~/server/queries";

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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-primary mb-4 sm:mb-8">Leaderboard Tryout</h1>
        <p className="text-center text-gray-600 mb-6 sm:mb-8 px-4">
          View top performers across 7 subtests. Sort by average score or individual subtest scores.
        </p>
          <Leaderboard data={leaderboardData}/>
      </div>
    </main>
  )
}


