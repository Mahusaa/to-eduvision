import { AdminLeaderboard } from "~/components/admin-interface/AdminLeaderboard"
import DisplayIRTProcessing from "~/components/admin-interface/IRTProcessing"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "~/components/ui/tabs"
import { getAllUserScore } from "~/server/queries";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";


type Params = Promise<{ tryoutId: number }>

export default async function Page(props: { params: Params }) {
  const session = await auth()
  if (!(session?.user.role === "admin" || session?.user.role === "mulyono")) return redirect("/dashboard");

  const params = await props.params;
  const tryoutId = params.tryoutId;
  const allUserScore = await getAllUserScore(tryoutId)
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">IRT Assessment Dashboard</h1>
      <Tabs defaultValue="assessment" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assessment">IRT Assessment</TabsTrigger>
          <TabsTrigger value="results">Results & Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="assessment">
          <DisplayIRTProcessing tryoutId={tryoutId} />
        </TabsContent>
        <TabsContent value="results">
          <AdminLeaderboard userScores={allUserScore} />
        </TabsContent>
      </Tabs>
    </div>

  )
}
