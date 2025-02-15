import { auth } from "~/server/auth";
import { getAllProblemStatistic, getAnswerKeyArray, getQuestionAnswerData, getSpesificUserAnswer } from "~/server/queries";
import TryoutReview from "~/components/TryoutReview";



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
    <TryoutReview
      reviewData={reviewData}
      userAnswerArray={userAnswerArray}
      answerKeyArray={answerArray}
      questionCalculation={problemStats}
      tryoutId={tryoutId}
      subtest={subtest}
    />
  )
}
