import "server-only"
import { db } from "./db";
import { answerKey, questionCalculation, questions, users, userTime, userScore, meanScore, userAnswer } from "./db/schema";
import { and, eq, asc } from "drizzle-orm";
import type { User } from "./db/schema";
import { tryouts } from "./db/schema";
import type { CalculationResult } from "~/types/irt-calculation";


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

export async function getUserAnswerByUserId(userId: string, tryoutId: number) {
  const userAnswers = await db.select({
    subtest: userAnswer.subtest,
    answerKey: userAnswer.answerArray,
  })
    .from(userAnswer)
    .where(and(eq(userAnswer.userId, userId), eq(userAnswer.tryoutId, tryoutId)))
  return userAnswers;
}


export async function getTryoutById(id: number) {
  const tryoutData = await db.query.tryouts.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  })
  return tryoutData;
}

export async function getAllTryoutById(id: string) {
  const allTryout = await db.query.tryouts.findMany({
    columns: {
      id: true,
      name: true,
      tryoutNumber: true,
      status: true,
      endedAt: true,
      duration: true,
    },
    with: {
      userTimes: {
        where: eq(userTime.userId, id),
        columns: {
          userId: true,
          tryoutEnd: true
        }
      }
    },
  })
  return allTryout;
}
export async function getAllTryout() {
  const allTryout = await db.query.tryouts.findMany({
    columns: {
      id: true,
      name: true,
      tryoutNumber: true,
      status: true,
      endedAt: true,
      duration: true,
    },
    with: {
      userTimes: {
        columns: {
          userId: true,
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


//Admin 
export async function getUsers() {
  const users = await db.query.users.findMany();
  return users;
}

export async function getUserTimebyTryoutId(tryoutId: number) {
  const result = await db.select({
    id: userTime.id,
    userId: userTime.userId,
    tryoutEnd: userTime.tryoutEnd,
    puEnd: userTime.puEnd,
    pbmEnd: userTime.pbmEnd,
    ppuEnd: userTime.ppuEnd,
    kkEnd: userTime.kkEnd,
    lbindEnd: userTime.lbindEnd,
    lbingEnd: userTime.lbingEnd,
    pmEnd: userTime.pmEnd,
    userName: users.name,
    tryoutName: tryouts.name,
    tryoutNumber: tryouts.tryoutNumber,
  })
    .from(userTime)
    .innerJoin(users, eq(userTime.userId, users.id))
    .innerJoin(tryouts, eq(userTime.tryoutId, tryouts.id))
    .where(eq(userTime.tryoutId, tryoutId))
  return result
}

export async function getAnswerKeyArray(tryoutId: number, subtest: string) {
  const answerKeyData = await db
    .select({
      questionNumber: answerKey.questionNumber,
      answer: answerKey.answer,
    })
    .from(answerKey)
    .where(and(eq(answerKey.tryoutId, tryoutId), eq(answerKey.subtest, subtest)))
    .orderBy(answerKey.questionNumber);

  const maxQuestionNumber = answerKeyData.reduce(
    (max, row) => Math.max(max, row.questionNumber),
    0
  );

  const answerArray = Array(maxQuestionNumber).fill(undefined);

  answerKeyData.forEach(({ questionNumber, answer }) => {
    answerArray[questionNumber - 1] = answer ?? undefined;
  });

  return { tryoutId, subtest, answerArray };
}

export async function getUserAnswerBySubtest(tryoutId: number, subtest: string) {
  const rows = await db.select({
    userId: userAnswer.userId,
    name: users.name,
    answer: userAnswer.answerArray,
  }).from(userAnswer)
    .innerJoin(users, eq(userAnswer.userId, users.id))
    .where(and(eq(userAnswer.tryoutId, tryoutId), eq(userAnswer.subtest, subtest)))
  return rows
}

export async function getSpesificUserAnswer(userId: string, tryoutId: number, subtest: string) {
  const answer = await db.query.userAnswer.findFirst({
    where: and(eq(userAnswer.userId, userId), eq(userAnswer.tryoutId, tryoutId), eq(userAnswer.subtest, subtest))
  })
  return answer
}


//IRT calculations

export async function postQuestionsScore(calculationResults: CalculationResult[]) {
  for (const result of calculationResults) {
    await db.insert(questionCalculation).values({
      tryoutId: result.tryoutId,
      questionNumber: result.questionNumber,
      subtest: result.subtest,
      trueAnswer: result.trueAnswer,
      totalAnswer: result.totalAnswer,
      score: result.score.toString(),
    }).onConflictDoUpdate({
      target: [questionCalculation.tryoutId, questionCalculation.subtest, questionCalculation.questionNumber],
      set: {
        trueAnswer: result.trueAnswer,
        totalAnswer: result.totalAnswer,
        score: result.score.toString(),
      }
    })
  }
}

export async function postSubtestScore(users: { userId: string | null, tryoutId: number, subtestScore: number }[], subtest: string) {

  const columnMap: Record<string, string> = {
    pu: "puScore",
    pbm: "pbmScore",
    ppu: "ppuScore",
    kk: "kkScore",
    lbind: "lbindScore",
    lbing: "lbingScore",
    pm: "pmScore",
  };

  const columnToUpdate = columnMap[subtest];
  if (!columnToUpdate) {
    throw new Error(`Invalid subtest type: ${subtest}`);
  }


  for (const user of users) {
    if (!user.userId) {
      console.warn("Skipping user with null userId");
      continue;
    }
    await db.insert(userScore)
      .values({
        userId: user.userId,
        tryoutId: user.tryoutId,
        [columnToUpdate]: user.subtestScore,
      })
      .onConflictDoUpdate({
        target: [userScore.userId, userScore.tryoutId],
        set: {
          [columnToUpdate]: user.subtestScore,
        }
      })
  }
}

interface UserScore {
  userName: string | null;
  userId: string | null;
  tryoutId: number | null;
  puScore: string | null;
  pbmScore: string | null;
  ppuScore: string | null;
  kkScore: string | null;
  lbindScore: string | null;
  lbingScore: string | null;
  pmScore: string | null;
}


export async function getAllUserScore(tryoutId: number) {
  const result = await db
    .select({
      userName: users.name,
      userId: userScore.userId,
      tryoutId: userScore.tryoutId,
      puScore: userScore.puScore,
      pbmScore: userScore.pbmScore,
      ppuScore: userScore.ppuScore,
      kkScore: userScore.kkScore,
      lbindScore: userScore.lbindScore,
      lbingScore: userScore.lbingScore,
      pmScore: userScore.pmScore,
    })
    .from(userScore)
    .innerJoin(users, eq(userScore.userId, users.id))
    .where(eq(userScore.tryoutId, tryoutId));
  return result;
}

export async function postMeanScore(tryoutId: number) {
  function calculateMean(scores: UserScore[], scoreField: keyof UserScore): string {
    const total = scores.reduce((sum, score) => {
      const scoreValue = score[scoreField];
      const validScoreValue = scoreValue
        ? typeof scoreValue === 'number'
          ? scoreValue
          : parseFloat(scoreValue)
        : 0;
      return sum + validScoreValue;
    }, 0);
    const mean = scores.length > 0 ? total / scores.length : 0;
    return mean.toFixed(2);
  }


  const result: UserScore[] = await getAllUserScore(tryoutId);
  const meansScores = {
    puScore: calculateMean(result, 'puScore'),
    pbmScore: calculateMean(result, 'pbmScore'),
    ppuScore: calculateMean(result, 'ppuScore'),
    kkScore: calculateMean(result, 'kkScore'),
    lbindScore: calculateMean(result, 'lbindScore'),
    lbingScore: calculateMean(result, 'lbingScore'),
    pmScore: calculateMean(result, 'pmScore'),
  };

  const isExisting = await db.select().from(meanScore).where(eq(meanScore.tryoutId, tryoutId)).limit(1);

  if (isExisting.length > 0) {
    await db.update(meanScore)
      .set({
        puScore: meansScores.puScore,
        pbmScore: meansScores.pbmScore,
        ppuScore: meansScores.ppuScore,
        kkScore: meansScores.kkScore,
        lbindScore: meansScores.lbindScore,
        lbingScore: meansScores.lbingScore,
        pmScore: meansScores.pmScore,

      })
      .where(eq(meanScore.tryoutId, tryoutId))
  } else {
    await db.insert(meanScore).values({
      tryoutId,
      puScore: meansScores.puScore,
      pbmScore: meansScores.pbmScore,
      ppuScore: meansScores.ppuScore,
      kkScore: meansScores.kkScore,
      lbindScore: meansScores.lbindScore,
      lbingScore: meansScores.lbingScore,
      pmScore: meansScores.pmScore,
    })
  }
}


//Summary Tryout
export async function calculateCorrectIncorrect(userId: string, tryoutId: number) {
  const userAnswers = await getUserAnswerByUserId(userId, tryoutId);
  const results: Record<string, { correct: number, incorrect: number }> = {};

  for (const userAnswer of userAnswers) {
    const { subtest, answerKey: userAnswerArray } = userAnswer;


    if (!subtest) {
      continue;
    }
    const { answerArray: correctAnswerArray } = await getAnswerKeyArray(tryoutId, subtest);

    let correct = 0;
    let incorrect = 0;

    if (typeof userAnswerArray === 'string') {
      const userAnswerArrayParsed = userAnswerArray.split(',');
      userAnswerArrayParsed.forEach((userAnswer: string, index: number) => {
        if (userAnswer === '') {
          incorrect += 1;
        } else if (userAnswer === correctAnswerArray[index]) {
          correct += 1;
        } else {
          incorrect += 1;
        }
      });
    } else {
      console.warn(`userAnswerArray is not a valid string for subtest: ${subtest}`);
    }
    results[subtest] = { correct, incorrect };
  }
  return results;
}


export async function getMeanScore(tryoutId: number) {
  const result = await db.query.meanScore.findFirst({
    where: eq(meanScore.tryoutId, tryoutId),
  })
  return result;
}

export async function getAllProblemStatistic(tryoutId: number, subtest: string) {
  const result = await db.query.questionCalculation.findMany({
    where: and(eq(questionCalculation.tryoutId, tryoutId), eq(questionCalculation.subtest, subtest)),
    orderBy: [asc(questionCalculation.questionNumber)]
  })
  return result

}

export async function getUserScoreByTOandUserId(userId: string, tryoutId: number) {
  const result = await db.query.userScore.findFirst({
    where: and(eq(userScore.userId, userId), eq(userScore.tryoutId, tryoutId))
  })
  return result;
}
