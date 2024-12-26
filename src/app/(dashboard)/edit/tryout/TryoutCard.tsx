import { Trophy } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { EditTryoutDialog } from '~/components/EditTryoutDialog'

interface TryoutCardProps {
  tryout: {
    id: number
    tryoutNumber: number
    status: 'closed' | 'open' | 'completed'
    endedAt: Date
    duration: number | null
    userTimes: {
      tryoutEnd: Date | null
    }[]
  }
}

export function TryoutCard({ tryout }: TryoutCardProps) {
  // Format the end date
  const endDate = new Date(tryout.endedAt).toLocaleDateString()



  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle>Tryout #{tryout.tryoutNumber}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <div>
            <div className="text-2xl font-bold">{tryout.userTimes.length}</div>
            <div className="text-sm text-muted-foreground">Total Participants</div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Duration: {tryout.duration} minutes</div>
          <div className="text-sm text-muted-foreground">Ends: {endDate}</div>
        </div>
      </CardContent>
      <CardFooter>
        <EditTryoutDialog tryoutId={tryout.id} />
      </CardFooter>
    </Card>
  )
}


