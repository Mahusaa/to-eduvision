import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";



interface TryoutCardProps {
  id: number;
  name: string;
  mode: boolean;
  score?: number;
  correctAnswers?: number;
  totalQuestions: number;
}

const TryoutCard = ({
  id,
  name,
  mode,
  score,
  correctAnswers,
  totalQuestions,
}: TryoutCardProps) => {
  const percentage = mode && correctAnswers ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const ranking = 2
  const totalParticipants = 100
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/40 p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          {mode && (
            <span className={`rounded-full px-2 py-1 text-sm ${percentage >= 70 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
              {correctAnswers}/{totalQuestions}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {mode ? (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-3xl font-bold">{score}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </div>
                {ranking && totalParticipants && (
                  <div className="flex items-center">
                    <div>
                      <div className="text-lg font-semibold">{ranking}/{totalParticipants}</div>
                      <div className="text-sm text-muted-foreground">Ranking</div>
                    </div>
                  </div>
                )}
              </div>
              <Button className="w-full" variant="outline">
                Lihat Pembahasan
              </Button>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  {totalQuestions} Questions
                </div>
              </div>
              <Button className="w-full">
                Start
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}



export default TryoutCard;
