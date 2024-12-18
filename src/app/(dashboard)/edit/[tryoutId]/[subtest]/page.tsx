import { getQuestionAnswerData } from "~/server/queries";
import EditorInterface from "~/components/tryout-editor/EditorInterface";


type Params = Promise<{ subtest: string; tryoutId: number }>

export default async function TryoutEditorPage(props: { params: Params }) {
  const params = await props.params
  const subtest = params.subtest
  const tryoutId = params.tryoutId
  const data = await getQuestionAnswerData(tryoutId, subtest)
  console.log(data, "this is data")

  return (
    <EditorInterface
      questionsData={data}
    />
  )
}

