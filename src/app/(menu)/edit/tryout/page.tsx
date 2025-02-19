import { getAllTryout } from "~/server/queries"
import TryoutTable from "./TryoutTable";

export default async function TryoutDashboard() {
  const allTryout = await getAllTryout();
  return (
    <div className="w-full mx-auto p-4">
      <TryoutTable tryout={allTryout} />
    </div>
  )
}

