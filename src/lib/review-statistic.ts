class QuestionEvaluator {
  private trueAnswer: number;
  private totalAnswer: number;

  constructor(trueAnswer: number, totalAnswer: number) {
    this.trueAnswer = trueAnswer;
    this.totalAnswer = totalAnswer;
  }

  private getAccuracy(): number {
    return this.trueAnswer / this.totalAnswer;
  }

  get difficulty(): "Easy" | "Medium" | "Hard" {
    const accuracy = this.getAccuracy();
    if (accuracy >= 0.7) return "Easy";
    if (accuracy >= 0.4) return "Medium";
    return "Hard";
  }

  get rating(): number {
    const accuracy = this.getAccuracy();
    if (accuracy >= 0.8) return 0.5;
    if (accuracy >= 0.7) return 1.0;
    if (accuracy >= 0.6) return 1.5;
    if (accuracy >= 0.5) return 2.0;
    if (accuracy >= 0.4) return 2.5;
    if (accuracy >= 0.3) return 3.0;
    if (accuracy >= 0.2) return 3.5;
    if (accuracy >= 0.1) return 4.0;
    if (accuracy >= 0.08) return 4.5;
    return 5.0;
  }

  get incorrectPercentage(): number {
    return (1 - this.getAccuracy()) * 100;
  }
}

// Example Usage:
const question = new QuestionEvaluator(2, 2);

console.log(question.difficulty); // "Easy"
console.log(question.rating); // 5
console.log(question.incorrectPercentage); // 0

const question2 = new QuestionEvaluator(1, 2);
console.log(question2.difficulty); // "Medium"
console.log(question2.rating); // 3
console.log(question2.incorrectPercentage); // 50

