import { NextResponse, type NextRequest } from "next/server";
import { postCreateTryout, postQuestionsbySubtest } from "~/server/queries";

interface TryoutRequestBody {
  tryoutName: string;
  tryoutEnd: Date;
  tryoutNumber: number;
  subtestData: SubtestData;
}
type SubtestData = Record<string, { duration: number; total: number }>;

export async function POST(req: NextRequest) {
  try {
    // Parse the request body and assert the types
    const { tryoutName, tryoutEnd, tryoutNumber, subtestData } = await req.json() as TryoutRequestBody;

    // Assuming `postCreateTryout` returns an array with an object that contains `tryoutId`
    const result = await postCreateTryout({ tryoutName, tryoutEnd, tryoutNumber, subtestData });
    console.log(result[0]?.tryoutId);

    const tryoutId = result[0]?.tryoutId;

    // Call the postQuestionsbySubtest function with the tryoutId and subtestData
    if (tryoutId) {
      await postQuestionsbySubtest(tryoutId, subtestData);
    } else {
      throw new Error("Tryout ID is missing.");
    }

    // Return a success response
    return NextResponse.json({ message: 'Tryout Created successfully' }, { status: 200 });

  } catch (error) {
    console.error(error);
    // Return an error response
    return NextResponse.json({ error: 'An error occurred while processing the answers' }, { status: 500 });
  }
}

