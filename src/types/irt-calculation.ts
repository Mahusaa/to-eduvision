export interface AnswerData {
  tryoutId: number;
  subtest: string;
  answerArray: string[];
}

export interface UserAnswer {
  userId: string | null;
  name: string;
  answer: string | null;
}


export interface CalculationResult {
  tryoutId: number;
  questionNumber: number;
  subtest: string;
  trueAnswer: number;
  totalAnswer: number;
  score: number;
}
