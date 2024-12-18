import { NextResponse, type NextRequest } from "next/server";
import { updateQuestionbyNumber } from "~/server/queries";

interface updatedData {
  problemDesc?: string;
  option?: string;
  questionImagePath?: string;
  answer?: string;
  explanation?: string;
  explanationImagePath?: string;
  linkPath?: string;
}


interface updateQuestionsBody {
  tryoutId: number;
  subtest: string;
  questionNumber: number;
  updatedData: updatedData;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    const { tryoutId, subtest, questionNumber, updatedData } = JSON.parse(body) as updateQuestionsBody;


    await updateQuestionbyNumber(tryoutId, subtest, questionNumber, updatedData)

    return NextResponse.json({ success: true, message: "successfuly update questions" })

  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ message: "eror bro" }), { status: 200 })

  }


}
