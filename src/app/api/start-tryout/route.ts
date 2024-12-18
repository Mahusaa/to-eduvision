import { NextResponse, type NextRequest } from "next/server";
import { startTryout } from "~/server/queries";


interface startSubtetsBody {
  userId: string;
  tryoutId: number;
  tryoutEnd: Date;
}

export async function POST(req: NextRequest) {
  try {
    const { userId, tryoutId, tryoutEnd } = await req.json() as startSubtetsBody;
    console.log(userId, tryoutId, tryoutEnd, "from server")


    await startTryout(userId, tryoutId, tryoutEnd)



    return NextResponse.json({ message: "Success start tryout" })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error during starting tryout" })
  }
}
