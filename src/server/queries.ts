import "server-only"
import { db } from "./db";
import { answerKey, questions, userAnswer, userTime } from "./db/schema";
import { and, eq, asc } from "drizzle-orm";
import type { User } from "./db/schema";
import { tryouts } from "./db/schema";


type SubtestData = Record<string, { duration: number; total: number }>;


// User
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.email, email),
  });

  return user ?? null;
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
