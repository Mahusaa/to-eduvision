import { redirect } from "next/navigation";
import TryoutOverview from "~/components/TryoutOverview";
import { auth } from "~/server/auth";
import { getTryoutById, getUserTimebyId } from "~/server/queries";

export default async function TryoutPage({
  params
}: {
  params: Promise<{ tryoutId: number; userId: string }>
}) {
  const session = await auth()
  if (!session) return redirect("/sign-in")
  const tryoutId = (await params).tryoutId
  const userId = (await params).userId
  const tryoutData = await getTryoutById(tryoutId);
  if (!tryoutData) return null
  const tryoutTime = await getUserTimebyId(userId, tryoutId);
  if (!tryoutTime) return null
  const tryoutLeft = tryoutTime.tryoutEnd

  return (
    <>
      <TryoutOverview
        tryoutData={tryoutData}
        tryoutLeft={tryoutLeft}
        tryoutTime={tryoutTime}
      />
    </>)
}


