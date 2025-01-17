import IRTModel from "./irt-model";
import type { UserAnswer, AnswerData, CalculationResult } from "~/types/irt-calculation";


export default function calculateQuestionScore(
  answer: AnswerData,
  allUserAnswer: UserAnswer[],
  a: number,
  b: number
): CalculationResult[] {
  const { tryoutId, subtest, answerArray } = answer;

  // Split user answers into individual questions
  const userResponses = allUserAnswer.map((user) => ({
    userId: user.userId,
    answers: (user.answer?.split(',') ?? [])
  }));

  // Calculate raw scores for each question
  const rawData = answerArray.map((correctAnswer, index) => {
    const questionNumber = index + 1;

    const totalAnswer = userResponses.length;
    const trueAnswer = userResponses.filter((response) => response.answers[index] === correctAnswer).length;

    const rawScore = IRTModel(trueAnswer, totalAnswer, a, b);

    return {
      tryoutId,
      questionNumber,
      subtest,
      trueAnswer,
      totalAnswer,
      rawScore,
    };
  });

  // Normalize the scores
  const totalWeight = rawData.reduce((sum, q) => sum + q.rawScore, 0);
  const normalizedData = rawData.map((q) => ({
    tryoutId: q.tryoutId,
    questionNumber: q.questionNumber,
    subtest: q.subtest,
    trueAnswer: q.trueAnswer,
    totalAnswer: q.totalAnswer,
    score: (q.rawScore / totalWeight) * 1000,
  }));

  return normalizedData;
}

