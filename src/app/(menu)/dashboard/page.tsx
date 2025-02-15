import { redirect } from "next/navigation";
import TryoutList from "~/components/TryoutList"
import { auth } from "~/server/auth";
import { getAllTryoutById } from "~/server/queries";
import Loading from "../loading";
import { Suspense } from "react";


export default async function Page() {
  const session = await auth();
  if (!session) return null
  const userId = session?.user.id
  const tryoutData = await getAllTryoutById(userId)
  return (
    <main className="p-6">
      <Suspense fallback={<Loading />}>
        <TryoutList tryoutData={tryoutData} userId={userId} />
      </Suspense>
    </main>
  )
}


