// pages/api/update-end.ts
import { type NextRequest, NextResponse } from "next/server";
import { updateSectionEndTime } from "~/server/queries";

interface updateSectionBody {
  sectionId: number;
  duration: number;
  subtest: string;
}

export async function POST(req: NextRequest) {
  try {
    const { sectionId, duration, subtest } = await req.json() as updateSectionBody;
    console.log(sectionId, duration, subtest, "from start-subtest")
    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 60 * 1000); // Add duration in milliseconds

    const result = await updateSectionEndTime(sectionId, subtest, endTime);
    console.log(result)

    return NextResponse.json({ success: true, end: endTime });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update end time" }, { status: 500 });
  }
}

