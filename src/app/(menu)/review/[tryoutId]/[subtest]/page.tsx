import { auth } from "~/server/auth";
import { getAllProblemStatistic, getAnswerKeyArray, getQuestionAnswerData, getSpesificUserAnswer } from "~/server/queries";
import TryoutReview from "~/components/TryoutReview";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";



type Params = Promise<{ subtest: string; tryoutId: number }>

export default async function Page(props: { params: Params }) {
  const session = await auth();
  if (!session) return null;
  const userId = session.user.id
  const params = await props.params;
  const subtest = params.subtest;
  const tryoutId = params.tryoutId
  const [reviewData, userData, answerKeyData, problemStats] = await Promise.all([
    getQuestionAnswerData(tryoutId, subtest),
    getSpesificUserAnswer(userId, tryoutId, subtest),
    getAnswerKeyArray(tryoutId, subtest),
    getAllProblemStatistic(tryoutId, subtest)
  ]);

  const userAnswerArray = userData?.answerArray?.split(',') ?? [];
  const { answerArray } = answerKeyData;


  return (
    <div className="w-full mx-auto p-4">
      <Link href={"/edit/tryout"}>
        <Button
          variant="ghost"
          className="mb-3"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Back</Button>
      </Link>
      <TryoutReview
        reviewData={reviewData}
        userAnswerArray={userAnswerArray}
        answerKeyArray={answerArray}
        questionCalculation={problemStats}
        tryoutId={tryoutId}
        subtest={subtest}
      />
    </div>
  )
}
