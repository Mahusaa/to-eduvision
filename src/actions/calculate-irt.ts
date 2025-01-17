'use server'

import { revalidatePath } from 'next/cache'
import calculateQuestionScore from '~/lib/irt/calculate-questions-score';
import scoreArray from '~/lib/irt/score-array';
import { calculateSubtestScores } from '~/lib/irt/user-score-bysubtest';
import { getAnswerKeyArray, postQuestionsScore, getUserAnswerBySubtest, postSubtestScore } from '~/server/queries';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))



interface StepState {
  timestamp: string;
  message: string;
  details: string;
  status: 'complete' | 'error' | null;
}


interface prevState {
  currentStep: number
  steps: StepState[]
  error: string,
  isComplete: boolean
  stepDetails: string
}

export async function calculateIRT(step: number, prevState: prevState, tryoutId: number) {
  const state = { ...prevState }

  switch (step) {
    case 1:
      await delay(1000)
      state.stepDetails = `Retrieved  user answers`
      break
    case 2:
      const answerDataPU = await getAnswerKeyArray(tryoutId, "pu")
      const allUserAnswerPU = await getUserAnswerBySubtest(tryoutId, "pu")
      const answerArrayPU = answerDataPU.answerArray as string[];
      const resultScorePU = calculateQuestionScore(answerDataPU, allUserAnswerPU, 12, 0.4)
      await postQuestionsScore(resultScorePU)
      const scoreArraysPU = scoreArray(resultScorePU)
      const resultPU = await calculateSubtestScores(answerArrayPU, scoreArraysPU, allUserAnswerPU, tryoutId)
      await postSubtestScore(resultPU, "pu")
      state.stepDetails = `Calculated weight each question and scoring for Penalaran Umum`
      break
    case 3:
      const answerDataKK = await getAnswerKeyArray(tryoutId, "kk")
      const allUserAnswerKK = await getUserAnswerBySubtest(tryoutId, "kk")
      const answerArrayKK = answerDataKK.answerArray as string[];
      const resultScoreKK = calculateQuestionScore(answerDataKK, allUserAnswerKK, 12, 0.4)
      await postQuestionsScore(resultScoreKK)
      const scoreArraysKK = scoreArray(resultScoreKK)
      const resultKK = await calculateSubtestScores(answerArrayKK, scoreArraysKK, allUserAnswerKK, tryoutId)
      await postSubtestScore(resultKK, "kk")
      state.stepDetails = `Calculated weight each question and scoring for Kemampuan Kuantitatif`
      break
    case 4:
      const answerDataPBM = await getAnswerKeyArray(tryoutId, "pbm")
      const allUserAnswerPBM = await getUserAnswerBySubtest(tryoutId, "pbm")
      const answerArrayPBM = answerDataPBM.answerArray as string[];
      const resultScorePBM = calculateQuestionScore(answerDataPBM, allUserAnswerPBM, 12, 0.4)
      await postQuestionsScore(resultScorePBM)
      const scoreArraysPBM = scoreArray(resultScorePBM)
      const resultPBM = await calculateSubtestScores(answerArrayPBM, scoreArraysPBM, allUserAnswerPBM, tryoutId)
      await postSubtestScore(resultPBM, "pbm")
      state.stepDetails = `Calculated weights each question and scoring Pemahaman Bacaan dan Menulis`
      break
    case 5:
      const answerDataPPU = await getAnswerKeyArray(tryoutId, "ppu")
      const allUserAnswerPPU = await getUserAnswerBySubtest(tryoutId, "ppu")
      const answerArrayPPU = answerDataPPU.answerArray as string[];
      const resultScorePPU = calculateQuestionScore(answerDataPPU, allUserAnswerPPU, 12, 0.4)
      await postQuestionsScore(resultScorePPU)
      const scoreArraysPPU = scoreArray(resultScorePPU)
      const resultPPU = await calculateSubtestScores(answerArrayPPU, scoreArraysPPU, allUserAnswerPPU, tryoutId)
      await postSubtestScore(resultPPU, "ppu")
      state.stepDetails = `Calculated weights each question and scoring Pengetahuan dan Pemahaman Umum`
      break
    case 6:
      const answerDataLBIND = await getAnswerKeyArray(tryoutId, "lbind")
      const allUserAnswerLBIND = await getUserAnswerBySubtest(tryoutId, "lbind")
      const answerArrayLBIND = answerDataLBIND.answerArray as string[];
      const resultScoreLBIND = calculateQuestionScore(answerDataLBIND, allUserAnswerLBIND, 12, 0.4)
      await postQuestionsScore(resultScoreLBIND)
      const scoreArraysLBIND = scoreArray(resultScoreLBIND)
      const resultLBIND = await calculateSubtestScores(answerArrayLBIND, scoreArraysLBIND, allUserAnswerLBIND, tryoutId)
      await postSubtestScore(resultLBIND, "lbind")
      state.stepDetails = `Calculated weights each question and scoring Literasi Bahasa Indonesia`
      break
    case 7:
      const answerDataLBING = await getAnswerKeyArray(tryoutId, "lbing")
      const allUserAnswerLBING = await getUserAnswerBySubtest(tryoutId, "lbing")
      const answerArrayLBING = answerDataLBING.answerArray as string[];
      const resultScoreLBING = calculateQuestionScore(answerDataLBING, allUserAnswerLBING, 12, 0.4)
      await postQuestionsScore(resultScoreLBING)
      const scoreArraysLBING = scoreArray(resultScoreLBING)
      const resultLBING = await calculateSubtestScores(answerArrayLBING, scoreArraysLBING, allUserAnswerLBING, tryoutId)
      await postSubtestScore(resultLBING, "lbing")
      state.stepDetails = `Calculated weights each question and scoring Literasi Bahasa Inggris`
      break
    case 8:
      const answerDataPM = await getAnswerKeyArray(tryoutId, "pm")
      const allUserAnswerPM = await getUserAnswerBySubtest(tryoutId, "pm")
      const answerArrayPM = answerDataPM.answerArray as string[];
      const resultScorePM = calculateQuestionScore(answerDataPM, allUserAnswerPM, 12, 0.4)
      await postQuestionsScore(resultScorePM)
      const scoreArraysPM = scoreArray(resultScorePM)
      const resultPM = await calculateSubtestScores(answerArrayPM, scoreArraysPM, allUserAnswerPM, tryoutId)
      await postSubtestScore(resultPM, "pm")
      state.stepDetails = `Calculated weights each question and scoring Penalaran Matematika`
      break
    case 9:
      await delay(1000)
      state.stepDetails = `Computed final score`
      break
    default:
      throw new Error('Invalid step')
  }

  revalidatePath('/irt-processing')
  return state
}


