
import { getUserTimebyTryoutId } from "~/server/queries"
import TimeTable from "~/components/admin-interface/TimeTable";



type Params = Promise<{ tryoutId: number }>

export default async function Page(props: { params: Params }) {
  const params = await props.params
  const tryoutId = params.tryoutId
  const userTimes = await getUserTimebyTryoutId(tryoutId)
  return (
    <div className="w-full mx-auto p-4">
      <TimeTable
        userTimes={userTimes}
      />
    </div>

  )

}
