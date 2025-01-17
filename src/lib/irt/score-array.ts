import { type CalculationResult } from "~/types/irt-calculation";
export default function scoreArray(data: CalculationResult[]) {
  const scores: number[] = [];

  data.forEach(item => {
    scores[item.questionNumber - 1] = parseFloat(item.score.toFixed(2));
  })

  return scores;

}
