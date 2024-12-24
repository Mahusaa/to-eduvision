import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  onQuestionChange: (index: number) => void;
}

export function QuestionNavigator({ totalQuestions, currentQuestionIndex, onQuestionChange }: QuestionNavigatorProps) {
  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-2">Nomor Soal</h2>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => (
          <Button
            key={index}
            variant={index === currentQuestionIndex ? 'default' : 'outline'}
            className="h-10 w-10"
            onClick={() => onQuestionChange(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </Card>
  )
}


