import { Suspense } from "react";
import TryoutOverview from "~/components/TryoutOverview";
import { getTryoutById, getUserTimebyId } from "~/server/queries";
import Loading from "./loading";

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
  if (!tryoutTime) return null
  const tryoutLeft = tryoutTime.tryoutEnd

  return (
    <>
      <Suspense fallback={<Loading />}>
        {/* Tryout Overview Component */}
        <TryoutOverview
          tryoutData={tryoutData}
          tryoutLeft={tryoutLeft}
          tryoutTime={tryoutTime}
        />
      </Suspense>
    </>
  )
}


