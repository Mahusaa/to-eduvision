import TryoutOverview from "~/components/TryoutOverview";
import { getTryoutById, getUserTimebyId } from "~/server/queries";

export default async function TryoutPage({
  params
}: {
  params: Promise<{ tryoutId: number; userId: string }>
}) {
  const tryoutId = (await params).tryoutId
  const userId = (await params).userId
  const tryoutData = await getTryoutById(tryoutId);
  if (!tryoutData) return null
  const tryoutTime = await getUserTimebyId(userId, tryoutId);
  const tryoutLeft = tryoutTime!.tryoutEnd
  console.log(tryoutLeft)

  return (
    <>
      <TryoutOverview
        tryoutData={tryoutData}
        tryoutLeft={tryoutLeft} />
    </>)
}


