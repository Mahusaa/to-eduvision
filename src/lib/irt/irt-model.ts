export default function IRTModel(trueAnswer: number, totalAnswer: number, a: number, b: number): number {
  const x = trueAnswer / totalAnswer;
  return 0.2 + ((1 - 0.2) / (1 + Math.exp(a * (x - b))));
}
