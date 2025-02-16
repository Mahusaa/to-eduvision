import { getQuestionAnswerData } from "~/server/queries";
import EditorInterface from "~/components/tryout-editor/EditorInterface";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";

type Params = Promise<{ subtest: string; tryoutId: number }>

export default async function TryoutEditorPage(props: { params: Params }) {
  const params = await props.params
  const subtest = params.subtest
  const tryoutId = params.tryoutId
  const data = await getQuestionAnswerData(tryoutId, subtest)

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
      <EditorInterface
        questionsData={data}
      />
    </div>
  )
}

