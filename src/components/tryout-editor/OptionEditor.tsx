import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Check } from "lucide-react"

interface OptionEditorProps {
  options: string[];
  isEditMode: boolean;
  correctAnswer: string | undefined | null;
  onOptionChange: (optionId: number, value: string) => void;
  onCorrectAnswerChange: (answerLetter: string) => void;
}

export function OptionEditor({
  options,
  isEditMode,
  correctAnswer,
  onOptionChange,
  onCorrectAnswerChange
}: OptionEditorProps) {
  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <RadioGroup
      value={correctAnswer ? correctAnswer : "P"}
      onValueChange={(value) => onCorrectAnswerChange(value)}
    >
      <div className="space-y-2">
        {options.map((option, index) => (
          <div
            key={`option-${index}`}
            className="flex items-center space-x-2"
          >
            <RadioGroupItem
              value={optionLetters[index]!}
              id={`option-${index}`}
            />
            {isEditMode ? (
              <div className="flex items-center space-x-2 flex-grow">
                <Input
                  value={option}
                  onChange={(e) =>
                    onOptionChange(index, e.target.value)
                  }
                  className={`flex-1 ${optionLetters[index] === correctAnswer ? 'border-green-500' : ''}`}
                />
                {optionLetters[index] === correctAnswer && (
                  <Check className="text-green-500" size={20} />
                )}
              </div>
            ) : (
              <Label
                htmlFor={`option-${index}`}
                className={correctAnswer === optionLetters[index] ? "font-bold text-green-600" : ""}
              >
                {option}
                {correctAnswer === optionLetters[index] && " (Correct)"}
              </Label>
            )}
          </div>
        ))}
      </div>
    </RadioGroup>
  )
}


