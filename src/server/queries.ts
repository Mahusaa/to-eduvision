import "server-only"
import { db } from "./db";
import { userAnswer } from "./db/schema";

type StoredAnswer = {
  questionId: number;
  selectedAnswer: string;
};

// User
export async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.email, email),
  })
  return user;
}

// Tryout
export async function getTryoutById(id: number) {
  const tryoutData = await db.query.tryouts.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  })
  return tryoutData;
}

export async function getUserTimebyId(userId: string, tryoutId: number) {
  const userTime = await db.query.userTime.findFirst({
    where: (model, { eq }) => eq(model.userId, userId) && eq(model.tryoutId, tryoutId),
  })
  return userTime;
}

export async function getProblembySubtest(tryoutId: number, subtest: string) {
  const allProblem = await db.query.questions.findMany({
    where: (model, { eq }) => eq(model.tryoutId, tryoutId) && eq(model.subtest, subtest),
    orderBy: (model, { asc }) => asc(model.questionNumber),
  })
  return allProblem
}


// //Answer post
// export async function storeAnswer(data: AnswerData) {
//   const { userId, tryoutId, questionId, selectedAnswer } = data
//
// }

export async function fetchAnswersbySubtest(userId: string, tryoutId: number, subtest: string) {
  console.log(subtest)
  const userAnswerbySubtest = await db.query.userAnswer.findMany({
    where: (model, { eq, and }) => and(eq(model.tryoutId, tryoutId), eq(model.subtest, subtest), eq(model.userId, userId)),
  })
  return userAnswerbySubtest;
}

export async function postUserAnswer(userId: string, tryoutId: number, subtest: string, answerArray: string) {
  await db.insert(userAnswer)
    .values({
      userId,
      tryoutId,
      subtest,
      answerArray,
    }).onConflictDoUpdate({
      target: [userAnswer.userId, userAnswer.tryoutId, userAnswer.subtest],
      set: {
        answerArray,
      }
    })
}
