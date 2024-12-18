import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Trophy } from 'lucide-react';
import { Button } from "~/components/ui/button";



const TryoutCard = () => {
  const mode = true
  const totalParticipants = 90

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/40 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Tryout Create</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">

          <div className="flex justify-between items-center">
            {totalParticipants && (
              <div className="flex items-center">
                <Trophy className="text-yellow-500 mr-2" size={20} />
                <div>
                  <div className="text-lg font-semibold">{totalParticipants}</div>
                  <div className="text-sm text-muted-foreground">Total Participants</div>
                </div>
              </div>
            )}
          </div>
          <Button className="w-full" variant="secondary">
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TryoutCard;


