import { TryoutMakerDialog } from "~/components/tryout-editor/TryoutMakerDialog"
import { Button } from "~/components/ui/button"
import { getAllTryout } from "~/server/queries"
import { TryoutCard } from "./TryoutCard";

export default async function TryoutDashboard() {
  const allTryout = await getAllTryout();
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 text-right">
        <TryoutMakerDialog>
          <Button>Add Tryout</Button>
        </TryoutMakerDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allTryout.map((tryout) => (
          <TryoutCard key={tryout.id} tryout={tryout} />
        ))}
      </div>
    </div>
  )
}

