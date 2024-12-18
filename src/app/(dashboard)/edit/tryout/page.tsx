import { TryoutMakerDialog } from "~/components/tryout-editor/TryoutMakerDialog"
import TryoutCard from "./TryoutCard"
import { Button } from "~/components/ui/button"

export default function TryoutDashboard() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 text-right">
        <TryoutMakerDialog><Button >Add Tryout</Button></TryoutMakerDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TryoutCard />
        <TryoutCard />
        <TryoutCard />
        <TryoutCard />
        <TryoutCard />

      </div>
    </div>
  )
}

