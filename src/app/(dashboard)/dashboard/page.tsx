import { redirect } from "next/navigation";
import TryoutList from "~/components/TryoutList"
import { auth } from "~/server/auth";
import { getAllTryoutById, } from "~/server/queries";


export default async function Page() {
  const session = await auth();
  if (!session) redirect("/")
  const userId = session?.user.id
  const tryoutData = await getAllTryoutById(userId)
  return (
    <main className="p-6">
      <TryoutList tryoutData={tryoutData} userId={userId} />
    </main>
  )
}


