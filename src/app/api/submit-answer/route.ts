import { NextResponse } from 'next/server';
import { postUserAnswer } from '~/server/queries';

export async function POST(req: Request) {
  try {
    // Parse the incoming JSON body
    const { answerArray, subtest, userId, tryoutId } = await req.json();
    await postUserAnswer(userId, tryoutId, subtest, answerArray)

    return NextResponse.json({ message: 'Answers submitted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error processing answers:', error);
    return NextResponse.json({ error: 'An error occurred while processing the answers' }, { status: 500 });
  }
}
