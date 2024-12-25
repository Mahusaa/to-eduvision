import "server-only"
import { db } from "./db";
import { answerKey, questions, userAnswer, userTime } from "./db/schema";
import { and, eq, asc } from "drizzle-orm";
import type { User } from "./db/schema";
import { tryouts } from "./db/schema";


type SubtestData = Record<string, { duration: number; total: number }>;
interface updatedData {
  problemDesc?: string;
  option?: string;
  questionImagePath?: string;
  answer?: string;
  explanation?: string;
  explanationImagePath?: string;
  linkPath?: string;
}


// User
export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.email, email),
  });

  return user ?? null;
}


export async function getTryoutById(id: number) {
  const tryoutData = await db.query.tryouts.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  })
  return tryoutData;
}

export async function getAllTryout() {
  const allTryout = await db.query.tryouts.findMany({
    columns: {
      id: true,
      tryoutNumber: true,
      mode: true,
      endedAt: true,
      duration: true,
    },
    with: {
      userTimes: {
        columns: {
          tryoutEnd: true
        }
      }

    }
  })
  return allTryout;
}

export async function startTryout(userId: string, tryoutId: number, tryoutEnd: Date) {
  await db.insert(userTime).values({
    userId,
    tryoutId,
    tryoutEnd: new Date(tryoutEnd),
  })
}


export async function updateSectionEndTime(sectionId: number, subtest: string, endTime: Date) {
  const columnMap: Record<string, keyof typeof userTime.$inferInsert> = {
    pu: "puEnd",
    pbm: "pbmEnd",
    ppu: "ppuEnd",
    kk: "kkEnd",
    lbind: "lbindEnd",
    lbing: "lbingEnd",
    pm: "pmEnd",
    tryout: "tryoutEnd",
  };
  const columnToUpdate = columnMap[subtest]
  console.log(columnToUpdate)
  if (!columnToUpdate) throw new Error("Invalid subtes")

  await db.update(userTime).set({
    [columnToUpdate]: endTime
  }).where(eq(userTime.id, sectionId))
}

export async function getUserTimebyId(userId: string, tryoutId: number) {
  const userTime = await db.query.userTime.findFirst({
    where: (model, { eq, and }) => and(eq(model.userId, userId), eq(model.tryoutId, tryoutId)),
  })
  return userTime;
}

export async function getProblembySubtest(tryoutId: number, subtest: string) {
  const allProblem = await db.query.questions.findMany({
    where: (model, { eq, and }) => and(eq(model.tryoutId, tryoutId), eq(model.subtest, subtest)),
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

export async function postSubtestEnd(userId: string, tryoutId: number, subtest: string) {
  const columnMap: Record<string, keyof typeof userTime> = {
    pu: 'puEnd',
    pbm: 'pbmEnd',
    ppu: 'ppuEnd',
    kk: 'kkEnd',
    lbind: 'lbindEnd',
    lbing: 'lbingEnd',
    pm: 'pmEnd',
  };
  const columnToUpdate = columnMap[subtest];
  if (!columnToUpdate) {
    throw new Error(`Invalid subtest: ${subtest}`);
  }
  await db.update(userTime).set({
    [columnToUpdate]: new Date(),
  }).where(and(eq(userTime.userId, userId), eq(userTime.tryoutId, tryoutId)))
}

export async function getQuestionAnswerData(tryoutId: number, subtest: string) {
  const result = await db
    .select({
      tryoutId: questions.tryoutId,
      questionNumber: questions.questionNumber,
      subtest: questions.subtest,
      problemDesc: questions.problemDesc,
      option: questions.option,
      questionImagePath: questions.imagePath,
      answer: answerKey.answer,
      explanation: answerKey.explanation,
      explanationImagePath: answerKey.imagePath,
      linkPath: answerKey.linkPath,
    })
    .from(questions)
    .leftJoin(
      answerKey,
      and(
        eq(questions.tryoutId, answerKey.tryoutId),
        eq(questions.subtest, answerKey.subtest),
        eq(questions.questionNumber, answerKey.questionNumber)
      )
    )
    .where(
      and(
        eq(questions.tryoutId, tryoutId),
        eq(questions.subtest, subtest)
      )
    )
    .groupBy(
      questions.tryoutId,
      questions.questionNumber,
      questions.subtest,
      questions.problemDesc,
      questions.option,
      questions.imagePath,
      answerKey.answer,
      answerKey.explanation,
      answerKey.imagePath,
      answerKey.linkPath
    )
    .orderBy(asc(questions.questionNumber));

  return result;
}


// Create Tryout
export async function postCreateTryout(data: {
  tryoutName: string;
  tryoutEnd: Date;
  tryoutNumber: number;
  subtestData: Record<string, { duration: number; total: number }>;
}) {
  const {
    tryoutName,
    tryoutEnd,
    tryoutNumber,
    subtestData,
  } = data;
  const totalDuration = Object.values(subtestData).reduce((sum, subtest) => {
    return sum + subtest.duration;
  }, 0);
  const adjustedDuration = totalDuration + 10

  const result = await db.insert(tryouts).values({
    name: tryoutName,
    endedAt: new Date(tryoutEnd),
    tryoutNumber,
    mode: "tutup",
    duration: adjustedDuration,
    puDuration: subtestData.pu?.duration ?? 0,
    pbmDuration: subtestData.pbm?.duration ?? 0,
    ppuDuration: subtestData.ppu?.duration ?? 0,
    kkDuration: subtestData.kk?.duration ?? 0,
    lbinDuration: subtestData.lbind?.duration ?? 0,
    lbingDuration: subtestData.lbing?.duration ?? 0,
    pmDuration: subtestData.pm?.duration ?? 0,
    puTotal: subtestData.pu?.total ?? 0,
    pbmTotal: subtestData.pbm?.total ?? 0,
    ppuTotal: subtestData.ppu?.total ?? 0,
    kkTotal: subtestData.kk?.total ?? 0,
    lbinTotal: subtestData.lbind?.total ?? 0,
    lbingTotal: subtestData.lbing?.total ?? 0,
    pmTotal: subtestData.pm?.total ?? 0,
  })
    .returning({ tryoutId: tryouts.id })

  return result

}


export async function postQuestionsbySubtest(tryoutId: number, subtestData: SubtestData) {
  const optionBuffer = '[\"Option 1\", \"Option 2\", \"Option 3\", \"Option 4\", \"Option 5\"]';
  for (const [subtest, data] of Object.entries(subtestData)) {
    const totalQuestions = data.total;

    const questionInserts = Array.from({ length: totalQuestions }, (_, index) => ({
      tryoutId,
      questionNumber: index + 1,
      subtest,
      problemDesc: null,
      option: optionBuffer,
      imagePath: null,
    }));

    await db.insert(questions).values(questionInserts);
  }
}


export async function updateQuestionbyNumber(
  tryoutId: number,
  subtest: string,
  questionNumber: number,
  updatedData: updatedData
) {

  await db.update(questions)
    .set({
      problemDesc: updatedData.problemDesc,
      option: updatedData.option,
      imagePath: updatedData.questionImagePath
    })
    .where(and(
      eq(questions.tryoutId, tryoutId),
      eq(questions.subtest, subtest),
      eq(questions.questionNumber, questionNumber)
    ));

  await db.insert(answerKey)
    .values({
      tryoutId,
      questionNumber,
      subtest,
      answer: updatedData.answer,
      explanation: updatedData.explanation,
      imagePath: updatedData.explanationImagePath,
      linkPath: updatedData.linkPath,
    }).onConflictDoUpdate({
      target: [answerKey.tryoutId, answerKey.questionNumber, answerKey.subtest],
      set: {
        answer: updatedData.answer,
        explanation: updatedData.explanation,
        imagePath: updatedData.explanationImagePath,
        linkPath: updatedData.linkPath,
      }
    })


}

