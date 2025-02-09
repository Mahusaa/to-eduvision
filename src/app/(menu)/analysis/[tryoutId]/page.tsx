import TestScoreVisualization from "~/components/analysis/summary-score";
import { auth } from "~/server/auth";
import { calculateCorrectIncorrect, getMeanScore, getUserScoreByTOandUserId } from "~/server/queries";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";



export interface DataItem {
  name: string;
  score?: string | null;
  correct: number;
  incorrect: number;
  meanScore?: string | null;
}

export default async function Page({
  params
}: {
  params: Promise<{ tryoutId: number }>
}) {
  const session = await auth();
  if (!session) return null;
  const tryoutId = (await params).tryoutId
  const userId = session.user.id;

  const [correctIncorrectResult, meanScoreResult, userScoreResult] = await Promise.all([
    calculateCorrectIncorrect(userId, tryoutId),
    getMeanScore(tryoutId),
    getUserScoreByTOandUserId(userId, tryoutId),
  ]);

  const data = [
    {
      name: "Penalaran Umum",
      score: userScoreResult?.puScore,
      correct: correctIncorrectResult.pu?.correct ?? 0,
      incorrect: correctIncorrectResult.pu?.incorrect ?? 0,
      meanScore: meanScoreResult?.puScore
    },
    {
      name: "Kemampuan Membaca dan Menulis",
      score: userScoreResult?.pbmScore,
      correct: correctIncorrectResult.pbm?.correct ?? 0,
      incorrect: correctIncorrectResult.pbm?.incorrect ?? 0,
      meanScore: meanScoreResult?.pbmScore
    },
    {
      name: "Pengetahuan dan Pemahaman Umum",
      score: userScoreResult?.ppuScore,
      correct: correctIncorrectResult.ppu?.correct ?? 0,
      incorrect: correctIncorrectResult.ppu?.incorrect ?? 0,
      meanScore: meanScoreResult?.ppuScore
    },
    {
      name: "Kemampuan Kuantitatif",
      score: userScoreResult?.kkScore,
      correct: correctIncorrectResult.kk?.correct ?? 0,
      incorrect: correctIncorrectResult.kk?.incorrect ?? 0,
      meanScore: meanScoreResult?.kkScore
    },
    {
      name: "Literasi Bahasa Indonesia",
      score: userScoreResult?.lbindScore,
      correct: correctIncorrectResult.lbind?.correct ?? 0,
      incorrect: correctIncorrectResult.lbind?.incorrect ?? 0,
      meanScore: meanScoreResult?.lbindScore
    },
    {
      name: "Literasi Bahasa Inggris",
      score: userScoreResult?.lbingScore,
      correct: correctIncorrectResult.lbing?.correct ?? 0,
      incorrect: correctIncorrectResult.lbing?.incorrect ?? 0,
      meanScore: meanScoreResult?.lbingScore
    },
    {
      name: "Penalaran Matematika",
      score: userScoreResult?.pmScore,
      correct: correctIncorrectResult.pm?.correct ?? 0,
      incorrect: correctIncorrectResult.pm?.incorrect ?? 0,
      meanScore: meanScoreResult?.pmScore
    }
  ];



  return (

    <div className="w-full mx-auto p-4 ">
      <Link href={"/dashboard"}>
        <Button
          variant="ghost"
          className="mb-3"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Back</Button>
      </Link>
      <TestScoreVisualization dataItem={data} />
    </div>
  )
}
