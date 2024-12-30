import AnswerTable from "~/components/admin-interface/AnswerTable";
import { getAnswerKeyArray, getUserAnswerBySubtest } from "~/server/queries";

type Params = Promise<{ subtest: string; tryoutId: number }>


interface User {
  id: string;
  name: string;
  answers: string[];
}

export default async function DetailTryout(props: { params: Params }) {
  const params = await props.params
  const subtest = params.subtest
  const tryoutId = params.tryoutId
  const answerKey = await getAnswerKeyArray(tryoutId, subtest)
  const answerKeyArray = answerKey.answerArray
  const userAnswer = await getUserAnswerBySubtest(tryoutId, subtest)
  const formattedData: User[] = userAnswer
    .filter(item => item.userId !== null) // Exclude invalid userIds
    .map(item => ({
      id: item.userId!, // Non-null assertion after filtering
      name: item.name,
      answers: item.answer
        ? item.answer.split(",").map(value => (value === "" ? null : value)).filter(v => v !== null)
        : [] // Convert `null` to an empty array
    }))

  return (
    <div className="w-full mx-auto p-4">
      <AnswerTable userAnswer={formattedData} answerKey={answerKeyArray} />
    </div>
  )
}
