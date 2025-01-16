import type { UserAnswer } from "~/types/irt-calculation";

export async function calculateSubtestScores(answerArray: string[], scoreArray: number[], allUserAnswer: UserAnswer[], tryoutId: number) {
  const results = [];
  for (const user of allUserAnswer) {
    const length = scoreArray.length;
    const userAnswerArray = user.answer?.split(',') ?? [];
    let subtestScore = 0;
    for (let i = 0; i < length; i++) {
      const isAnswerCorrect = userAnswerArray[i] === answerArray[i]
      const score = isAnswerCorrect ? (Number(scoreArray[i])) : 0;

      subtestScore += score;

    }
    results.push({
      userId: user.userId,
      tryoutId,
      subtestScore,
    });
  }
  return results
}



