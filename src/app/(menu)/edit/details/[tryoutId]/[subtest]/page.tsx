import AnswerTable from "~/components/admin-interface/AnswerTable";
import { calculateCorrectIncorrect, getAnswerKeyArray, getUserAnswerBySubtest } from "~/server/queries";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

type Params = Promise<{ subtest: string; tryoutId: number }>


interface User {
  id: string;
  name: string;
  answers: string[];
}

export default async function DetailTryout(props: { params: Params }) {
  const session = await auth()
  if (!(session?.user.role === "admin" || session?.user.role === "mulyono")) return redirect("/dashboard");

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

  const testAnswerCorrect = await calculateCorrectIncorrect(session.user.id, tryoutId)
  console.log(testAnswerCorrect);

  return (
    <div className="w-full mx-auto p-4 ">
      <Link href={"/edit/tryout"}>
        <Button
          variant="ghost"
          className="mb-3"
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Back</Button>
      </Link>
      <AnswerTable userAnswer={formattedData} answerKey={answerKeyArray} />
    </div>
  )
}
