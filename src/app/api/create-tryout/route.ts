import { NextResponse, type NextRequest } from "next/server";
import { postCreateTryout, postQuestionsbySubtest } from "~/server/queries";

export async function POST(req: NextRequest) {
  try {
    const { tryoutName, tryoutEnd, tryoutNumber, subtestData } = await req.json();
    console.log(tryoutName, tryoutEnd, tryoutNumber, subtestData)

    const result = await postCreateTryout({ tryoutName, tryoutEnd, tryoutNumber, subtestData })
    console.log(result[0]?.tryoutId)

    const tryoutId = result[0]?.tryoutId


    await postQuestionsbySubtest(tryoutId, subtestData)





    return NextResponse.json({ message: 'Tryout Created succesfuly' }, { status: 200 });

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'An error occurred while processing the answers' }, { status: 500 })

  }

}
