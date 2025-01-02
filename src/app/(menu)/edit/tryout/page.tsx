import { getAllTryout } from "~/server/queries"
import TryoutTable from "./TryoutTable";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function TryoutDashboard() {
  const session = await auth()
  if (!(session?.user.role === "admin" || session?.user.role === "mulyono")) return redirect("/dashboard");
  const allTryout = await getAllTryout();
  return (
    <div className="w-full mx-auto p-4">
      <TryoutTable tryout={allTryout} />
    </div>
  )
}

