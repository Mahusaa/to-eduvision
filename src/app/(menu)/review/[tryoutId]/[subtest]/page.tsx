import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { getAllProblemStatistic, getAnswerKeyArray, getQuestionAnswerData, getSpesificUserAnswer } from "~/server/queries";
import TryoutReview from "~/components/TryoutReview";



type Params = Promise<{ subtest: string; tryoutId: number }>

export default async function Page(props: { params: Params }) {
  const session = await auth();
  if (!session) return redirect("sign-in")
  const userId = session.user.id
  const params = await props.params;
  const subtest = params.subtest;
  const tryoutId = params.tryoutId
  const reviewData = await getQuestionAnswerData(tryoutId, subtest);
  const userData = await getSpesificUserAnswer(userId, tryoutId, subtest)
  const userAnswerArray = userData?.answerArray?.split(',') ?? [];
  const { answerArray } = await getAnswerKeyArray(tryoutId, subtest)
  const problemStats = await getAllProblemStatistic(tryoutId, subtest)

  return (
    <TryoutReview
      reviewData={reviewData}
      userAnswerArray={userAnswerArray}
      answerKeyArray={answerArray}
      questionCalculation={problemStats}
    />
  )
}
