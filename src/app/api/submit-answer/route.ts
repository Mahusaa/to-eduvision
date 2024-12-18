import { NextResponse } from 'next/server';
import { postUserAnswer } from '~/server/queries';

interface submitAnswerBody {
  answerArray: string;
  subtest: string;
  userId: string;
  tryoutId: number;
}

export async function POST(req: Request) {
  try {
    const { answerArray, subtest, userId, tryoutId } = await req.json() as submitAnswerBody;
    await postUserAnswer(userId, tryoutId, subtest, answerArray)

    return NextResponse.json({ message: 'Answers submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing answers:', error);
    return NextResponse.json({ error: 'An error occurred while processing the answers' }, { status: 500 });
  }
}

